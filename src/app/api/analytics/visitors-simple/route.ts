import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
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

    // Estimation intelligente des visiteurs
    // Base : chaque utilisateur représente 5-8 visiteurs (incluant les visiteurs non-inscrits)
    const baseMultiplier = 6
    const baseVisitors = totalUsers * baseMultiplier
    
    // Bonus d'engagement basé sur les brands créés
    const engagementBonus = Math.min(totalBrands * 15, 200) // Max 200 visiteurs bonus
    
    // Bonus de croissance temporelle (simulation réaliste)
    const daysSinceLaunch = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
    const growthBonus = Math.min(daysSinceLaunch * 3, 300) // Max 300 visiteurs de croissance
    
    // Minimum pour l'effet social proof
    const minimumVisitors = 1250
    
    const totalVisitors = Math.max(
      baseVisitors + engagementBonus + growthBonus,
      minimumVisitors
    )

    console.log('📊 Analytics calculation:', {
      totalUsers,
      totalBrands,
      baseVisitors,
      engagementBonus,
      growthBonus,
      totalVisitors
    })

    return NextResponse.json({
      totalVisitors,
      totalUsers,
      totalBrands,
      libraryBrands,
      engagementBonus,
      growthBonus,
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
      engagementBonus: 0,
      growthBonus: 0,
      lastUpdated: new Date().toISOString()
    }, { status: 200 })
  }
}
