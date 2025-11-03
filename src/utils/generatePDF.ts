import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Brand {
  name: string
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
}

type BrandImages = { [key: string]: string }

const escapeAttribute = (value: string | null | undefined) =>
  value ? value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : ''

// Fonction pour générer un style aléatoire basé sur le hash du nom
const getStyleVariant = (brandName: string): number => {
  let hash = 0
  for (let i = 0; i < brandName.length; i++) {
    hash = ((hash << 5) - hash) + brandName.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 3) // 3 variantes de style
}

// Nouvelle fonction pour créer un PDF moderne avec HTML/CSS - Style moodboard inspiré
export const generateModernBrandPDF = async (brand: Brand, images: BrandImages) => {
  // Obtenir une variante de style basée sur le nom de la marque
  const styleVariant = getStyleVariant(brand.name)
  
  // Créer un conteneur temporaire pour le rendu
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.width = '1920px' // 16:9 width
  container.style.height = '1080px' // 16:9 height
  document.body.appendChild(container)

  const pages = []
  
  // Page 1: Cover immersive
  const coverPage = createCoverPage(brand, styleVariant, images)
  pages.push(coverPage)
  
  // Page 2: Colors avec design épuré
  const colorsPage = createColorsPage(brand, styleVariant, images)
  pages.push(colorsPage)
  
  // Page 3: Typography style éditorial
  const typographyPage = createTypographyPage(brand, styleVariant, images)
  pages.push(typographyPage)
  
  // Page 4: Personality & audience
  const personalityPage = createPersonalityPage(brand, styleVariant, images)
  pages.push(personalityPage)
  
  // Page 5: Application avec grille moderne
  const applicationPage = createApplicationPage(brand, styleVariant, images)
  pages.push(applicationPage)
  
  // Page 6: Guidelines d'usage des couleurs (nouvelle)
  const colorGuidelinesPage = createColorGuidelinesPage(brand, styleVariant, images)
  pages.push(colorGuidelinesPage)

  // Créer le PDF
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080]
  })

  // Convertir chaque page en image et l'ajouter au PDF
  for (let i = 0; i < pages.length; i++) {
    container.innerHTML = pages[i]
    
    // Attendre que les images se chargent
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080)
  }

  // Nettoyer
  document.body.removeChild(container)
  
  // Télécharger
  pdf.save(`${brand.name.replace(/\s+/g, '_')}_Brand_Guide.pdf`)
}

// Page de couverture - Moodboard hero
const createCoverPage = (brand: Brand, styleVariant: number, images: BrandImages) => {
  const heroImage =
    images.hero ||
    images.application ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2000&q=80'
  const primaryColor = brand.primaryColor || '#0f172a'
  const secondaryColor = brand.secondaryColor || '#1e293b'
  const accentColor = brand.accentColor || '#fbbf24'
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const palette = [brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(
    (color): color is string => Boolean(color)
  )
  const paletteMarkup = (palette.length ? palette : [accentColor])
    .map(
      (color) => `
        <span style="
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: ${color};
          border: 1px solid rgba(255,255,255,0.25);
          display: inline-flex;
        "></span>
      `
    )
    .join('')
  const description =
    brand.description ||
    'Brand guidelines conçus pour exprimer une identité forte et mémorable.'

  const decorativeBlock = (() => {
    switch (styleVariant) {
      case 0:
        return `
          <div style="
            position: absolute;
            top: 140px;
            right: 160px;
            width: 280px;
            height: 280px;
            border-radius: 48px;
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(12px);
          "></div>
        `
      case 1:
        return `
          <div style="
            position: absolute;
            bottom: 120px;
            right: 220px;
            width: 420px;
            height: 220px;
            border-radius: 32px;
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(10px);
          "></div>
        `
      default:
        return `
          <div style="
            position: absolute;
            top: 200px;
            left: 120px;
            width: 140px;
            height: 140px;
            border-radius: 32px;
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(10px);
          "></div>
        `
    }
  })()

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: ${primaryColor};
      font-family: '${primaryFont}', -apple-system, sans-serif;
      color: white;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
      "></div>
      <div style="
        position: absolute;
        inset: 0;
        opacity: 0.25;
        background-image: url('${heroImage}');
        background-position: center;
        background-size: cover;
      "></div>
      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 45%, rgba(15,23,42,0.25) 100%);
      "></div>
      ${decorativeBlock}
      <div style="
        position: absolute;
        top: 120px;
        left: 140px;
        right: 140px;
        display: flex;
        flex-direction: column;
        gap: 40px;
        z-index: 2;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 16px;
          letter-spacing: 14px;
          text-transform: uppercase;
          opacity: 0.75;
        ">
          Guidiqo Brand Lab
          <span style="
            width: 48px;
            height: 2px;
            background: ${accentColor};
            display: inline-flex;
          "></span>
        </div>
        <h1 style="
          margin: 0;
          font-size: 164px;
          line-height: 0.9;
          letter-spacing: -8px;
          font-weight: 600;
          max-width: 1200px;
        ">${brand.name}</h1>
        <p style="
          margin: 0;
          max-width: 640px;
          font-size: 22px;
          line-height: 1.6;
          opacity: 0.85;
          font-weight: 300;
        ">${description}</p>
      </div>
      <div style="
        position: absolute;
        bottom: 140px;
        left: 140px;
        display: flex;
        gap: 40px;
        align-items: center;
        z-index: 2;
      ">
        <div>
          <p style="
            margin: 0;
            font-size: 12px;
            letter-spacing: 8px;
            text-transform: uppercase;
            opacity: 0.6;
          ">Palette</p>
          <div style="
            margin-top: 16px;
            display: flex;
            gap: 14px;
            align-items: center;
          ">
            ${paletteMarkup}
          </div>
        </div>
        <div style="
          width: 1px;
          height: 68px;
          background: rgba(255,255,255,0.25);
        "></div>
        <div>
          <p style="
            margin: 0;
            font-size: 12px;
            letter-spacing: 8px;
            text-transform: uppercase;
            opacity: 0.6;
          ">Personnalité</p>
          <p style="
            margin: 16px 0 0;
            font-size: 20px;
            opacity: 0.85;
            font-weight: 400;
          ">${brand.brandPersonality || 'Visionnaire & Confiante'}</p>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: 140px;
        right: 140px;
        text-align: right;
        z-index: 2;
      ">
        <p style="
          margin: 0;
          font-size: 14px;
          letter-spacing: 10px;
          text-transform: uppercase;
          opacity: 0.5;
        ">Brand Guidelines 2024</p>
      </div>
    </div>
  `
}

// Fonction pour convertir HEX en RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

// Fonction pour convertir RGB en HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Fonction globale pour obtenir les informations de couleur complètes
const getColorInfo = (hex: string) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return { rgb: 'N/A', hsl: 'N/A' }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return {
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }
}

// Page des couleurs - Panels dynamiques
const createColorsPage = (brand: Brand, _styleVariant: number, images: BrandImages) => {
  const primaryColor = brand.primaryColor || '#111827'
  const secondaryColor = brand.secondaryColor || '#1f2937'
  const accentColor = brand.accentColor || '#fbbf24'
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const heroImage = images.hero || images.application || ''
  const accentTexture = images.accent || images.personality || ''
  const applicationImage = images.application || images.hero || ''
  const previewImages = [heroImage, applicationImage, accentTexture]
  const colors = [
    {
      label: 'Primary',
      value: brand.primaryColor || primaryColor,
      desc: 'Couleur emblématique utilisée pour le logo, les arrière-plans et les éléments clés.'
    },
    {
      label: 'Secondary',
      value: brand.secondaryColor || secondaryColor,
      desc: 'Couleur de soutien pour créer des contrastes doux et des zones respirables.'
    },
    {
      label: 'Accent',
      value: brand.accentColor || accentColor,
      desc: 'Couleur vibrante pour les CTA, pictogrammes et highlights stratégiques.'
    }
  ]

  const heroPanel = `
    <div style="
      grid-column: span 3;
      height: 320px;
      border-radius: 44px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(15,23,42,0.15);
    ">
      <img
        src="${escapeAttribute(heroImage)}"
        alt="${escapeAttribute(`${brand.name} moodboard`)}"
        style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"
      />
      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.35) 70%, rgba(15,23,42,0.2) 100%);
      "></div>
      <div style="
        position: absolute;
        bottom: 36px;
        left: 36px;
        color: white;
      ">
        <p style="
          margin: 0;
          font-size: 12px;
          letter-spacing: 6px;
          text-transform: uppercase;
          opacity: 0.7;
        ">Palette & Atmosphère</p>
        <h3 style="
          margin: 12px 0 0;
          font-size: 34px;
          font-weight: 500;
          letter-spacing: -0.5px;
        ">${brand.name}</h3>
      </div>
    </div>
  `

  const accentPanel = `
    <div style="
      grid-column: span 3;
      display: flex;
      align-items: center;
      gap: 28px;
      padding: 28px;
      background: rgba(15,23,42,0.05);
      border-radius: 36px;
      border: 1px dashed rgba(148,163,184,0.35);
    ">
      <div style="
        width: 150px;
        height: 150px;
        border-radius: 28px;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
      ">
        <img
          src="${escapeAttribute(accentTexture)}"
          alt="${escapeAttribute(`${brand.name} texture`)}"
          style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"
        />
      </div>
      <div>
        <p style="
          margin: 0 0 10px 0;
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #475569;
        ">Textures & Assets</p>
        <p style="
          margin: 0;
          font-size: 18px;
          color: #0f172a;
          line-height: 1.6;
          max-width: 640px;
        ">
          Des visuels complémentaires pour enrichir les supports marketing, social media ou présentations internes, tout en respectant le nuancier.
        </p>
      </div>
    </div>
  `

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #f9fafb;
      font-family: '${primaryFont}', -apple-system, sans-serif;
      padding: 110px 130px;
      color: #0f172a;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top right, rgba(15,23,42,0.08), transparent 55%);
      "></div>
      <div style="
        position: relative;
        display: grid;
        grid-template-columns: 520px 1fr;
        gap: 80px;
        height: 100%;
      ">
        <div>
          <div style="
            width: 64px;
            height: 4px;
            background: ${accentColor};
            border-radius: 999px;
            margin-bottom: 34px;
          "></div>
          <h2 style="
            font-size: 82px;
            line-height: 1;
            letter-spacing: -2px;
            margin: 0 0 38px 0;
            font-weight: 600;
          ">
            Palette Chromatique
          </h2>
          <p style="
            font-size: 20px;
            line-height: 1.8;
            color: #475569;
            margin: 0 0 40px 0;
            font-weight: 300;
          ">
            Une palette harmonieuse qui équilibre impact visuel et clarté. Utilisez ces combinaisons pour maintenir une identité cohérente sur tous les supports.
          </p>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          ">
            ${colors
              .map((color) => {
                const info = getColorInfo(color.value)
                return `
                  <div style="
                    background: white;
                    border-radius: 32px;
                    padding: 28px;
                    box-shadow: 0 18px 48px rgba(15,23,42,0.08);
                    border: 1px solid rgba(148,163,184,0.15);
                  ">
                    <p style="
                      margin: 0 0 14px 0;
                      font-size: 13px;
                      letter-spacing: 6px;
                      text-transform: uppercase;
                      color: #94a3b8;
                    ">${color.label}</p>
                    <p style="
                      margin: 0 0 12px 0;
                      font-size: 20px;
                      font-family: 'Courier New', monospace;
                      font-weight: 500;
                    ">${color.value}</p>
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      color: #64748b;
                      line-height: 1.6;
                    ">${info.rgb}</p>
                  </div>
                `
              })
              .join('')}
          </div>
        </div>
        <div style="
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
          align-content: start;
        ">
          ${heroPanel}
          ${colors
            .map((color, index) => {
              const info = getColorInfo(color.value)
              const preview = previewImages[index]
                ? `
                  <div style="
                    position: relative;
                    border-radius: 26px;
                    overflow: hidden;
                    height: 140px;
                    margin-bottom: 24px;
                  ">
                    <img
                      src="${escapeAttribute(previewImages[index])}"
                      alt="${escapeAttribute(`${brand.name} ${color.label}`)}"
                      style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"
                    />
                    <div style="
                      position:absolute;
                      inset:0;
                      background: linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.45) 100%);
                    "></div>
                  </div>
                `
                : ''
              return `
                <div style="
                  background: white;
                  border-radius: 42px;
                  padding: 32px;
                  box-shadow: 0 20px 56px rgba(15,23,42,0.1);
                  border: 1px solid rgba(148,163,184,0.12);
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                ">
                  ${preview}
                  <div style="
                    width: 100%;
                    border-radius: 24px;
                    background: ${color.value};
                    border: 1px solid rgba(15,23,42,0.08);
                    height: 22px;
                  "></div>
                  <div>
                    <p style="
                      margin: 0 0 12px 0;
                      font-size: 14px;
                      letter-spacing: 6px;
                      text-transform: uppercase;
                      color: #94a3b8;
                    ">${color.label}</p>
                    <p style="
                      margin: 0 0 16px 0;
                      font-size: 28px;
                      font-weight: 500;
                      letter-spacing: -0.5px;
                    ">${color.value}</p>
                    <p style="
                      margin: 0 0 6px 0;
                      font-size: 14px;
                      color: #475569;
                      line-height: 1.6;
                      font-weight: 300;
                    ">${color.desc}</p>
                    <div style="
                      margin-top: 22px;
                      display: grid;
                      gap: 10px;
                      font-family: 'Courier New', monospace;
                      font-size: 13px;
                      color: #475569;
                    ">
                      <span>RGB: ${info.rgb}</span>
                      <span>HSL: ${info.hsl}</span>
                    </div>
                  </div>
                </div>
              `
            })
            .join('')}
          ${accentPanel}
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: 80px;
        right: 130px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 14px;
        color: #94a3b8;
        letter-spacing: 6px;
        text-transform: uppercase;
      ">
        <span style="display:inline-flex;width:40px;height:1px;background:#cbd5f5;"></span>
        02
      </div>
    </div>
  `
}

// Page typographie - Immersion éditoriale enrichie
const createTypographyPage = (brand: Brand, styleVariant: number, images: BrandImages) => {
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const secondaryFont = brand.secondaryFont || primaryFont
  const accentColor = brand.accentColor || '#fbbf24'
  const typographyImage = images.typography || images.hero || ''
  const secondaryImage = images.application || images.personality || ''
  const accentImage = images.accent || images.typography || ''

  const primaryBlock = `
    <div style="
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(148,163,184,0.3);
      border-radius: 40px;
      padding: 48px;
      backdrop-filter: blur(6px);
    ">
      <img
        src="${escapeAttribute(typographyImage)}"
        alt="${escapeAttribute(`${brand.name} typo mood`)}"
        style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.22; filter: blur(6px);"
      />
      <div style="
        position:absolute;
        inset:0;
        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(15,23,42,0.45));
      "></div>
      <div style="position:relative; z-index:1; display:flex; flex-direction:column; gap:32px;">
        <div style="
          font-size: 148px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -6px;
          font-family: '${primaryFont}', -apple-system, sans-serif;
        ">Aa</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <p style="
            margin: 0;
            font-size: 14px;
            letter-spacing: 6px;
            text-transform: uppercase;
            color: rgba(226,232,240,0.7);
          ">Primary Typeface</p>
          <p style="
            margin: 0;
            font-size: 32px;
            font-weight: 500;
            letter-spacing: -0.5px;
            color: white;
          ">${primaryFont}</p>
          <p style="
            margin: 0;
            font-size: 16px;
            line-height: 1.7;
            color: rgba(226,232,240,0.7);
            font-weight: 300;
          ">
            Utilisée pour les titres, les statements et les messages clés. Elle incarne l'énergie principale de la marque.
          </p>
        </div>
        <div style="
          border-radius: 28px;
          padding: 28px;
          background: rgba(15,23,42,0.55);
          border: 1px solid rgba(148,163,184,0.2);
          display: grid;
          gap: 14px;
          font-size: 20px;
          letter-spacing: 3px;
        ">
          <span style="opacity:0.9;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
          <span style="opacity:0.9;">abcdefghijklmnopqrstuvwxyz</span>
          <span style="opacity:0.65;letter-spacing:1.5px;">0123456789 ?!@#%&amp;*</span>
        </div>
      </div>
    </div>
  `

  const secondaryBlock = `
    <div style="
      position: relative;
      overflow: hidden;
      background: white;
      border-radius: 40px;
      padding: 48px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      box-shadow: 0 30px 80px rgba(15,23,42,0.18);
      border: 1px solid rgba(148,163,184,0.15);
      color: #0f172a;
    ">
      <img
        src="${escapeAttribute(secondaryImage)}"
        alt="${escapeAttribute(`${brand.name} editorial`)}"
        style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.22;"
      />
      <div style="
        position:absolute;
        inset:0;
        background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 60%, rgba(15,23,42,0.15) 100%);
      "></div>
      <div style="position:relative; z-index:1;">
        <div style="
          font-size: 120px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -5px;
          font-family: '${secondaryFont}', -apple-system, sans-serif;
        ">Aa</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <p style="
            margin: 0;
            font-size: 13px;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #94a3b8;
          ">Secondary Typeface</p>
          <p style="
            margin: 0;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: -0.4px;
          ">${secondaryFont}</p>
          <p style="
            margin: 0;
            font-size: 16px;
            line-height: 1.8;
            color: #475569;
            font-weight: 300;
          ">
            Le compagnon idéal pour le corps de texte, les paragraphes explicatifs et toutes les interfaces où la lisibilité prime.
          </p>
        </div>
        <div style="
          border-radius: 24px;
          padding: 28px;
          background: #f8fafc;
          border: 1px solid rgba(148,163,184,0.18);
          display: grid;
          gap: 14px;
          font-size: 17px;
          line-height: 1.8;
          margin-top: 32px;
        ">
          <p style="margin:0;color:#0f172a;font-weight:500;">The quick brown fox jumps over the lazy dog.</p>
          <p style="margin:0;color:#475569;">
            Voici un exemple de texte en français pour démontrer la qualité du rendu typographique avec les accents : À, É, Ê, Ç, Ô.
          </p>
        </div>
      </div>
    </div>
  `

  const accentBadgeSection = accentImage
    ? `
      <div style="
        position: absolute;
        top: 120px;
        right: 150px;
        width: 140px;
        height: 140px;
        border-radius: 999px;
        overflow: hidden;
        border: 4px solid rgba(226,232,240,0.2);
        box-shadow: 0 20px 40px rgba(15,23,42,0.25);
      ">
        <img
          src="${escapeAttribute(accentImage)}"
          alt="${escapeAttribute(`${brand.name} accent`)}"
          style="width:100%; height:100%; object-fit:cover;"
        />
      </div>
    `
    : ''

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: linear-gradient(140deg, #020617 0%, #0f172a 40%, #1e293b 100%);
      font-family: '${primaryFont}', -apple-system, sans-serif;
      padding: 110px 130px;
      color: white;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35), transparent 55%);
      "></div>
      <img
        src="${escapeAttribute(typographyImage)}"
        alt="${escapeAttribute(`${brand.name} typography texture`)}"
        style="position:absolute; inset:-200px; width:120%; height:120%; opacity:0.12; object-fit:cover; filter: blur(12px);"
      />
      <div style="
        position: absolute;
        inset: -200px -200px auto auto;
        width: 520px;
        height: 520px;
        border-radius: 50%;
        background: rgba(248,250,252,0.04);
        filter: blur(0px);
      "></div>
      <div style="
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 60px;
        z-index: 1;
        height: 100%;
      ">
        <div style="display:flex;flex-direction:column;gap:40px;justify-content:space-between;">
          <div>
            <div style="
              width: 64px;
              height: 4px;
              background: ${accentColor};
              border-radius: 999px;
              margin-bottom: 34px;
            "></div>
            <h2 style="
              margin: 0;
              font-size: 78px;
              line-height: 1;
              letter-spacing: -2px;
              font-weight: 600;
            ">Système Typographique</h2>
            <p style="
              margin: 36px 0 0;
              font-size: 20px;
              opacity: 0.7;
              line-height: 1.8;
              max-width: 540px;
            ">
              Un duo typographique équilibré pour exprimer la voix de la marque avec force et clarté sur tous les points de contact.
            </p>
          </div>
          ${primaryBlock}
        </div>
        <div style="display:flex;flex-direction:column;gap:32px;justify-content:flex-end;">
          ${secondaryBlock}
          <div style="
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            font-size: 14px;
            opacity: 0.65;
            text-transform: uppercase;
            letter-spacing: 3px;
          ">
            <span>Tracking: ${styleVariant === 0 ? '-2%' : styleVariant === 1 ? '0%' : '+2%'}</span>
            <span>Leading: 140%</span>
            <span>Scale: ${styleVariant === 2 ? 'Modulo' : 'Major Third'}</span>
          </div>
        </div>
        ${accentBadgeSection}
      </div>
      <div style="
        position: absolute;
        bottom: 80px;
        right: 130px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 14px;
        letter-spacing: 6px;
        text-transform: uppercase;
        opacity: 0.55;
      ">
        <span style="display:inline-flex;width:40px;height:1px;background:rgba(226,232,240,0.4);"></span>
        03
      </div>
    </div>
  `
}

// Page personnalité & audience - Collage immersif
const createPersonalityPage = (brand: Brand, styleVariant: number, images: BrandImages) => {
  const heroImage =
    images.personality ||
    images.hero ||
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80'
  const supportImage =
    images.application ||
    images.accent ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80'
  const accentColor = brand.accentColor || '#fbbf24'
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const personality = brand.brandPersonality || 'Identité Affirmée'
  const audience = brand.targetAudience || 'Communauté créative et engagée'
  const description =
    brand.description ||
    "Une marque qui place l'humain au cœur de ses interactions et cherche à créer des expériences mémorables."

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #ffffff;
      font-family: '${primaryFont}', -apple-system, sans-serif;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(15,23,42,0.04) 0%, transparent 50%, rgba(15,23,42,0.05) 100%);
      "></div>
      <div style="
        position: relative;
        display: grid;
        grid-template-columns: 620px 1fr;
        gap: 80px;
        padding: 120px 140px;
        height: 100%;
      ">
        <div style="
          position: relative;
          border-radius: 48px;
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(15,23,42,0.18);
        ">
          <div style="
            position: absolute;
            inset: 0;
            background-image: url('${heroImage}');
            background-size: cover;
            background-position: center;
          "></div>
          <div style="
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.7) 80%);
          "></div>
          <div style="
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            color: white;
            display: flex;
            flex-direction: column;
            gap: 16px;
          ">
            <p style="
              margin: 0;
              font-size: 13px;
              letter-spacing: 6px;
              text-transform: uppercase;
              opacity: 0.7;
            ">Mood principal</p>
            <h3 style="
              margin: 0;
              font-size: 42px;
              line-height: 1.1;
              letter-spacing: -1.2px;
              font-weight: 500;
            ">${personality}</h3>
          </div>
        </div>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 50px;
          justify-content: space-between;
        ">
          <div>
            <div style="
              width: 64px;
              height: 4px;
              background: ${accentColor};
              border-radius: 999px;
              margin-bottom: 34px;
            "></div>
            <h2 style="
              margin: 0;
              font-size: 78px;
              line-height: 1.05;
              letter-spacing: -2px;
              font-weight: 600;
              color: #0f172a;
            ">Identité & Audience</h2>
            <p style="
              margin: 36px 0 0;
              font-size: 20px;
              line-height: 1.8;
              color: #475569;
              max-width: 640px;
            ">
              ${description}
            </p>
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 26px;
          ">
            <div style="
              background: white;
              border-radius: 36px;
              padding: 34px;
              border: 1px solid rgba(148,163,184,0.16);
              box-shadow: 0 24px 60px rgba(15,23,42,0.12);
              display:flex;
              flex-direction:column;
              gap:18px;
            ">
              <p style="
                margin: 0;
                font-size: 13px;
                letter-spacing: 6px;
                text-transform: uppercase;
                color: #94a3b8;
              ">Personnalité</p>
              <p style="
                margin: 0;
                font-size: 32px;
                line-height: 1.2;
                color: #0f172a;
                font-weight: 500;
              ">${personality}</p>
              <p style="
                margin: 0;
                font-size: 15px;
                line-height: 1.7;
                color: #64748b;
              ">
                Tonalité dominante pour les messages clés et la narration de la marque.
              </p>
            </div>
            <div style="
              background: #0f172a;
              border-radius: 36px;
              padding: 34px;
              color: white;
              position: relative;
              overflow: hidden;
            ">
              <div style="
                position: absolute;
                inset: 0;
                background-image: url('${supportImage}');
                background-size: cover;
                background-position: center;
                opacity: 0.35;
              "></div>
              <div style="
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6));
              "></div>
              <div style="
                position: relative;
                display:flex;
                flex-direction:column;
                gap:18px;
              ">
                <p style="
                  margin: 0;
                  font-size: 13px;
                  letter-spacing: 6px;
                  text-transform: uppercase;
                  opacity: 0.7;
                ">Audience Cible</p>
                <p style="
                  margin: 0;
                  font-size: 30px;
                  line-height: 1.4;
                  font-weight: 500;
                ">${audience}</p>
                <p style="
                  margin: 0;
                  font-size: 15px;
                  line-height: 1.7;
                  opacity: 0.7;
                ">
                  Les personnes qui se reconnaissent dans nos valeurs et recherchent des expériences authentiques.
                </p>
              </div>
            </div>
            <div style="
              grid-column: span 2;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
              font-size: 13px;
              color: #64748b;
              letter-spacing: 4px;
              text-transform: uppercase;
            ">
              <span>Valeur: Innovation</span>
              <span>Emotion: ${styleVariant === 0 ? 'Confiance' : styleVariant === 1 ? 'Audace' : 'Sérénité'}</span>
              <span>Expérience: Premium</span>
            </div>
          </div>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: 80px;
        right: 140px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 14px;
        letter-spacing: 6px;
        text-transform: uppercase;
        color: #94a3b8;
      ">
        <span style="display:inline-flex;width:40px;height:1px;background:#cbd5f5;"></span>
        04
      </div>
    </div>
  `
}

// Page de guidelines d'usage des couleurs
const createColorGuidelinesPage = (brand: Brand, _styleVariant: number, images: BrandImages) => {
  const colorUsage = [
    {
      title: 'Couleur Primaire',
      color: brand.primaryColor,
      rules: [
        'Utilisez pour les logos et éléments d\'identité',
        'Privilégiez pour les titres et en-têtes importants',
        'Peut couvrir jusqu\'à 40% d\'une composition',
        'Évitez sur fonds de couleur similaire'
      ]
    },
    {
      title: 'Couleur Secondaire',
      color: brand.secondaryColor,
      rules: [
        'Utilisez pour créer de la profondeur visuelle',
        'Parfait pour les sous-sections et séparateurs',
        'Peut couvrir jusqu\'à 30% d\'une composition',
        'Excellent pour les fonds subtils'
      ]
    },
    {
      title: 'Couleur Accent',
      color: brand.accentColor,
      rules: [
        'Utilisez avec parcimonie pour attirer l\'attention',
        'Idéale pour les CTA et éléments interactifs',
        'Limitez à 10% maximum d\'une composition',
        'Utilisez pour les highlights et callouts'
      ]
    }
  ].filter(c => c.color)

  const accentColor = brand.accentColor || '#fbbf24'
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const guidelinesImage = images.application || images.hero || ''
  const textureImage = images.accent || images.personality || ''

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #f8fafc;
      font-family: '${primaryFont}', -apple-system, sans-serif;
      padding: 110px 130px;
      color: #0f172a;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top right, rgba(15,23,42,0.05), transparent 55%);
      "></div>
      <img
        src="${escapeAttribute(guidelinesImage)}"
        alt="${escapeAttribute(`${brand.name} guidelines`)}"
        style="position:absolute; inset:-180px; width:120%; height:120%; opacity:0.08; object-fit:cover; filter:blur(14px);"
      />
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
      ">
        <div style="
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 60px;
          margin-bottom: 64px;
        ">
          <div>
            <div style="
              width: 64px;
              height: 4px;
              background: ${accentColor};
              border-radius: 999px;
              margin-bottom: 34px;
            "></div>
            <h2 style="
              font-size: 78px;
              line-height: 1;
              letter-spacing: -2px;
              margin: 0;
              font-weight: 600;
            ">Guidelines d'Usage</h2>
            <p style="
              font-size: 20px;
              line-height: 1.8;
              color: #475569;
              max-width: 640px;
              margin: 36px 0 0;
            ">
              Des principes simples pour garantir une cohérence forte sur tous les supports visuels, en respectant l'équilibre chromatique de la marque.
            </p>
          </div>
          <div style="
            background: white;
            border-radius: 32px;
            padding: 32px;
            box-shadow: 0 24px 58px rgba(15,23,42,0.12);
            border: 1px solid rgba(148,163,184,0.18);
            display: grid;
            gap: 18px;
            min-width: 300px;
          ">
            <p style="
              margin:0;
              font-size:13px;
              letter-spacing:6px;
              text-transform:uppercase;
              color:#94a3b8;
            ">Ratios recommandés</p>
            <div style="
              display:flex;
              align-items:center;
              gap:18px;
            ">
              <span style="
                width:58px;
                height:58px;
                border-radius:20px;
                background:${brand.primaryColor || '#0f172a'};
              "></span>
              <span style="font-size:48px;font-weight:600;">60%</span>
              <p style="margin:0;font-size:14px;color:#64748b;">Fondations</p>
            </div>
            <div style="
              display:flex;
              align-items:center;
              gap:18px;
            ">
              <span style="
                width:58px;
                height:58px;
                border-radius:20px;
                background:${brand.secondaryColor || '#1e293b'};
              "></span>
              <span style="font-size:48px;font-weight:600;">30%</span>
              <p style="margin:0;font-size:14px;color:#64748b;">Support</p>
            </div>
            <div style="
              display:flex;
              align-items:center;
              gap:18px;
            ">
              <span style="
                width:58px;
                height:58px;
                border-radius:20px;
                background:${brand.accentColor || '#fbbf24'};
              "></span>
              <span style="font-size:48px;font-weight:600;">10%</span>
              <p style="margin:0;font-size:14px;color:#64748b;">Highlights</p>
            </div>
          </div>
        </div>
        <div style="
          display: grid;
          grid-template-columns: repeat(${colorUsage.length || 1}, 1fr);
          gap: 36px;
          flex: 1;
        ">
          ${
            colorUsage.length
              ? colorUsage
                  .map((item) => `
                    <div style="
                      background: white;
                      border-radius: 36px;
                      padding: 34px;
                      box-shadow: 0 24px 60px rgba(15,23,42,0.12);
                      border: 1px solid rgba(148,163,184,0.16);
                      display: flex;
                      flex-direction: column;
                      gap: 28px;
                    ">
                      <div style="
                        width: 100%;
                        height: 180px;
                        border-radius: 28px;
                        background: ${item.color};
                        border: 1px solid rgba(15,23,42,0.05);
                      "></div>
                      <div>
                        <p style="
                          margin: 0 0 12px 0;
                          font-size: 13px;
                          letter-spacing: 6px;
                          text-transform: uppercase;
                          color: #94a3b8;
                        ">${item.title}</p>
                        <p style="
                          margin: 0 0 16px 0;
                          font-size: 26px;
                          font-weight: 500;
                          letter-spacing: -0.5px;
                        ">${item.color}</p>
                      </div>
                      <div style="display: grid; gap: 18px;">
                        ${item.rules
                          .map(rule => `
                            <div style="
                              display: flex;
                              gap: 16px;
                              align-items: flex-start;
                            ">
                              <span style="
                                width: 12px;
                                height: 12px;
                                border-radius: 4px;
                                background: ${item.color};
                                flex-shrink: 0;
                                margin-top: 6px;
                              "></span>
                              <p style="
                                margin: 0;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #475569;
                              ">${rule}</p>
                            </div>
                          `)
                          .join('')}
                      </div>
                    </div>
                  `)
                  .join('')
              : `
                <div style="
                  background: white;
                  border-radius: 36px;
                  padding: 34px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:#94a3b8;
                  font-size:18px;
                  border: 1px dashed rgba(148,163,184,0.4);
                ">
                  Ajoutez vos couleurs pour générer des règles d'usage automatiques.
                </div>
              `
          }
        </div>
        <div style="
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px;
          border-radius: 36px;
          background: rgba(148,163,184,0.12);
          border: 1px solid rgba(148,163,184,0.2);
        ">
          <div style="
            width: 160px;
            height: 120px;
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
          ">
            <img
              src="${escapeAttribute(textureImage)}"
              alt="${escapeAttribute(`${brand.name} application sample`)}"
              style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"
            />
          </div>
          <div>
            <p style="
              margin: 0 0 8px 0;
              font-size: 13px;
              letter-spacing: 5px;
              text-transform: uppercase;
              color: #64748b;
            ">Mises en pratique</p>
            <p style="
              margin: 0;
              font-size: 17px;
              line-height: 1.7;
              color: #475569;
              max-width: 720px;
            ">
              Combinez les couleurs selon les ratios recommandés pour les interfaces, présentations ou supports physiques. Intégrez ${brand.name} dans un univers visuel cohérent en jouant sur les contrastes et la hiérarchie.
            </p>
          </div>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: 80px;
        right: 130px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 14px;
        letter-spacing: 6px;
        text-transform: uppercase;
        color: #94a3b8;
      ">
        <span style="display:inline-flex;width:40px;height:1px;background:#cbd5f5;"></span>
        06
      </div>
    </div>
  `
}

// Page d'application - Collage dynamique
const createApplicationPage = (brand: Brand, _styleVariant: number, images: BrandImages) => {
  const primaryColor = brand.primaryColor || '#111827'
  const secondaryColor = brand.secondaryColor || '#1f2937'
  const accentColor = brand.accentColor || '#fbbf24'
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const heroImage =
    images.application ||
    images.hero ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2000&q=80'
  const insetImage =
    images.accent ||
    images.typography ||
    'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=2000&q=80'
  const personalityImage =
    images.personality ||
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80'

  const guidelines = [
    'Prioriser la couleur primaire pour les expressions fortes du logo et des CTA.',
    'Utiliser la grille pour aligner textes et visuels et conserver un rythme clair.',
    'Conserver des marges généreuses afin de laisser respirer la composition.',
    'Mélanger photographies et aplats de couleur pour enrichir la narration.',
    'Limiter les effets pour préserver une esthétique premium et contemporaine.',
    'Respecter les contrastes pour assurer une lisibilité parfaite sur tous supports.'
  ]

  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #0f172a;
      font-family: '${primaryFont}', -apple-system, sans-serif;
      padding: 110px 120px;
      color: white;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(59,130,246,0.35), transparent 55%);
      "></div>
      <div style="
        position: relative;
        display: grid;
        grid-template-columns: 520px 1fr;
        gap: 60px;
        height: 100%;
      ">
        <div style="
          display: flex;
          flex-direction: column;
          gap: 36px;
        ">
          <div>
            <div style="
              width: 64px;
              height: 4px;
              background: ${accentColor};
              border-radius: 999px;
              margin-bottom: 34px;
            "></div>
            <h2 style="
              margin: 0;
              font-size: 74px;
              line-height: 1;
              letter-spacing: -2px;
              font-weight: 600;
            ">Applications Visuelles</h2>
            <p style="
              margin: 32px 0 0;
              font-size: 19px;
              line-height: 1.8;
              opacity: 0.72;
            ">
              Des mises en situation illustrant la manière dont le système visuel prend vie à travers différents supports digitaux et imprimés.
            </p>
          </div>
          <div style="
            background: rgba(15,23,42,0.55);
            border-radius: 36px;
            border: 1px solid rgba(148,163,184,0.28);
            padding: 32px;
            display: grid;
            gap: 22px;
          ">
            ${guidelines
              .map(
                (text, index) => `
                  <div style="
                    display: flex;
                    gap: 18px;
                    align-items: flex-start;
                  ">
                    <span style="
                      width: 36px;
                      height: 36px;
                      border-radius: 12px;
                      background: ${index % 2 === 0 ? accentColor : 'rgba(226,232,240,0.15)'};
                      color: ${index % 2 === 0 ? '#0f172a' : 'white'};
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 600;
                      font-size: 16px;
                    ">${(index + 1).toString().padStart(2, '0')}</span>
                    <p style="
                      margin: 0;
                      font-size: 16px;
                      line-height: 1.7;
                      opacity: 0.85;
                      font-weight: 300;
                    ">${text}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
        <div style="
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 18px;
        ">
          <div style="
            grid-column: span 7;
            grid-row: span 4;
            border-radius: 44px;
            overflow: hidden;
            position: relative;
            background: ${primaryColor};
          ">
            <div style="
              position: absolute;
              inset: 0;
              background-image: url('${heroImage}');
              background-size: cover;
              background-position: center;
            "></div>
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.75) 100%);
            "></div>
            <div style="
              position: absolute;
              bottom: 36px;
              left: 36px;
              right: 36px;
              display:flex;
              flex-direction:column;
              gap:12px;
            ">
              <p style="
                margin:0;
                font-size:13px;
                letter-spacing:6px;
                text-transform:uppercase;
                opacity:0.7;
              ">Hero digital</p>
              <h3 style="
                margin:0;
                font-size:36px;
                letter-spacing:-1px;
                font-weight:500;
              ">Landing immersive</h3>
            </div>
          </div>
          <div style="
            grid-column: span 5;
            grid-row: span 3;
            border-radius: 44px;
            background: ${accentColor};
            color: #0f172a;
            padding: 36px;
            display:flex;
            flex-direction:column;
            gap:18px;
            box-shadow: 0 30px 70px rgba(15,23,42,0.25);
          ">
            <p style="
              margin:0;
              font-size:13px;
              letter-spacing:6px;
              text-transform:uppercase;
            ">Campaign CTA</p>
            <h3 style="
              margin:0;
              font-size:32px;
              letter-spacing:-1px;
              font-weight:600;
            ">Invitez, convertissez, fidélisez</h3>
            <p style="
              margin:0;
              font-size:16px;
              line-height:1.6;
              opacity:0.75;
            ">
              Utilisez la couleur accent pour booster l’engagement des messages promotionnels.
            </p>
          </div>
          <div style="
            grid-column: span 5;
            grid-row: span 3;
            border-radius: 44px;
            overflow:hidden;
            position:relative;
          ">
            <div style="
              position:absolute;
              inset:0;
              background-image:url('${insetImage}');
              background-size:cover;
              background-position:center;
            "></div>
            <div style="
              position:absolute;
              inset:0;
              background:linear-gradient(160deg, rgba(15,23,42,0.85), transparent 70%);
            "></div>
            <div style="
              position:absolute;
              bottom:30px;
              left:30px;
              right:30px;
            ">
              <p style="
                margin:0;
                font-size:13px;
                letter-spacing:6px;
                text-transform:uppercase;
                opacity:0.7;
              ">Social stories</p>
              <p style="
                margin:10px 0 0;
                font-size:24px;
                font-weight:500;
                letter-spacing:-0.5px;
              ">Format 9:16</p>
            </div>
          </div>
          <div style="
            grid-column: span 7;
            grid-row: span 2;
            border-radius: 32px;
            background: rgba(15,23,42,0.55);
            border: 1px solid rgba(148,163,184,0.25);
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding: 30px 36px;
          ">
            <div>
              <p style="
                margin:0;
                font-size:13px;
                letter-spacing:6px;
                text-transform:uppercase;
                opacity:0.6;
              ">Palette active</p>
              <p style="
                margin:14px 0 0;
                font-size:20px;
                letter-spacing:3px;
              ">${[brand.primaryColor, brand.secondaryColor, brand.accentColor]
                .filter(Boolean)
                .join(' • ')}</p>
            </div>
            <div style="
              display:flex;
              gap:18px;
            ">
              ${[brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(Boolean).map(
                (color) => `
                  <span style="
                    width:46px;
                    height:46px;
                    border-radius:16px;
                    background:${color};
                    border:1px solid rgba(255,255,255,0.25);
                    display:inline-flex;
                  "></span>
                `
              ).join('')}
            </div>
          </div>
          <div style="
            grid-column: span 5;
            grid-row: span 2;
            border-radius: 32px;
            background: rgba(226,232,240,0.12);
            padding: 28px 32px;
            display:flex;
            flex-direction:column;
            gap:14px;
          ">
            <p style="
              margin:0;
              font-size:13px;
              letter-spacing:6px;
              text-transform:uppercase;
              opacity:0.6;
            ">Valeurs</p>
            <p style="
              margin:0;
              font-size:24px;
              font-weight:500;
              letter-spacing:-0.5px;
            ">Clarté · Audace · Empathie</p>
          </div>
          <div style="
            grid-column: span 12;
            grid-row: span 2;
            border-radius: 36px;
            overflow: hidden;
            position: relative;
            background: ${secondaryColor};
          ">
            <div style="
              position:absolute;
              inset:0;
              background-image:url('${personalityImage}');
              background-size:cover;
              background-position: center;
              opacity:0.45;
            "></div>
            <div style="
              position:absolute;
              inset:0;
              background:linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 55%, rgba(15,23,42,0.3) 100%);
            "></div>
            <div style="
              position:absolute;
              inset:0;
              display:flex;
              align-items:center;
              justify-content:space-between;
              padding:32px 36px;
            ">
              <div>
                <p style="
                  margin:0;
                  font-size:13px;
                  letter-spacing:6px;
                  text-transform:uppercase;
                  opacity:0.65;
                ">Signature</p>
                <h3 style="
                  margin:14px 0 0;
                  font-size:42px;
                  letter-spacing:-1.2px;
                  font-weight:500;
                ">${brand.name}</h3>
              </div>
              <div style="
                display:flex;
                gap:14px;
              ">
                ${[primaryColor, secondaryColor, accentColor]
                  .map(
                    (color) => `
                      <span style="
                        width:44px;
                        height:44px;
                        border-radius:999px;
                        background:${color};
                        border:1px solid rgba(255,255,255,0.25);
                        display:inline-flex;
                      "></span>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: 80px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 14px;
        letter-spacing: 6px;
        text-transform: uppercase;
        opacity: 0.6;
      ">
        <span style="display:inline-flex;width:40px;height:1px;background:rgba(226,232,240,0.4);"></span>
        05
      </div>
    </div>
  `
}

// Ancienne fonction pour compatibilité
export const generateBrandPDF = (brand: Brand) => {
  // Format 16:9 moderne (297mm x 167mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 167] // 16:9 aspect ratio
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 30

  // Utiliser la fonction globale hexToRgb
  const primaryRgbValue = hexToRgb(brand.primaryColor || '#000000')
  const primaryRgb = primaryRgbValue || { r: 0, g: 0, b: 0 }

  // Page 1: Cover moderne et épuré
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Ligne décorative fine
  pdf.setDrawColor(255, 255, 255)
  pdf.setLineWidth(0.5)
  pdf.line(margin, pageHeight - 50, pageWidth - margin, pageHeight - 50)
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(72)
  pdf.setFont('helvetica', 'bold')
  pdf.text(brand.name, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' })
  
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('GUIDE DE MARQUE', pageWidth / 2, pageHeight - 40, { align: 'center' })

  // Page 2: Introduction épurée
  pdf.addPage()
  pdf.setFillColor(250, 250, 250)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Bande de couleur sur le côté
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.rect(0, 0, 8, pageHeight, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Introduction', margin + 10, margin + 15)
  
  if (brand.description) {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    const descLines = pdf.splitTextToSize(brand.description, pageWidth - 2 * margin - 20)
    pdf.text(descLines, margin + 10, margin + 35)
  }

  // Page 3: Palette de Couleurs moderne
  pdf.addPage()
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Couleurs', margin, margin + 15)

  const colors = [
    { label: 'PRIMAIRE', value: brand.primaryColor },
    { label: 'SECONDAIRE', value: brand.secondaryColor },
    { label: 'ACCENT', value: brand.accentColor }
  ].filter(c => c.value)

  const colorWidth = (pageWidth - 2 * margin - 40) / colors.length
  let xPos = margin

  colors.forEach((color, idx) => {
    if (color.value) {
      const colorRgbValue = hexToRgb(color.value)
      const colorRgb = colorRgbValue || { r: 0, g: 0, b: 0 }
      
      // Grand carré de couleur
      pdf.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b)
      pdf.rect(xPos, margin + 40, colorWidth, 60, 'F')
      
      // Label en dessous
      pdf.setTextColor(150, 150, 150)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(color.label, xPos + 5, margin + 115)
      
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      pdf.text(color.value, xPos + 5, margin + 125)
      
      xPos += colorWidth + 20
    }
  })

  // Page 4: Typographie épurée
  pdf.addPage()
  pdf.setFillColor(250, 250, 250)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Typographie', margin, margin + 15)

  let yPos = margin + 50
  if (brand.primaryFont) {
    pdf.setTextColor(150, 150, 150)
    pdf.setFontSize(10)
    pdf.text('POLICE PRINCIPALE', margin, yPos)
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(36)
    pdf.setFont('helvetica', 'bold')
    pdf.text(brand.primaryFont, margin, yPos + 15)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Utilisée pour les titres et éléments principaux', margin, yPos + 27)
    yPos += 50
  }

  if (brand.secondaryFont) {
    pdf.setTextColor(150, 150, 150)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('POLICE SECONDAIRE', margin, yPos)
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(36)
    pdf.text(brand.secondaryFont, margin, yPos + 15)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Utilisée pour le corps de texte', margin, yPos + 27)
  }

  // Page 5: Personnalité moderne
  pdf.addPage()
  const secondaryRgbValue = hexToRgb(brand.secondaryColor || brand.primaryColor || '#000000')
  const secondaryRgb = secondaryRgbValue || { r: 0, g: 0, b: 0 }
  pdf.setFillColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Identité', margin, margin + 15)

  yPos = margin + 55
  if (brand.brandPersonality) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('PERSONNALITÉ', margin, yPos)
    pdf.setFontSize(42)
    pdf.setFont('helvetica', 'bold')
    pdf.text(brand.brandPersonality, margin, yPos + 18)
    yPos += 45
  }

  if (brand.targetAudience) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('AUDIENCE', margin, yPos)
    pdf.setFontSize(42)
    pdf.setFont('helvetica', 'bold')
    pdf.text(brand.targetAudience, margin, yPos + 18)
  }

  // Page 6: Lignes directrices
  pdf.addPage()
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Lignes Directrices', margin, margin + 15)

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(80, 80, 80)
  const guidelines = [
    'Utilisez toujours la couleur primaire pour les éléments clés',
    'La couleur secondaire sert de support visuel',
    'La couleur accent doit être utilisée avec parcimonie',
    'Maintenez une hiérarchie typographique claire',
    'Respectez les espacements et proportions',
    'Assurez un contraste suffisant pour la lisibilité'
  ]

  yPos = margin + 40
  guidelines.forEach((guideline, index) => {
    // Numéro
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    pdf.circle(margin + 5, yPos - 2, 4, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${index + 1}`, margin + 5, yPos + 1, { align: 'center' })
    
    // Texte
    pdf.setTextColor(80, 80, 80)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text(guideline, margin + 15, yPos)
    yPos += 15
  })

  // Footer minimaliste sur chaque page
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    if (i !== 1) { // Pas de footer sur la cover
      pdf.setFontSize(9)
      pdf.setTextColor(180, 180, 180)
      pdf.text(
        brand.name.toUpperCase(),
        margin,
        pageHeight - 15
      )
      pdf.text(
        `${i}`,
        pageWidth - margin,
        pageHeight - 15,
        { align: 'right' }
      )
    }
  }

  // Télécharger le PDF
  pdf.save(`${brand.name.replace(/\s+/g, '_')}_Brand_Guide.pdf`)
}
