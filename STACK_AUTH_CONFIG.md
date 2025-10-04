# 🔐 Configuration Stack Auth pour Réinitialisation de Mot de Passe

## Problème Actuel

L'URL de réinitialisation pointe vers `http://localhost:3000/handler/password-reset` au lieu de votre domaine de production.

## Solution Complète

### 1. Trouver Votre Projet Stack Auth

Puisque Stack Auth a été configuré via Vercel/Neon :

1. **Aller sur Vercel** : [https://vercel.com](https://vercel.com)
2. **Ouvrir votre projet** Guidiqo/Klerra
3. **Settings** → **Environment Variables**
4. **Chercher** :
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

5. **Noter le Project ID** (ex: `prj_xxxxxxxxxxxxx`)

6. **Aller sur Stack Auth** : [https://app.stack-auth.com](https://app.stack-auth.com)
7. **Se connecter** avec le même compte que Vercel
8. **Chercher votre projet** avec l'ID noté

### 2. Configurer l'URL de Production

Dans Stack Auth Dashboard :

1. **Settings** → **Domains**
2. **Ajouter votre domaine de production** :
   - Si Vercel: `https://votre-app.vercel.app`
   - Si domaine custom: `https://guidiqo.com`

3. **Handler URLs** → **Password Reset Callback** :
   ```
   https://votre-domaine.com/handler/password-reset
   ```

4. **Allowed Callback URLs** :
   ```
   https://votre-domaine.com/handler/password-reset
   http://localhost:3000/handler/password-reset (pour dev)
   ```

### 3. Mettre à Jour les Variables d'Environnement

Dans Vercel, ajoutez :

```bash
# URL de base de votre app
NEXT_PUBLIC_APP_URL=https://votre-domaine.com

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=prj_xxxxxxxxxxxxx
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=xxxx
STACK_SECRET_SERVER_KEY=xxxx
```

### 4. Tester en Local

Pour tester localement, créez `.env.local` :

```bash
# Copier depuis Vercel
NEXT_PUBLIC_STACK_PROJECT_ID=votre_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=votre_key
STACK_SECRET_SERVER_KEY=votre_secret_key

# URL locale
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Déployer

```bash
cd Klerra
git add .
git commit -m "Configuration Stack Auth password reset"
git push
```

Vercel redéploiera automatiquement.

---

## Alternative : Sans Stack Auth Dashboard

Si vous ne trouvez pas votre projet Stack Auth, vous pouvez implémenter une solution personnalisée.

### Créer une Page de Réinitialisation Personnalisée

Fichier déjà créé : `/handler/password-reset/page.tsx`

Cette page :
- ✅ Récupère le code de réinitialisation
- ✅ Permet de définir un nouveau mot de passe
- ✅ Design cohérent avec votre app
- ✅ Messages en français

---

## Vérification Rapide

Pour voir quelle URL Stack Auth utilise :

1. Dans votre code actuel, Stack Auth redirige vers `/handler/password-reset`
2. Cette route doit exister et être accessible
3. Le domaine doit être configuré dans Stack Auth Dashboard

---

## Contact Stack Auth Support

Si vous ne trouvez toujours pas votre projet :

1. **Email** : support@stack-auth.com
2. **Indiquer** :
   - Votre email Vercel
   - Le projet ID (depuis Vercel)
   - Demander l'accès au dashboard

Ils répondent généralement en quelques heures.

