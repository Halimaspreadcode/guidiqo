import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 192,
  height: 192,
}
 
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Raleway, sans-serif',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        G
      </div>
    ),
    {
      ...size,
    }
  )
}

