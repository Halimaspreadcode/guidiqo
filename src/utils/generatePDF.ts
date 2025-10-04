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

// Fonction pour générer un style aléatoire basé sur le hash du nom
const getStyleVariant = (brandName: string): number => {
  let hash = 0
  for (let i = 0; i < brandName.length; i++) {
    hash = ((hash << 5) - hash) + brandName.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 3) // 3 variantes de style
}

// Nouvelle fonction pour créer un PDF moderne avec HTML/CSS - Style Attico inspiré
export const generateModernBrandPDF = async (brand: Brand, images: {[key: string]: string}) => {
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
  
  // Page 1: Cover minimaliste et élégant (sans ligne décorative)
  const coverPage = createCoverPage(brand, styleVariant)
  pages.push(coverPage)
  
  // Page 2: Colors avec design épuré
  const colorsPage = createColorsPage(brand, styleVariant)
  pages.push(colorsPage)
  
  // Page 3: Typography style éditorial
  const typographyPage = createTypographyPage(brand, styleVariant)
  pages.push(typographyPage)
  
  // Page 4: Personality avec composition asymétrique (sans bloc jaune)
  const personalityPage = createPersonalityPage(brand, styleVariant)
  pages.push(personalityPage)
  
  // Page 5: Application avec grille moderne
  const applicationPage = createApplicationPage(brand, styleVariant)
  pages.push(applicationPage)

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

// Page de couverture - Style Attico minimaliste avec variantes
const createCoverPage = (brand: Brand, styleVariant: number) => {
  // Variante 1: Bloc en haut à gauche
  // Variante 2: Bloc en bas à droite
  // Variante 3: Deux petits blocs diagonaux
  
  const getLayout = () => {
    switch(styleVariant) {
      case 0:
        return `
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 600px;
            height: 400px;
            background: ${brand.primaryColor || '#000'};
          "></div>
        `
      case 1:
        return `
          <div style="
            position: absolute;
            bottom: 0;
            right: 0;
            width: 700px;
            height: 350px;
            background: ${brand.secondaryColor || brand.primaryColor || '#000'};
          "></div>
        `
      case 2:
        return `
          <div style="
            position: absolute;
            top: 100px;
            right: 150px;
            width: 250px;
            height: 250px;
            background: ${brand.primaryColor || '#000'};
          "></div>
          <div style="
            position: absolute;
            bottom: 120px;
            left: 120px;
            width: 180px;
            height: 180px;
            background: ${brand.accentColor || brand.secondaryColor || '#666'};
          "></div>
        `
      default:
        return ''
    }
  }
  
  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: white;
      font-family: 'Raleway', -apple-system, sans-serif;
    ">
      ${getLayout()}
      
      <!-- Nom de la marque - position centrale -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 100%;
        z-index: 1;
      ">
        <h1 style="
          font-size: 180px;
          font-weight: 300;
          color: #000;
          margin: 0 0 150px 0;
          letter-spacing: -4px;
          line-height: 0.9;
        ">${brand.name}</h1>
        
        <p style="
          font-size: 18px;
          color: #666;
          margin: 0;
          margin-top: 20px;
          letter-spacing: 12px;
          text-transform: uppercase;
          font-weight: 300;
        ">Guide de Style</p>
      </div>
      
      <!-- Description en bas à droite (si variante 0 ou 2) -->
      ${brand.description && styleVariant !== 1 ? `
        <div style="
          position: absolute;
          bottom: 80px;
          right: 100px;
          max-width: 500px;
          text-align: right;
          z-index: 1;
        ">
          <p style="
            font-size: 16px;
            color: #999;
            margin: 0;
            line-height: 1.8;
            font-weight: 300;
          ">${brand.description}</p>
        </div>
      ` : ''}
    </div>
  `
}

// Page des couleurs - Style éditorial minimaliste
const createColorsPage = (brand: Brand, styleVariant: number) => {
  const colors = [
    { label: 'Primary', value: brand.primaryColor, desc: 'Couleur principale' },
    { label: 'Secondary', value: brand.secondaryColor, desc: 'Couleur secondaire' },
    { label: 'Accent', value: brand.accentColor, desc: 'Couleur d\'accentuation' }
  ].filter(c => c.value)
  
  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #fafafa;
      font-family: 'Raleway', -apple-system, sans-serif;
      padding: 100px 120px;
    ">
      <!-- En-tête de section -->
      <div style="
        margin-bottom: 100px;
      ">
        <div style="
          width: 40px;
          height: 2px;
          background: #000;
          margin-bottom: 30px;
        "></div>
        <h2 style="
          font-size: 72px;
          font-weight: 300;
          color: #000;
          margin: 0;
          letter-spacing: -1px;
        ">Palette de Couleurs</h2>
      </div>
      
      <!-- Grille de couleurs -->
      <div style="
        display: flex;
        gap: 80px;
        align-items: stretch;
      ">
        ${colors.map((color, idx) => `
          <div style="
            flex: 1;
            position: relative;
          ">
            <!-- Bloc de couleur principal -->
            <div style="
              width: 100%;
              height: ${idx === 0 ? '500' : idx === 1 ? '400' : '450'}px;
              background: ${color.value};
              margin-bottom: 40px;
              border: 1px solid rgba(0, 0, 0, 0.05);
            "></div>
            
            <!-- Info couleur -->
            <div style="
              padding: 0 20px;
            ">
              <p style="
                font-size: 14px;
                color: #999;
                margin: 0 0 12px 0;
                letter-spacing: 4px;
                text-transform: uppercase;
                font-weight: 400;
              ">${color.label}</p>
              <p style="
                font-size: 32px;
                font-weight: 300;
                color: #000;
                margin: 0 0 16px 0;
                font-family: 'Courier New', monospace;
                letter-spacing: 1px;
              ">${color.value}</p>
              <p style="
                font-size: 15px;
                color: #666;
                margin: 0;
                font-weight: 300;
                line-height: 1.6;
              ">${color.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Footer avec numéro de page -->
      <div style="
        position: absolute;
        bottom: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 20px;
      ">
        <div style="
          width: 40px;
          height: 1px;
          background: #ccc;
        "></div>
        <span style="
          font-size: 14px;
          color: #999;
          font-weight: 300;
        ">01</span>
      </div>
      
      <!-- Watermark "Made with Guidiqo" - Top Right (Pill style) -->
      <div style="
        position: absolute;
        top: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 6px;
        background: #DC2626;
        padding: 8px 16px;
        border-radius: 50px;
      ">
        <div style="
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            color: #DC2626;
            font-size: 12px;
            font-weight: bold;
          ">G</span>
        </div>
        <span style="
          font-size: 13px;
          color: white;
          font-weight: 600;
          letter-spacing: 0.3px;
        ">Made with Guidiqo</span>
      </div>
    </div>
  `
}

// Page typographie - Layout asymétrique et épuré
const createTypographyPage = (brand: Brand, styleVariant: number) => {
  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: white;
      font-family: 'Raleway', -apple-system, sans-serif;
      overflow: hidden;
    ">
      <!-- Bloc de couleur décoratif en haut à droite -->
      <div style="
        position: absolute;
        top: 0;
        right: 0;
        width: 350px;
        height: 280px;
        background: ${brand.primaryColor || '#000'};
        opacity: 0.08;
      "></div>
      
      <div style="
        padding: 100px 120px;
      ">
        <!-- En-tête -->
        <div style="
          margin-bottom: 120px;
        ">
          <div style="
            width: 40px;
            height: 2px;
            background: #000;
            margin-bottom: 30px;
          "></div>
          <h2 style="
            font-size: 72px;
            font-weight: 300;
            color: #000;
            margin: 0;
            letter-spacing: -1px;
          ">Typographie</h2>
        </div>
        
        <!-- Grille 2 colonnes -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
        ">
          <!-- Police Principale -->
          ${brand.primaryFont ? `
            <div style="
              position: relative;
            ">
              <p style="
                font-size: 13px;
                color: #999;
                margin: 0 0 40px 0;
                letter-spacing: 3px;
                text-transform: uppercase;
                font-weight: 400;
              ">Primary Typeface</p>
              
              <h3 style="
                font-size: 120px;
                font-weight: 300;
                color: #000;
                margin: 0 0 60px 0;
                line-height: 0.9;
                letter-spacing: -3px;
              ">Aa</h3>
              
              <div style="
                padding: 30px 0;
                border-top: 1px solid #e0e0e0;
              ">
                <p style="
                  font-size: 28px;
                  font-weight: 400;
                  color: #000;
                  margin: 0 0 12px 0;
                  letter-spacing: 0.5px;
                ">${brand.primaryFont}</p>
                <p style="
                  font-size: 14px;
                  color: #666;
                  margin: 0;
                  line-height: 1.6;
                  font-weight: 300;
                ">Pour les titres, en-têtes et<br/>éléments d'identité visuelle</p>
              </div>
              
              <!-- Démonstration alphabet -->
              <div style="
                margin-top: 50px;
                padding: 30px;
                background: #fafafa;
              ">
                <p style="
                  font-size: 24px;
                  color: #000;
                  margin: 0;
                  letter-spacing: 2px;
                  font-weight: 300;
                ">ABCDEFGHIJKLM</p>
                <p style="
                  font-size: 24px;
                  color: #666;
                  margin: 8px 0 0 0;
                  letter-spacing: 1px;
                  font-weight: 300;
                ">0123456789</p>
              </div>
            </div>
          ` : ''}
          
          <!-- Police Secondaire -->
          ${brand.secondaryFont ? `
            <div style="
              position: relative;
            ">
              <p style="
                font-size: 13px;
                color: #999;
                margin: 0 0 40px 0;
                letter-spacing: 3px;
                text-transform: uppercase;
                font-weight: 400;
              ">Secondary Typeface</p>
              
              <h3 style="
                font-size: 120px;
                font-weight: 400;
                color: #000;
                margin: 0 0 60px 0;
                line-height: 0.9;
                letter-spacing: -2px;
              ">Aa</h3>
              
              <div style="
                padding: 30px 0;
                border-top: 1px solid #e0e0e0;
              ">
                <p style="
                  font-size: 28px;
                  font-weight: 400;
                  color: #000;
                  margin: 0 0 12px 0;
                  letter-spacing: 0.5px;
                ">${brand.secondaryFont}</p>
                <p style="
                  font-size: 14px;
                  color: #666;
                  margin: 0;
                  line-height: 1.6;
                  font-weight: 300;
                ">Pour le corps de texte,<br/>descriptions et contenus</p>
              </div>
              
              <!-- Démonstration texte -->
              <div style="
                margin-top: 50px;
                padding: 30px;
                background: #fafafa;
              ">
                <p style="
                  font-size: 16px;
                  color: #000;
                  margin: 0;
                  line-height: 1.8;
                  font-weight: 300;
                ">The quick brown fox jumps<br/>over the lazy dog.</p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 20px;
      ">
        <div style="
          width: 40px;
          height: 1px;
          background: #ccc;
        "></div>
        <span style="
          font-size: 14px;
          color: #999;
          font-weight: 300;
        ">02</span>
      </div>
      
      <!-- Watermark "Made with Guidiqo" - Top Right (Pill style) -->
      <div style="
        position: absolute;
        top: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 6px;
        background: #DC2626;
        padding: 8px 16px;
        border-radius: 50px;
      ">
        <div style="
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            color: #DC2626;
            font-size: 12px;
            font-weight: bold;
          ">G</span>
        </div>
        <span style="
          font-size: 13px;
          color: white;
          font-weight: 600;
          letter-spacing: 0.3px;
        ">Made with Guidiqo</span>
      </div>
    </div>
  `
}

// Page personnalité - Composition audacieuse (sans bloc jaune)
const createPersonalityPage = (brand: Brand, styleVariant: number) => {
  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: white;
      font-family: 'Raleway', -apple-system, sans-serif;
      overflow: hidden;
    ">
      <!-- Grand bloc de couleur diagonale -->
      <div style="
        position: absolute;
        top: -200px;
        right: -200px;
        width: 1000px;
        height: 1000px;
        background: ${brand.primaryColor || '#000'};
        transform: rotate(25deg);
        opacity: 0.95;
      "></div>
      
      <div style="
        padding: 100px 120px;
        position: relative;
        z-index: 1;
      ">
        <!-- En-tête -->
        <div style="
          margin-bottom: 100px;
        ">
          <div style="
            width: 40px;
            height: 2px;
            background: #000;
            margin-bottom: 30px;
          "></div>
          <h2 style="
            font-size: 72px;
            font-weight: 300;
            color: #000;
            margin: 0;
            letter-spacing: -1px;
          ">Identité & Audience</h2>
        </div>
        
        <!-- Contenu principal -->
        <div style="
          max-width: 900px;
        ">
          ${brand.brandPersonality ? `
            <div style="
              margin-bottom: 80px;
            ">
              <p style="
                font-size: 13px;
                color: #999;
                margin: 0 0 30px 0;
                letter-spacing: 3px;
                text-transform: uppercase;
              ">Personnalité de Marque</p>
              <h3 style="
                font-size: 96px;
                font-weight: 300;
                color: #000;
                margin: 0;
                line-height: 1;
                letter-spacing: -2px;
                text-transform: capitalize;
              ">${brand.brandPersonality}</h3>
            </div>
          ` : ''}
          
          ${brand.targetAudience ? `
            <div style="
              padding: 50px 0;
              border-top: 1px solid #e0e0e0;
            ">
              <p style="
                font-size: 13px;
                color: #999;
                margin: 0 0 25px 0;
                letter-spacing: 3px;
                text-transform: uppercase;
              ">Audience Cible</p>
              <p style="
                font-size: 42px;
                font-weight: 300;
                color: #000;
                margin: 0 0 20px 0;
                line-height: 1.3;
                text-transform: capitalize;
              ">${brand.targetAudience}</p>
              <p style="
                font-size: 16px;
                color: #666;
                margin: 0;
                line-height: 1.8;
                font-weight: 300;
                max-width: 600px;
              ">Cette audience est au cœur de chaque décision créative, guidant le ton, le style et l'approche visuelle de la marque.</p>
            </div>
          ` : ''}
          
          ${brand.description ? `
            <div style="
              margin-top: 60px;
              padding: 40px;
              background: #fafafa;
            ">
              <p style="
                font-size: 15px;
                color: #666;
                margin: 0;
                line-height: 1.9;
                font-weight: 300;
              ">${brand.description}</p>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 20px;
        z-index: 1;
      ">
        <div style="
          width: 40px;
          height: 1px;
          background: #ccc;
        "></div>
        <span style="
          font-size: 14px;
          color: #999;
          font-weight: 300;
        ">03</span>
      </div>
      
      <!-- Watermark "Made with Guidiqo" - Top Right -->
      <div style="
        position: absolute;
        top: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 8px;
        opacity: 0.5;
        z-index: 1;
      ">
        <span style="
          font-size: 13px;
          color: #999;
          font-weight: 300;
          letter-spacing: 0.5px;
        ">Made with</span>
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <div style="
            width: 20px;
            height: 20px;
            background: #000;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">G</span>
          </div>
          <span style="
            font-size: 14px;
            color: #000;
            font-weight: 600;
            letter-spacing: 0.3px;
          ">Guidiqo</span>
        </div>
      </div>
    </div>
  `
}

// Page d'application - Grille et règles d'utilisation
const createApplicationPage = (brand: Brand, styleVariant: number) => {
  const guidelines = [
    'Utiliser la couleur primaire pour établir la hiérarchie visuelle',
    'Maintenir un espace blanc généreux autour des éléments',
    'Privilégier la simplicité et la clarté dans la composition',
    'Assurer un contraste optimal pour la lisibilité',
    'Respecter les proportions et l\'échelle typographique',
    'Rester cohérent sur l\'ensemble des supports'
  ]
  
  return `
    <div style="
      width: 1920px;
      height: 1080px;
      position: relative;
      background: white;
      font-family: 'Raleway', -apple-system, sans-serif;
      padding: 100px 120px;
    ">
      <!-- Bloc décoratif coin supérieur gauche -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        height: 280px;
        background: ${brand.secondaryColor || brand.primaryColor || '#000'};
        opacity: 0.06;
      "></div>
      
      <div>
        <!-- En-tête -->
        <div style="
          margin-bottom: 100px;
        ">
          <div style="
            width: 40px;
            height: 2px;
            background: #000;
            margin-bottom: 30px;
          "></div>
          <h2 style="
            font-size: 72px;
            font-weight: 300;
            color: #000;
            margin: 0;
            letter-spacing: -1px;
          ">Règles d'Application</h2>
        </div>
        
        <!-- Grid des guidelines -->
        <div style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px 80px;
          margin-bottom: 100px;
        ">
          ${guidelines.map((text, i) => `
            <div style="
              display: flex;
              gap: 30px;
              align-items: flex-start;
            ">
              <div style="
                width: 50px;
                height: 50px;
                background: ${i % 2 === 0 ? brand.primaryColor || '#000' : brand.accentColor || brand.secondaryColor || '#666'};
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="
                  color: white;
                  font-size: 18px;
                  font-weight: 400;
                ">${(i + 1).toString().padStart(2, '0')}</span>
              </div>
              <p style="
                font-size: 17px;
                color: #333;
                margin: 0;
                line-height: 1.7;
                font-weight: 300;
                padding-top: 6px;
              ">${text}</p>
            </div>
          `).join('')}
        </div>
        
        <!-- Section palette de couleurs récapitulative -->
        <div style="
          border-top: 1px solid #e0e0e0;
          padding-top: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div>
            <p style="
              font-size: 13px;
              color: #999;
              margin: 0 0 20px 0;
              letter-spacing: 3px;
              text-transform: uppercase;
            ">Palette Complète</p>
            <div style="
              display: flex;
              gap: 20px;
            ">
              ${[brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(Boolean).map(color => `
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                ">
                  <div style="
                    width: 120px;
                    height: 120px;
                    background: ${color};
                    border: 1px solid rgba(0, 0, 0, 0.05);
                  "></div>
                  <p style="
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    font-family: 'Courier New', monospace;
                    font-weight: 300;
                  ">${color}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Logo marque à droite -->
          <div style="
            text-align: right;
          ">
            <h3 style="
              font-size: 64px;
              font-weight: 300;
              color: #000;
              margin: 0;
              letter-spacing: -1px;
            ">${brand.name}</h3>
            <div style="
              width: 100px;
              height: 1px;
              background: ${brand.primaryColor || '#000'};
              margin: 20px 0 0 auto;
            "></div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 20px;
      ">
        <div style="
          width: 40px;
          height: 1px;
          background: #ccc;
        "></div>
        <span style="
          font-size: 14px;
          color: #999;
          font-weight: 300;
        ">04</span>
      </div>
      
      <!-- Watermark "Made with Guidiqo" - Top Right (Pill style) -->
      <div style="
        position: absolute;
        top: 60px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 6px;
        background: #DC2626;
        padding: 8px 16px;
        border-radius: 50px;
      ">
        <div style="
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            color: #DC2626;
            font-size: 12px;
            font-weight: bold;
          ">G</span>
        </div>
        <span style="
          font-size: 13px;
          color: white;
          font-weight: 600;
          letter-spacing: 0.3px;
        ">Made with Guidiqo</span>
      </div>
    </div>
  `
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0'
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

  // Helper pour convertir hex en RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const primaryRgb = hexToRgb(brand.primaryColor || '#000000')

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
      const colorRgb = hexToRgb(color.value)
      
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
  const secondaryRgb = hexToRgb(brand.secondaryColor || brand.primaryColor || '#000000')
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

