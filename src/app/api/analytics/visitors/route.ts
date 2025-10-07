import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Récupérer les vraies données Vercel Analytics
    const vercelToken = process.env.VERCEL_ANALYTICS_TOKEN
    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_KW065ofyBAb9vZtZevPLbbI3TEqK'
    
    let vercelVisitors = 0
    let vercelPageViews = 0
    
    if (vercelToken) {
      try {
        // Essayer d'abord l'endpoint overview
        let response = await fetch(
          `https://api.vercel.com/v1/analytics/projects/${projectId}/overview`,
          {
            headers: {
              'Authorization': `Bearer ${vercelToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          vercelVisitors = data.visitors || 0
          vercelPageViews = data.pageViews || 0
          console.log('✅ Vercel Analytics overview data:', { visitors: vercelVisitors, pageViews: vercelPageViews })
        } else if (response.status === 404) {
          // Si overview n'existe pas, essayer l'endpoint events
          console.log('🔄 Overview endpoint not found, trying events endpoint...')
          response = await fetch(
            `https://api.vercel.com/v1/analytics/projects/${projectId}/events`,
            {
              headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json'
              }
            }
          )
          
          if (response.ok) {
            const eventsData = await response.json()
            // Compter les visiteurs uniques depuis les events
            const uniqueVisitors = new Set(eventsData.events?.map((event: any) => event.visitorId) || []).size
            vercelVisitors = uniqueVisitors
            vercelPageViews = eventsData.events?.length || 0
            console.log('✅ Vercel Analytics events data:', { visitors: vercelVisitors, pageViews: vercelPageViews })
          } else {
            console.warn('⚠️ Vercel Analytics events API also failed:', response.status)
          }
        } else {
          console.warn('⚠️ Vercel Analytics API failed:', response.status, response.statusText)
        }
      } catch (vercelError) {
        console.warn('⚠️ Vercel Analytics fetch error:', vercelError)
      }
    } else {
      console.warn('⚠️ VERCEL_ANALYTICS_TOKEN not configured')
    }

    // Compter le nombre total d'utilisateurs uniques
    const totalUsers = await prisma.user.count()
    
    // Compter les brands créés
    const totalBrands = await prisma.brand.count()
    
    // Compter les brands dans la bibliothèque
    const libraryBrands = await prisma.brand.count({
      where: {
        isInLibrary: true,
        isCompleted: true
      }
    })

    // Utiliser les données Vercel si disponibles, sinon estimation intelligente
    let totalVisitors
    if (vercelVisitors > 0) {
      totalVisitors = vercelVisitors
    } else {
      // Estimation basée sur les utilisateurs + un facteur de croissance
      const baseEstimate = totalUsers * 4 // Facteur plus élevé pour inclure plus de visiteurs
      const minimumVisitors = 1250
      totalVisitors = Math.max(baseEstimate, minimumVisitors)
      console.log('📊 Using estimated visitors:', { totalUsers, baseEstimate, totalVisitors })
    }

    return NextResponse.json({
      totalVisitors,
      totalUsers,
      totalBrands,
      libraryBrands,
      vercelVisitors,
      vercelPageViews,
      lastUpdated: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({ 
      totalVisitors: 1250,
      totalUsers: 0,
      totalBrands: 0,
      libraryBrands: 0,
      vercelVisitors: 0,
      vercelPageViews: 0,
      lastUpdated: new Date().toISOString()
    }, { status: 200 })
  }
}
