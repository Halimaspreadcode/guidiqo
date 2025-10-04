import { ImageResponse } from 'next/og'
 
export const size = {
  width: 256,
  height: 256,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 160,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Raleway, sans-serif',
          borderRadius: '32px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
          border: '4px solid rgba(255, 255, 255, 0.1)',
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

