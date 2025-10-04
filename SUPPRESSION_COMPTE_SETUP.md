# 🗑️ Système de Suppression de Compte - Configuration

## ✅ Fonctionnalités Implémentées

### 1. 🚨 **Bannière Rouge d'Alerte**
- **Affichage** : Sur toutes les pages du site quand une demande est en cours
- **Position** : Fixée en haut de l'écran (z-index: 9999)
- **Contenu** :
  - Icône d'avertissement animée
  - Date de suppression prévue
  - Bouton "Annuler la suppression"
  - Barre de progression animée

### 2. 📧 **Système d'Emails Automatiques**

#### Email à l'Admin
- **Sujet** : `⚠️ Demande de suppression de compte - [email]`
- **Contenu** :
  - Nom et email de l'utilisateur
  - Date de la demande
  - Date de suppression prévue
  - Nombre de projets
  - Liste des projets avec IDs
  - Raison du départ (si fournie)

#### Email à l'Utilisateur
- **Sujet** : `Confirmation de votre demande de suppression de compte`
- **Contenu** :
  - Confirmation de la demande
  - Date exacte de suppression (7 jours ouvrés)
  - Liste de ce qui sera supprimé
  - Lien pour annuler
  - Délai de rétractation

### 3. ⏱️ **Délai de 7 Jours Ouvrés**
- Calcul automatique excluant samedi/dimanche
- Affichage de la date exacte formatée en français
- Possibilité d'annuler à tout moment pendant ce délai

### 4. 💾 **Base de Données**
```prisma
model AccountDeletionRequest {
  id           String         @id @default(cuid())
  userId       String         @unique
  user         User           @relation(...)
  
  reason       String?        // Raison optionnelle
  status       DeletionStatus // PENDING, COMPLETED, CANCELLED
  
  requestedAt  DateTime       // Date de la demande
  scheduledFor DateTime       // Date prévue de suppression
  completedAt  DateTime?      // Date effective (si réalisée)
  cancelledAt  DateTime?      // Date d'annulation (si annulée)
}
```

## 📁 Fichiers Créés

### Composants
1. **`/src/components/DeletionBanner.tsx`**
   - Bannière rouge en haut du site
   - Vérifie automatiquement le statut
   - Animation et design moderne

### API Routes
1. **`/src/app/api/account/delete-request/route.ts`**
   - Crée la demande de suppression
   - Calcule la date (7 jours ouvrés)
   - Envoie les emails

2. **`/src/app/api/account/cancel-deletion/route.ts`**
   - Annule la demande
   - Envoie les emails de confirmation

3. **`/src/app/api/account/deletion-status/route.ts`**
   - Vérifie si l'utilisateur a une demande en cours
   - Retourne les infos pour la bannière

### Pages
1. **`/src/app/profil/cancel-deletion/page.tsx`**
   - Page dédiée pour annuler la suppression
   - Confirmation visuelle
   - Redirection automatique

### Modifications
1. **`/src/app/profil/page.tsx`**
   - Modal modifiée avec champ de raison
   - Bannière de confirmation après demande
   - Bouton pour annuler depuis le profil

2. **`/src/app/layout.tsx`**
   - Bannière ajoutée globalement
   - S'affiche sur toutes les pages

3. **`prisma/schema.prisma`**
   - Ajout du modèle `AccountDeletionRequest`
   - Enum `DeletionStatus`
   - Relation avec `User`

## 🔧 Configuration

### 1. Variables d'Environnement

Ajoutez dans `.env.local` :

```bash
# Resend API (déjà configuré)
RESEND_API_KEY=re_4XYpFFrz_78iJbK36cApnPgWtFwp6on6F

# Email admin pour recevoir les notifications (optionnel)
ADMIN_EMAIL=votre@email.com

# URL de l'application (pour les liens dans les emails)
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 2. Configuration Resend

**Actuellement** : Les emails utilisent `onboarding@resend.dev` (email de test Resend)

**Pour la Production** :
1. Aller sur [resend.com](https://resend.com)
2. Ajouter et vérifier votre domaine
3. Modifier dans les API routes :
   ```typescript
   from: 'Guidiqo <noreply@votredomaine.com>'
   ```

## 🚀 Utilisation

### Pour l'Utilisateur

1. **Demander la suppression** :
   - Aller sur `/profil`
   - Cliquer sur "Supprimer mon compte"
   - Optionnel : Donner une raison
   - Cliquer sur "Confirmer la demande"

2. **Voir la bannière** :
   - Une bannière rouge apparaît en haut de toutes les pages
   - Affiche la date de suppression
   - Bouton pour annuler directement

3. **Annuler** :
   - Cliquer sur "Annuler la suppression" dans la bannière
   - OU aller sur `/profil/cancel-deletion`
   - Confirmer l'annulation

### Pour l'Admin

1. **Recevoir la notification** :
   - Email automatique avec toutes les infos
   - Détails de l'utilisateur
   - Liste des projets
   - Raison du départ

2. **Traitement manuel** :
   - Après 7 jours, supprimer manuellement :
     - Le compte utilisateur
     - Tous ses projets
     - Ses images uploadées
     - Ses données personnelles

## 📊 Flux Complet

```
1. Utilisateur clique "Supprimer mon compte"
   ↓
2. Modal s'affiche avec champ raison (optionnel)
   ↓
3. Confirmation → API /account/delete-request
   ↓
4. Base de données :
   - Création AccountDeletionRequest
   - Status: PENDING
   - scheduledFor: +7 jours ouvrés
   ↓
5. Emails envoyés :
   - Admin : Notification avec détails
   - User : Confirmation avec lien annulation
   ↓
6. Bannière rouge s'affiche sur tout le site
   ↓
7a. Si annulation avant 7 jours :
    - Status → CANCELLED
    - Emails de confirmation
    - Bannière disparaît
    
7b. Si aucune annulation après 7 jours :
    - Admin supprime manuellement
    - Status → COMPLETED
```

## 🎨 Design de la Bannière

- **Couleur** : Rouge (#dc2626) pour l'urgence
- **Position** : Fixe en haut (ne scroll pas)
- **Animation** : Icône animée, barre de progression
- **Responsive** : S'adapte mobile/desktop
- **Z-index** : 9999 (au-dessus de tout)

## 🐛 Débogage

### Les emails ne s'envoient pas

1. **Vérifier les logs** :
   ```bash
   # Dans la console Next.js, vous verrez :
   📧 Tentative d'envoi des emails...
   ✅ Email admin envoyé: { id: '...' }
   ✅ Email utilisateur envoyé: { id: '...' }
   
   # Ou en cas d'erreur :
   ❌ Erreur envoi email: [détails]
   ```

2. **Vérifier Resend** :
   - Dashboard : [resend.com/emails](https://resend.com/emails)
   - Voir le statut des envois
   - Logs détaillés

3. **Email de test** :
   - `onboarding@resend.dev` fonctionne pour les tests
   - Pour production, configurer un domaine

### La bannière ne s'affiche pas

1. **Vérifier la demande** :
   ```bash
   # Tester l'API directement
   curl http://localhost:3000/api/account/deletion-status
   ```

2. **Vérifier la base de données** :
   ```bash
   npx prisma studio
   # Aller dans AccountDeletionRequest
   # Vérifier status = PENDING
   ```

## 🔒 Sécurité

- ✅ Authentification requise pour toutes les API
- ✅ Vérification userId / stackId
- ✅ Cascade delete dans Prisma
- ✅ Status tracking dans la DB
- ✅ Emails de confirmation

## 📝 TODO (Automatisation Future)

Pour automatiser complètement la suppression après 7 jours :

1. **Créer un Cron Job** :
   - Route : `/api/cron/process-deletions`
   - Vérifier les demandes où `scheduledFor < now()`
   - Supprimer automatiquement

2. **Configurer Vercel Cron** :
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/process-deletions",
       "schedule": "0 0 * * *"
     }]
   }
   ```

3. **Implémenter la suppression réelle** :
   - Supprimer l'utilisateur de Prisma
   - Supprimer de Stack Auth
   - Supprimer les fichiers uploadés
   - Marquer status = COMPLETED

---

**Développé pour Guidiqo** - Système de suppression de compte conforme et sécurisé 🎨

