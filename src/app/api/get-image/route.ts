import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/** =========================
 *  ENV
 *  ========================= */
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'votre_cle_ici'; // 200 req/h
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || '';       // optionnel

/** =========================
 *  SIMPLE RATE LIMIT (IP)
 *  120 req / heure / IP (soft)
 *  ========================= */
type Bucket = { tokens: number; updatedAt: number };
const RATE_LIMIT_MAP = new Map<string, Bucket>();
const MAX_TOKENS = 120;
const REFILL_MS = 60 * 60 * 1000; // 1h

function rateLimit(ip: string) {
  const now = Date.now();
  const b = RATE_LIMIT_MAP.get(ip) || { tokens: MAX_TOKENS, updatedAt: now };
  // refill linéaire
  const elapsed = now - b.updatedAt;
  const refill = Math.floor((elapsed / REFILL_MS) * MAX_TOKENS);
  b.tokens = Math.min(MAX_TOKENS, b.tokens + (refill > 0 ? refill : 0));
  b.updatedAt = refill > 0 ? now : b.updatedAt;
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  RATE_LIMIT_MAP.set(ip, b);
  return true;
}

/** =========================
 *  MICRO-CACHE TTL (process)
 *  ========================= */
type CacheEntry = { expires: number; payload: any };
const CACHE = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCache(key: string) {
  const e = CACHE.get(key);
  if (e && e.expires > Date.now()) return e.payload;
  if (e) CACHE.delete(key);
  return null;
}
function setCache(key: string, payload: any) {
  CACHE.set(key, { expires: Date.now() + TTL_MS, payload });
}

/** =========================
 *  QUERY ENHANCER
 *  - enrichit / normalise
 *  - accepte color/orientation
 *  ========================= */
function enhance(q: string) {
  const base = q.toLowerCase().trim();
  if (!base) return 'business office clean minimalist';
  const map: Record<string, string> = {
    'entreprise': 'business office workspace',
    'startup': 'startup modern office',
    'tech': 'technology startup office',
    'technologie': 'modern technology workspace',
    'voyage': 'travel vacation destination',
    'africa': 'african landscape safari sunset',
    'afrique': 'african landscape safari sunset',
    'trip': 'travel adventure vacation',
    'restaurant': 'restaurant dining food photography',
    'mode': 'fashion editoral clothing',
    'fashion': 'fashion style model',
    'immobilier': 'modern house architecture',
    'real estate': 'modern house architecture',
    'sport': 'sports fitness athlete',
    'santé': 'health wellness fitness',
    'health': 'health wellness medical',
    'éducation': 'education learning classroom',
    'education': 'education learning students',
    'art': 'artistic creative design',
    'musique': 'music concert performance',
    'music': 'music concert instruments',
    'bureau': 'minimalist workspace desk laptop',
    'design': 'minimal design grid clean',
  };
  for (const [k, v] of Object.entries(map)) {
    if (base.includes(k)) return v + ' minimal clean professional 16:9 copy space';
  }
  // si un seul mot → boost visuel générique
  if (!base.includes(' ')) return `${base} minimal clean professional 16:9 copy space`;
  return base + ' minimal clean professional 16:9 copy space';
}

/** =========================
 *  SEEDED PICKER (stable)
 *  ========================= */
function pickIndexStable(length: number, seed: string) {
  const h = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 8);
  const n = parseInt(h, 16);
  return length > 0 ? n % length : 0;
}

/** =========================
 *  COLOR UTILS
 *  - Pexels renvoie avg_color (hex)
 *  - on génère 3 variations utiles
 *  ========================= */
function clamp(v: number) { return Math.max(0, Math.min(255, v)); }
function hexToRgb(hex: string) {
  const m = hex.replace('#','').match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function tint(hex: string, p: number) { // lighten
  const c = hexToRgb(hex); if (!c) return hex;
  return rgbToHex(clamp(c.r + (255 - c.r)*p), clamp(c.g + (255 - c.g)*p), clamp(c.b + (255 - c.b)*p));
}
function shade(hex: string, p: number) { // darken
  const c = hexToRgb(hex); if (!c) return hex;
  return rgbToHex(clamp(c.r*(1-p)), clamp(c.g*(1-p)), clamp(c.b*(1-p)));
}

/** =========================
 *  FETCHERS
 *  ========================= */
async function searchPexels(params: {
  query: string; perPage?: number; page?: number;
  orientation?: 'landscape'|'portrait'|'square';
  color?: string; locale?: string;
}) {
  const { query, perPage = 10, page = 1, orientation = 'landscape', color, locale } = params;
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(Math.min(perPage, 15)));
  url.searchParams.set('page', String(page));
  url.searchParams.set('orientation', orientation);
  if (color) url.searchParams.set('color', color.replace('#',''));
  if (locale) url.searchParams.set('locale', locale);

  const r = await fetch(url.toString(), {
    headers: { Authorization: PEXELS_KEY },
    // dédupe CDN + edge; ce fetch n’est PAS mis en cache par Next (route handler)
  });
  if (!r.ok) throw new Error(`Pexels ${r.status}`);
  const data = await r.json();
  return data as any;
}

async function searchUnsplash(params: { query: string; perPage?: number; page?: number; orientation?: 'landscape'|'portrait'|'squarish'; color?: string }) {
  if (!UNSPLASH_KEY) throw new Error('Unsplash key missing');
  const { query, perPage = 10, page = 1, orientation = 'landscape', color } = params;
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(Math.min(perPage, 15)));
  url.searchParams.set('page', String(page));
  url.searchParams.set('orientation', orientation);
  if (color) url.searchParams.set('color', color.replace('#',''));
  const r = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!r.ok) throw new Error(`Unsplash ${r.status}`);
  const data = await r.json();
  return data as any;
}

/** =========================
 *  SHARED HANDLER
 *  ========================= */
type Input = {
  query?: string;
  perPage?: number;
  page?: number;
  orientation?: 'landscape'|'portrait'|'square'|'squarish';
  color?: string;       // hex (#112233) ou nom
  locale?: string;      // ex: 'fr-FR'
  seed?: string;        // stabilise le choix
  provider?: 'pexels'|'unsplash'|'auto';
};

async function handle(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
         || req.headers.get('x-real-ip')
         || '0.0.0.0';

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: corsHeaders() });
  }

  let body: Input = {};
  if (req.method === 'GET') {
    const u = new URL(req.url);
    body = {
      query: u.searchParams.get('query') || undefined,
      perPage: u.searchParams.get('perPage') ? Number(u.searchParams.get('perPage')) : undefined,
      page: u.searchParams.get('page') ? Number(u.searchParams.get('page')) : undefined,
      orientation: (u.searchParams.get('orientation') as any) || undefined,
      color: u.searchParams.get('color') || undefined,
      locale: u.searchParams.get('locale') || undefined,
      seed: u.searchParams.get('seed') || undefined,
      provider: (u.searchParams.get('provider') as any) || 'auto',
    };
  } else {
    try { body = await req.json(); } catch {}
  }

  const query = (body.query || '').trim();
  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400, headers: corsHeaders() });
  }

  const provider = body.provider || 'auto';
  const orientation = (body.orientation as any) || 'landscape';
  const perPage = Math.min(Math.max(body.perPage || 5, 1), 15);
  const page = Math.max(body.page || 1, 1);
  const color = body.color;
  const locale = body.locale;
  const seed = body.seed || `${query}:${new Date().toISOString().slice(0,10)}`; // stable par jour

  const enhanced = enhance(query);
  const cacheKey = JSON.stringify({ provider, enhanced, perPage, page, orientation, color, locale });
  const cached = getCache(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true }, { status: 200, headers: cacheHeaders() });
  }

  try {
    // 1) Provider selection
    const usePexelsFirst = provider === 'pexels' || (provider === 'auto' && PEXELS_KEY);
    let result: any = null;
    let source: 'pexels'|'unsplash'|'fallback' = 'fallback';

    if (usePexelsFirst) {
      const data = await searchPexels({ query: enhanced, perPage, page, orientation: mapOrientationPexels(orientation), color, locale });
      if (data?.photos?.length) {
        const idx = pickIndexStable(Math.min(data.photos.length, 10), seed);
        const ph = data.photos[idx];
        const avg = ph.avg_color || '#777777';
        const payload = {
          source: 'pexels',
          query,
          enhancedQuery: enhanced,
          image: {
            url: ph.src.landscape || ph.src.large2x || ph.src.large || ph.src.original,
            srcSet: {
              tiny: ph.src.tiny,
              small: ph.src.small,
              medium: ph.src.medium,
              large: ph.src.large,
              large2x: ph.src.large2x,
              landscape: ph.src.landscape,
              portrait: ph.src.portrait,
              original: ph.src.original,
            },
            width: ph.width,
            height: ph.height,
            alt: ph.alt || `${query} stock image`,
          },
          photographer: { name: ph.photographer, url: ph.photographer_url },
          palette: {
            base: avg,
            tint: tint(avg, 0.3),
            shade: shade(avg, 0.25),
          },
          attributions: {
            required: false,
            link: ph.url,
          },
        };
        result = payload;
        source = 'pexels';
      }
    }

    // 2) Fallback Unsplash (si clé présente)
    if (!result && UNSPLASH_KEY && (provider === 'unsplash' || provider === 'auto')) {
      const data = await searchUnsplash({ query: enhanced, perPage, page, orientation: mapOrientationUnsplash(orientation), color });
      if (data?.results?.length) {
        const idx = pickIndexStable(Math.min(data.results.length, 10), seed);
        const ph = data.results[idx];
        const avg = ph.color || '#777777';
        const payload = {
          source: 'unsplash',
          query,
          enhancedQuery: enhanced,
          image: {
            url: ph.urls.regular || ph.urls.full || ph.urls.raw,
            srcSet: {
              raw: ph.urls.raw,
              full: ph.urls.full,
              regular: ph.urls.regular,
              small: ph.urls.small,
              thumb: ph.urls.thumb,
              small_s3: ph.urls.small_s3,
            },
            width: ph.width,
            height: ph.height,
            alt: ph.alt_description || `${query} stock image`,
          },
          photographer: { name: ph.user?.name, url: `https://unsplash.com/@${ph.user?.username}` },
          palette: {
            base: avg,
            tint: tint(avg, 0.3),
            shade: shade(avg, 0.25),
          },
          attributions: {
            required: true,
            link: ph.links?.html,
          },
        };
        result = payload;
        source = 'unsplash';
      }
    }

    // 3) Fallback dur → image connue (ton ancien fallback)
    if (!result) {
      result = {
        source: 'fallback',
        query,
        enhancedQuery: enhanced,
        image: {
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
          srcSet: {},
          width: 1600,
          height: 900,
          alt: 'fallback office',
        },
        photographer: { name: 'Unsplash', url: 'https://unsplash.com' },
        palette: {
          base: '#6b7280',
          tint: '#a1a7af',
          shade: '#4b5563',
        },
        attributions: { required: true, link: 'https://unsplash.com' },
      };
    }

    setCache(cacheKey, result);
    return NextResponse.json(result, { status: 200, headers: cacheHeaders() });

  } catch (err: any) {
    console.error('❌ image search error', err?.message || err);
    // Pas d’échec brutal → fallback
    const payload = {
      source: 'fallback',
      query,
      enhancedQuery: enhance(query),
      image: {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
        srcSet: {},
        width: 1600,
        height: 900,
        alt: 'fallback office',
      },
      photographer: { name: 'Unsplash', url: 'https://unsplash.com' },
      palette: { base: '#6b7280', tint: '#a1a7af', shade: '#4b5563' },
      attributions: { required: true, link: 'https://unsplash.com' },
      error: 'fallback_used',
    };
    return NextResponse.json(payload, { status: 200, headers: cacheHeaders() });
  }
}

/** =========================
 *  HELPERS
 *  ========================= */
function mapOrientationPexels(o: any): 'landscape'|'portrait'|'square' {
  if (o === 'portrait' || o === 'square') return o;
  return 'landscape';
}
function mapOrientationUnsplash(o: any): 'landscape'|'portrait'|'squarish' {
  if (o === 'portrait' || o === 'squarish') return o;
  return 'landscape';
}
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };
}
function cacheHeaders() {
  return {
    ...corsHeaders(),
    // CDN/Edge cache: 1h, SWR 1j
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  };
}

/** =========================
 *  HTTP METHODS
 *  ========================= */
export async function POST(req: NextRequest) { return handle(req); }
export async function GET(req: NextRequest) { return handle(req); }
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
