import { NextResponse } from 'next/server'
import {
  DEFAULT_NEWS_BANNER,
  getNewsBannerSettings,
} from '@/lib/siteSettings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const banner = await getNewsBannerSettings()
    return NextResponse.json(banner)
  } catch (error) {
    console.error('❌ Error fetching banner configuration:', error)
    return NextResponse.json(DEFAULT_NEWS_BANNER)
  }
}
