const { PrismaClient } = require('@prisma/client')

async function checkDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Vérification de la base de données...\n')
    
    // Compter les utilisateurs
    const userCount = await prisma.user.count()
    console.log(`👥 Nombre d'utilisateurs: ${userCount}`)
    
    // Compter les brands
    const brandCount = await prisma.brand.count()
    console.log(`🎨 Nombre de brands: ${brandCount}`)
    
    // Compter les demandes de suppression
    const deletionCount = await prisma.accountDeletionRequest.count()
    console.log(`🗑️  Demandes de suppression: ${deletionCount}`)
    
    if (brandCount > 0) {
      console.log('\n📋 Détails des brands:')
      const brands = await prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
          isCompleted: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      brands.forEach((brand, index) => {
        console.log(`${index + 1}. ${brand.name} (${brand.isCompleted ? 'Complété' : 'En cours'}) - ${brand.createdAt.toLocaleDateString('fr-FR')}`)
      })
    }
    
    if (userCount > 0) {
      console.log('\n👤 Détails des utilisateurs:')
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: { brands: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.name || 'Sans nom'}) - ${user._count.brands} brands - ${user.createdAt.toLocaleDateString('fr-FR')}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

