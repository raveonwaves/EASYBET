import { prisma } from './lib/prisma.js';

async function main() {
  await prisma.content.upsert({
    where: { assetKey: 'demo/video-1.mp4' },
    update: {},
    create: {
      title: 'Welcome Video',
      description: 'Intro to the premium experience.',
      priceCredits: 100,
      assetKey: 'demo/video-1.mp4',
      storagePath: 'r2://demo/video-1.mp4'
    }
  });
  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

