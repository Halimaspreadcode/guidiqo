# 📧 Comment Personnaliser les Emails

## Option 1 : Via le Dashboard Stack Auth (Le Plus Simple)

### Étape 1 : Accéder au Dashboard
1. Allez sur [https://app.stack-auth.com](https://app.stack-auth.com)
2. Connectez-vous à votre projet Guidiqo
3. Dans le menu de gauche, allez dans **Settings** → **Email Templates**

### Étape 2 : Modifier le Template de Réinitialisation

1. **Sélectionnez "Password Reset Email"**
2. **Personnalisez le contenu** :

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Raleway', -apple-system, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
      padding: 40px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin: 0;
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 32px;
      background: #1a1a1a;
      color: white !important;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f9f9f9;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Guidiqo</h1>
    </div>
    <div class="content">
      <h1>Réinitialiser votre mot de passe</h1>
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe sur Guidiqo.</p>
      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      
      <div style="text-align: center;">
        <a href="{{resetLink}}" class="button">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px;">
        Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, 
        vous pouvez ignorer cet email en toute sécurité.
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
        <a href="{{resetLink}}" style="color: #1a1a1a;">{{resetLink}}</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Guidiqo - Créez votre branding professionnel avec l'IA</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
```

### Variables Disponibles

Stack Auth fournit ces variables que vous pouvez utiliser :
- `{{resetLink}}` - Le lien de réinitialisation
- `{{userEmail}}` - L'email de l'utilisateur
- `{{userName}}` - Le nom de l'utilisateur
- `{{expiryTime}}` - Heure d'expiration du lien

### Étape 3 : Tester

1. Sauvegardez le template
2. Allez sur votre site `/auth/forgot-password`
3. Entrez votre email
4. Vérifiez le nouvel email personnalisé

---

## Option 2 : Email Provider Personnalisé (Resend)

Si vous voulez un contrôle total avec Resend :

### 1. Créer le Template React Email

Créez un fichier `src/emails/PasswordResetEmail.tsx` :

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Hr,
} from '@react-email/components'

interface PasswordResetEmailProps {
  resetLink: string
  userEmail: string
}

export default function PasswordResetEmail({
  resetLink,
  userEmail,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Guidiqo</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={title}>Réinitialiser votre mot de passe</Text>
            <Text style={paragraph}>Bonjour,</Text>
            <Text style={paragraph}>
              Vous avez demandé à réinitialiser votre mot de passe pour votre
              compte Guidiqo ({userEmail}).
            </Text>
            <Text style={paragraph}>
              Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Réinitialiser mon mot de passe
              </Button>
            </Section>

            <Text style={paragraph}>
              Ce lien est valide pendant <strong>24 heures</strong>.
            </Text>
            <Text style={note}>
              Si vous n'avez pas demandé cette réinitialisation, vous pouvez
              ignorer cet email en toute sécurité.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans
              votre navigateur :
            </Text>
            <Text style={link}>{resetLink}</Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2024 Guidiqo - Créez votre branding professionnel avec l'IA
            </Text>
            <Text style={footerText}>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: 'Raleway, -apple-system, sans-serif',
}

const container = {
  margin: '40px auto',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}

const header = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
  padding: '40px',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: 0,
}

const content = {
  padding: '40px',
}

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 20px 0',
}

const paragraph = {
  fontSize: '16px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '50px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const note = {
  fontSize: '14px',
  color: '#999999',
  margin: '30px 0 0 0',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '30px 0',
}

const footer = {
  fontSize: '14px',
  color: '#999999',
  margin: '0 0 10px 0',
}

const link = {
  fontSize: '12px',
  color: '#1a1a1a',
  wordBreak: 'break-all' as const,
}

const footerSection = {
  backgroundColor: '#f9f9f9',
  padding: '30px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#999999',
  margin: '5px 0',
}
```

### 2. Installer React Email

```bash
cd Klerra
npm install @react-email/components
```

### 3. Créer l'API d'envoi

Créez `src/app/api/send-reset-email/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import PasswordResetEmail from '@/emails/PasswordResetEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, resetLink } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'Guidiqo <noreply@guidiqo.com>',
      to: [email],
      subject: 'Réinitialiser votre mot de passe - Guidiqo',
      react: PasswordResetEmail({ resetLink, userEmail: email }),
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
```

---

## Option 3 : Modification Rapide (Dans Stack Auth)

### Version Simple HTML :

```html
<div style="max-width:600px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;font-family:Arial,sans-serif">
  <div style="background:linear-gradient(135deg,#1a1a1a,#4a4a4a);padding:40px;text-align:center">
    <h1 style="color:white;margin:0;font-size:32px">Guidiqo</h1>
  </div>
  <div style="padding:40px">
    <h2 style="color:#1a1a1a;margin:0 0 20px">Réinitialiser votre mot de passe</h2>
    <p style="color:#666;line-height:1.6;margin:0 0 20px">Bonjour,</p>
    <p style="color:#666;line-height:1.6;margin:0 0 20px">
      Cliquez sur le bouton pour réinitialiser votre mot de passe :
    </p>
    <div style="text-align:center;margin:30px 0">
      <a href="{{resetLink}}" style="background:#1a1a1a;color:white;padding:16px 32px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:600">
        Réinitialiser mon mot de passe
      </a>
    </div>
    <p style="color:#999;font-size:14px;margin-top:30px">
      Ce lien est valide pendant 24 heures.
    </p>
  </div>
  <div style="background:#f9f9f9;padding:30px;text-align:center">
    <p style="color:#999;font-size:12px;margin:0">
      © 2024 Guidiqo - Créez votre branding avec l'IA
    </p>
  </div>
</div>
```

---

## 🎨 Conseils de Design

1. **Utilisez votre identité visuelle** : Couleurs, logo, typographie
2. **Restez simple** : Email lisible sur mobile
3. **Call-to-action clair** : Bouton visible et explicite
4. **Informations importantes** : Durée de validité, sécurité
5. **Footer** : Informations légales, désinscription

## 📱 Test

Pour prévisualiser vos emails :
```bash
npm install -g @react-email/cli
cd Klerra
email dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000)

---

**Besoin d'aide ?** Consultez la documentation de Stack Auth ou Resend pour plus de détails.

