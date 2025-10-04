# Guide de Dépannage - Klerra

## Problème : Les brandings ne s'affichent pas dans le dashboard

### Solution appliquée

1. **API Route corrigée** (`/api/brands/route.ts`)
   - L'API accepte maintenant TOUS les champs du brand (name, colors, fonts, etc.)
   - Les données sont correctement sauvegardées dans la base de données

2. **Flux de sauvegarde**
   - Quand vous cliquez sur "Télécharger" dans le preview :
     - Si vous n'êtes PAS connecté → Redirection vers `/auth/signup`
     - Si vous ÊTES connecté → Sauvegarde du brand en DB puis redirection vers `/dashboard`

3. **Logs de débogage ajoutés**
   - Dans le Dashboard : Console logs pour voir les brands récupérés
   - Dans le Preview : Console logs pour la sauvegarde

### Comment tester

1. **Créer un nouveau branding**
   ```
   1. Aller sur la page d'accueil
   2. Entrer un prompt (ex: "Une marque de café artisanal")
   3. Compléter les 4 étapes de l'onboarding
   4. Cliquer sur "Télécharger" dans la page de preview
   ```

2. **Vérifier dans la console du navigateur**
   ```
   Ouvrez les DevTools (F12) et regardez la console :
   - ✅ Brand sauvegardé avec succès: {...}
   - 🔄 Récupération des brands...
   - ✅ Brands récupérés: X brand(s)
   ```

3. **Vérifier le dashboard**
   ```
   Vous devriez voir votre nouveau branding avec :
   - Le nom
   - La description
   - Les couleurs (preview)
   - Le statut "✓ Terminé"
   ```

### Si le problème persiste

1. **Vérifier que vous êtes bien connecté**
   - Regardez si les initiales apparaissent dans le header
   - Ou si vous voyez le bouton "Se connecter"

2. **Vérifier la console pour les erreurs**
   - Erreur 401 → Problème d'authentification
   - Erreur 500 → Problème serveur/base de données

3. **Nettoyer le sessionStorage**
   ```javascript
   // Dans la console du navigateur
   sessionStorage.clear()
   // Puis rafraîchir la page
   ```

4. **Vérifier la base de données**
   ```bash
   npx prisma studio
   # Regardez la table "Brand" pour voir si les données sont là
   ```

### Structure des données

Le brand contient :
- `name` : Nom du brand
- `description` : Description
- `prompt` : Prompt initial
- `primaryColor`, `secondaryColor`, `accentColor` : Couleurs
- `primaryFont`, `secondaryFont` : Typographies
- `brandPersonality` : Personnalité de la marque
- `targetAudience` : Audience cible
- `isCompleted` : true (quand terminé)
- `currentStep` : 4 (dernière étape)

### Commandes utiles

```bash
# Synchroniser le schéma Prisma
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio
npx prisma studio

# Redémarrer le serveur
npm run dev
```

