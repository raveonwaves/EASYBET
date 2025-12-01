import { prisma } from './lib/prisma.js';

async function main() {
  const existing = await prisma.content.findFirst({
    where: { assetKey: 'demo/video-1.mp4' }
  });
  if (!existing) {
    await prisma.content.create({
      data: {
        title: 'Welcome Video',
        description: 'Intro to the premium experience.',
        priceCredits: 100,
        assetKey: 'demo/video-1.mp4',
        storagePath: 'r2://demo/video-1.mp4'
      }
    });
  }
  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

