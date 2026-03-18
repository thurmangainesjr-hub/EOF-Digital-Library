import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create genres
  const genres = await Promise.all([
    prisma.genre.create({
      data: { name: 'Fiction', slug: 'fiction', description: 'Fictional literature' }
    }),
    prisma.genre.create({
      data: { name: 'Science Fiction', slug: 'science-fiction', description: 'Science fiction and speculative fiction' }
    }),
    prisma.genre.create({
      data: { name: 'Fantasy', slug: 'fantasy', description: 'Fantasy literature' }
    }),
    prisma.genre.create({
      data: { name: 'Mystery', slug: 'mystery', description: 'Mystery and detective fiction' }
    }),
    prisma.genre.create({
      data: { name: 'Romance', slug: 'romance', description: 'Romantic fiction' }
    }),
    prisma.genre.create({
      data: { name: 'Horror', slug: 'horror', description: 'Horror fiction' }
    }),
    prisma.genre.create({
      data: { name: 'Non-Fiction', slug: 'non-fiction', description: 'Non-fiction works' }
    }),
    prisma.genre.create({
      data: { name: 'Classic', slug: 'classic', description: 'Classic literature' }
    })
  ]);

  console.log(`Created ${genres.length} genres`);

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@eof.library',
      passwordHash,
      displayName: 'Demo User',
      role: 'READER',
      emailVerified: true,
      membership: {
        create: {
          tier: 'MEMBER',
          status: 'ACTIVE'
        }
      }
    }
  });
  console.log('Created demo user: demo@eof.library / password123');

  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@eof.library',
      passwordHash: adminHash,
      displayName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
      membership: {
        create: {
          tier: 'CREATOR',
          status: 'ACTIVE'
        }
      }
    }
  });
  console.log('Created admin user: admin@eof.library / admin123');

  // Create creator profile for admin
  const creatorProfile = await prisma.creatorProfile.create({
    data: {
      userId: adminUser.id,
      displayName: 'EOF Publishing',
      bio: 'Official EOF Digital Library publisher',
      verified: true,
      verifiedAt: new Date()
    }
  });

  // Create sample products (public domain classics)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        slug: 'pride-and-prejudice',
        description: 'A romantic novel following the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between the superficial and the essential.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '1342',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[4].id },
            { genreId: genres[7].id }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'Frankenstein',
        author: 'Mary Shelley',
        slug: 'frankenstein',
        description: 'The story of Victor Frankenstein, a young scientist who creates a grotesque creature in an unorthodox scientific experiment, leading to tragic consequences.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '84',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[5].id },
            { genreId: genres[7].id }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'Dracula',
        author: 'Bram Stoker',
        slug: 'dracula',
        description: 'The classic vampire tale that follows Jonathan Harker as he travels to Transylvania and encounters the mysterious Count Dracula.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '345',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[5].id },
            { genreId: genres[7].id }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'The Time Machine',
        author: 'H.G. Wells',
        slug: 'the-time-machine',
        description: 'A scientist invents a time machine and travels to the year 802,701 AD, where humanity has evolved into two distinct species.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '35',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[1].id },
            { genreId: genres[7].id }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        slug: 'adventures-of-sherlock-holmes',
        description: 'A collection of twelve short stories featuring the famous detective Sherlock Holmes and his companion Dr. Watson.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '1661',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[3].id },
            { genreId: genres[7].id }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        creatorId: creatorProfile.id,
        title: 'A Tale of Two Cities',
        author: 'Charles Dickens',
        slug: 'tale-of-two-cities',
        description: 'A historical novel set in London and Paris before and during the French Revolution, depicting the plight of the French peasantry.',
        price: 0,
        isFree: true,
        type: 'EBOOK',
        source: 'GUTENBERG',
        gutenbergId: '98',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        adaptationAllowed: true,
        genres: {
          create: [
            { genreId: genres[0].id },
            { genreId: genres[7].id }
          ]
        }
      }
    })
  ]);

  console.log(`Created ${products.length} sample products`);

  // Create a default bookshelf for demo user
  await prisma.bookshelf.create({
    data: {
      userId: demoUser.id,
      name: 'My Books',
      isDefault: true,
      items: {
        create: [
          { productId: products[0].id, sortOrder: 0 },
          { productId: products[1].id, sortOrder: 1 }
        ]
      }
    }
  });
  console.log('Created default bookshelf for demo user');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
