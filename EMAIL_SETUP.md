# Configuration des Emails pour Stack Auth

## 📧 Configuration de l'envoi d'emails

Stack Auth nécessite une configuration d'email pour envoyer les liens de réinitialisation de mot de passe.

### Option 1 : Configuration dans Stack Auth Dashboard (Recommandé)

1. **Accéder au Dashboard Stack Auth**
   - Allez sur [https://stack-auth.com](https://stack-auth.com)
   - Connectez-vous à votre projet

2. **Configurer l'Email Provider**
   - Allez dans **Settings** > **Email**
   - Choisissez un provider :
     - **Stack Auth Mail** (gratuit, par défaut)
     - **Resend** (recommandé pour production)
     - **SendGrid**
     - **AWS SES**
     - **Custom SMTP**

3. **Pour Resend (Recommandé)**
   ```bash
   # Créer un compte sur resend.com
   # Obtenir votre API Key
   # Dans Stack Auth Dashboard :
   - Provider: Resend
   - API Key: re_xxxxxxxxxxxx
   - From Email: noreply@votredomaine.com
   - From Name: Guidiqo
   ```

4. **Configurer les Templates d'Email**
   - Password Reset Email
   - Welcome Email
   - Verification Email

### Option 2 : Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Stack Auth Email Configuration
STACK_PROJECT_ID=your_project_id
STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Resend (si vous utilisez Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Vérification

Pour vérifier que l'email fonctionne :

1. Allez sur `/auth/forgot-password`
2. Entrez votre email
3. Vérifiez votre boîte de réception (et spam)
4. Cliquez sur le lien de réinitialisation

### Problèmes Courants

#### L'email n'arrive pas

1. **Vérifier le Dashboard Stack Auth**
   - Logs > Email Logs
   - Vérifier le statut d'envoi

2. **Vérifier les Spams**
   - L'email peut être dans les spams
   - Ajouter noreply@votre-domaine.com aux contacts

3. **Provider non configuré**
   - Stack Auth utilise un provider par défaut
   - Pour production, configurer Resend ou SendGrid

4. **Domain non vérifié**
   - Si vous utilisez Resend/SendGrid
   - Vérifier le domaine d'envoi

#### Emails en développement

En développement, Stack Auth utilise son propre service d'email qui peut avoir des limitations :
- Délai d'envoi plus long
- Peut finir dans les spams
- Rate limiting

### Configuration de Production

Pour la production, il est **fortement recommandé** de :

1. **Configurer un domaine personnalisé**
   ```
   from: noreply@guidiqo.com
   ```

2. **Utiliser Resend (le plus simple)**
   - Prix: Gratuit jusqu'à 3000 emails/mois
   - Configuration en 5 minutes
   - Excellent deliverability

3. **Configurer SPF, DKIM, DMARC**
   - Pour éviter les spams
   - Améliore le taux de délivrabilité

### Customiser les Templates d'Email

Dans le Dashboard Stack Auth :

1. **Aller dans Templates**
2. **Sélectionner "Password Reset"**
3. **Personnaliser** :
   ```html
   <h1>Réinitialiser votre mot de passe</h1>
   <p>Bonjour,</p>
   <p>Vous avez demandé à réinitialiser votre mot de passe sur Guidiqo.</p>
   <a href="{{resetLink}}">Réinitialiser mon mot de passe</a>
   ```

### Support

Si vous rencontrez toujours des problèmes :
1. Vérifier les logs Stack Auth Dashboard
2. Contacter le support Stack Auth
3. Vérifier la documentation : https://docs.stack-auth.com

---

**Note** : En mode développement, les emails peuvent mettre quelques minutes à arriver. C'est normal.

