-- Migration manuelle pour ajouter le champ coverImage à la table Brand
-- À exécuter quand la connexion à la base de données sera disponible

ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;

-- Commentaire : Ce champ stockera l'URL de l'image de couverture sélectionnée à l'étape 4 de l'onboarding

