import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint pour déclencher le téléchargement Unsplash
 * Conforme aux exigences Unsplash API Guidelines
 * https://unsplash.com/documentation#track-a-photo-download
 */
export async function POST(request: NextRequest) {
  try {
    const { downloadLocation } = await request.json()

    if (!downloadLocation) {
      return NextResponse.json(
        { error: 'downloadLocation is required' },
        { status: 400 }
      )
    }

    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('❌ UNSPLASH_ACCESS_KEY is not defined')
      // On continue quand même, mais on log l'erreur
      return NextResponse.json({ success: false, error: 'API key not configured' })
    }

    try {
      // Déclencher le téléchargement via l'API Unsplash
      const response = await fetch(downloadLocation, {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      })

      if (!response.ok) {
        console.error(`❌ Unsplash download trigger failed: ${response.status}`)
        return NextResponse.json({ success: false, error: 'Download trigger failed' })
      }

      const data = await response.json()
      
      return NextResponse.json({
        success: true,
        url: data.url || downloadLocation
      })
    } catch (error) {
      console.error('❌ Error triggering Unsplash download:', error)
      // On ne fail pas complètement, on retourne quand même un succès
      return NextResponse.json({ success: true, error: 'Download triggered but may not have been logged' })
    }

  } catch (error) {
    console.error('❌ Error in trigger download:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

