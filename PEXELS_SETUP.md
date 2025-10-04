# 🎨 Configuration Pexels API (GRATUIT)

## Pourquoi Pexels ?
- ✅ **Totalement GRATUIT**
- ✅ **200 requêtes par heure** (largement suffisant)
- ✅ **Images de haute qualité** et libres de droits
- ✅ **Recherche contextuelle** intelligente
- ✅ Pas de limite de temps

## Comment obtenir votre clé API (2 minutes)

### Étape 1 : Créer un compte
1. Allez sur : https://www.pexels.com/api/
2. Cliquez sur "Get Started" ou "Sign Up"
3. Inscrivez-vous avec votre email

### Étape 2 : Obtenir votre clé
1. Une fois connecté, allez dans votre dashboard
2. Copiez votre **API Key** (elle ressemble à : `563492ad6f917000...`)

### Étape 3 : Ajouter la clé dans votre projet

Créez un fichier `.env.local` à la racine du projet `/Klerra/` :

```bash
# Pexels API (Gratuite)
PEXELS_API_KEY=votre_cle_pexels_ici

# Autres variables (gardez les existantes)
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
DATABASE_URL=...
GROQ_API_KEY=...
```

### Étape 4 : Redémarrer le serveur

```bash
npm run dev
```

## Alternatives gratuites (si besoin)

### 1. Unsplash API
- **Limite** : 50 requêtes/heure
- **URL** : https://unsplash.com/developers
- Variable : `UNSPLASH_ACCESS_KEY`

### 2. Pixabay API
- **Limite** : 100 requêtes/minute
- **URL** : https://pixabay.com/api/docs/
- Variable : `PIXABAY_API_KEY`

## Comment ça marche maintenant

Le système va :
1. 📝 Analyser la description, personnalité et audience de la marque
2. 🔍 Chercher sur Pexels des images pertinentes
3. 🎨 Retourner des images haute qualité qui matchent le contexte
4. 💾 Si erreur, utiliser des images Unsplash en fallback

## Exemple de résultat

Pour un branding "Restaurant moderne" avec personnalité "Élégant" :
- **Hero** : Image de restaurant moderne et élégant
- **Typography** : Image de design typographique
- **Personality** : Image lifestyle élégante
- **Accent** : Pattern abstrait moderne
- **Application** : Workspace/office moderne

Les images sont **automatiquement générées** selon le contexte ! 🎉

