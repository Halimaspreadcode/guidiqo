# Instructions de configuration

## 1. Installer les dépendances
```bash
npm install
```

## 2. Configurer la base de données
```bash
# Créer le fichier .env.local avec les variables d'environnement fournies
# Puis exécuter les migrations Prisma
npx prisma generate
npx prisma db push
```

## 3. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000
