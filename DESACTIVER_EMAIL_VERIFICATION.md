# 🔓 Désactiver la Vérification d'Email Stack Auth

## Pourquoi désactiver ?

La vérification d'email peut être bloquante pour vos utilisateurs :
- ❌ L'email de vérification peut arriver en spam
- ❌ Certains utilisateurs ne vérifient pas leur email immédiatement
- ❌ Risque de perdre des utilisateurs pendant le processus
- ✅ **Meilleure expérience** : connexion immédiate après inscription

---

## 📋 Étapes pour Désactiver

### 1. Accéder au Stack Auth Dashboard

1. **Aller sur** : [https://app.stack-auth.com](https://app.stack-auth.com)
2. **Se connecter** avec votre compte (le même utilisé pour créer le projet)
3. **Sélectionner** votre projet Klerra/Guidiqo

### 2. Désactiver la Vérification d'Email

1. Dans le menu de gauche, cliquer sur **⚙️ Settings**
2. Aller dans l'onglet **🔐 Authentication**
3. Chercher la section **"Email Verification"**
4. **Décocher** l'option :
   ```
   ☐ Require email verification before users can sign in
   ```
5. **Sauvegarder** les changements

### 3. Configuration Alternative (Si l'option n'est pas visible)

Si vous ne trouvez pas l'option directement :

1. **Settings** → **Email Settings**
2. **Désactiver** "Email Verification Required"
3. Ou chercher **"Required Actions"** → Retirer "Email Verification"

---

## ✅ Vérification

Après la désactivation :

1. **Créer un nouveau compte** sur votre app
2. Vous devriez être **immédiatement redirigé** vers `/dashboard`
3. **Aucun email de vérification** ne devrait être envoyé
4. L'utilisateur peut utiliser l'app **tout de suite**

---

## 🔄 Pour Réactiver Plus Tard

Si vous voulez réactiver la vérification d'email plus tard (recommandé pour la sécurité en production) :

1. **Recocher** l'option dans Stack Auth Dashboard
2. La page `/handler/email-verification` est **déjà prête** dans votre code
3. Vos utilisateurs recevront un email avec un lien vers cette page
4. La page gère automatiquement :
   - ✅ La vérification
   - ✅ Les erreurs
   - ✅ La redirection vers le dashboard
   - ✅ La restauration des brands en attente

---

## 🎯 Configuration Actuelle du Code

Le code est **déjà configuré** pour gérer la vérification si vous la réactivez :

### Fichiers configurés :
- ✅ `/src/lib/stack.ts` - URLs de vérification configurées
- ✅ `/src/app/providers.tsx` - URLs client configurées
- ✅ `/src/app/handler/email-verification/page.tsx` - Page de vérification avec design

### Ce que vous devez faire :
- **Juste désactiver dans le Dashboard** Stack Auth
- Le code reste en place pour une activation future si nécessaire

---

## 💡 Recommandations

### Pour un MVP/Lancement :
- ✅ **Désactiver** la vérification d'email
- ✅ Permet une adoption rapide
- ✅ Moins de friction pour les nouveaux utilisateurs

### Pour la Production (plus tard) :
- 🔒 **Activer** la vérification d'email
- 🔒 Meilleure sécurité
- 🔒 Évite les faux comptes
- 🔒 Assure que les utilisateurs ont un vrai email

---

## 🆘 Problème : Je ne trouve pas mon projet Stack Auth

### Solution 1 : Vérifier vos projets

1. Sur [app.stack-auth.com](https://app.stack-auth.com)
2. En haut à gauche, **dropdown** avec tous vos projets
3. Chercher par nom : "Klerra", "Guidiqo", ou par ID

### Solution 2 : Trouver le Project ID

Dans **Vercel** :
1. Projet Klerra → **Settings** → **Environment Variables**
2. Chercher `NEXT_PUBLIC_STACK_PROJECT_ID`
3. Copier la valeur (ex: `prj_xxxxx`)
4. Utiliser cet ID pour trouver le projet dans Stack Auth

### Solution 3 : Contact Support

Si vraiment introuvable :
- Email : **support@stack-auth.com**
- Indiquer :
  - Votre email
  - Le Project ID depuis Vercel
  - Demander l'accès au dashboard

Ils répondent généralement en **quelques heures**.

---

## 📞 Besoin d'aide ?

Si vous avez des questions ou problèmes :
1. Vérifier les logs dans Stack Auth Dashboard
2. Vérifier les variables d'environnement dans Vercel
3. Tester avec un nouveau compte de test

---

## ✨ Résultat Final

Une fois désactivé :
- ✅ Inscription → Connexion **immédiate**
- ✅ Redirection automatique vers `/dashboard`
- ✅ Pas d'email de vérification
- ✅ Expérience utilisateur **fluide**
- ✅ Aucun utilisateur perdu

