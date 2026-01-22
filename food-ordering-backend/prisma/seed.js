// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👥 Creating users...');
  
  const nickFury = await prisma.user.create({
    data: {
      email: 'nick.fury@avengers.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Nick Fury',
      role: 'ADMIN',
      country: 'AMERICA',
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      email: 'captain.marvel@avengers.com',
      password: await bcrypt.hash('manager123', 10),
      name: 'Captain Marvel',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      email: 'captain.america@avengers.com',
      password: await bcrypt.hash('manager123', 10),
      name: 'Captain America',
      role: 'MANAGER',
      country: 'AMERICA',
    },
  });

  const thanos = await prisma.user.create({
    data: {
      email: 'thanos@avengers.com',
      password: await bcrypt.hash('member123', 10),
      name: 'Thanos',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const thor = await prisma.user.create({
    data: {
      email: 'thor@avengers.com',
      password: await bcrypt.hash('member123', 10),
      name: 'Thor',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const travis = await prisma.user.create({
    data: {
      email: 'travis@avengers.com',
      password: await bcrypt.hash('member123', 10),
      name: 'Travis',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  // Create Payment Methods
  console.log('💳 Creating payment methods...');
  
  await prisma.paymentMethod.create({
    data: {
      userId: nickFury.id,
      cardNumber: '4532',
      cardHolderName: 'Nick Fury',
      expiryDate: '12/25',
      cvv: 'encrypted_123',
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: captainMarvel.id,
      cardNumber: '5678',
      cardHolderName: 'Captain Marvel',
      expiryDate: '06/26',
      cvv: 'encrypted_456',
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: captainAmerica.id,
      cardNumber: '9012',
      cardHolderName: 'Captain America',
      expiryDate: '03/27',
      cvv: 'encrypted_789',
    },
  });

  // Create Restaurants - INDIA
  console.log('🏪 Creating restaurants...');
  
  const tajKitchen = await prisma.restaurant.create({
    data: {
      name: 'Taj Kitchen',
      description: 'Authentic Indian Cuisine',
      country: 'INDIA',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    },
  });

  const spiceRoute = await prisma.restaurant.create({
    data: {
      name: 'Spice Route',
      description: 'Traditional Indian Flavors',
      country: 'INDIA',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    },
  });

  // Create Restaurants - AMERICA
  const americanDiner = await prisma.restaurant.create({
    data: {
      name: 'American Diner',
      description: 'Classic American Food',
      country: 'AMERICA',
      imageUrl: 'https://images.unsplash.com/photo-1554998171-706f21bd9b0b',
    },
  });

  const burgerHouse = await prisma.restaurant.create({
    data: {
      name: 'Burger House',
      description: 'Premium Burgers & Fries',
      country: 'AMERICA',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    },
  });

  // Create Menu Items - Taj Kitchen (INDIA)
  console.log('🍽️  Creating menu items...');
  
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: tajKitchen.id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken',
        price: 15.99,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
      },
      {
        restaurantId: tajKitchen.id,
        name: 'Biryani',
        description: 'Fragrant rice with spiced meat',
        price: 12.99,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
      },
      {
        restaurantId: tajKitchen.id,
        name: 'Naan',
        description: 'Soft Indian flatbread',
        price: 2.99,
        category: 'Bread',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
      },
      {
        restaurantId: tajKitchen.id,
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 10.99,
        category: 'Appetizer',
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
      },
    ],
  });

  // Create Menu Items - Spice Route (INDIA)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: spiceRoute.id,
        name: 'Dal Makhani',
        description: 'Black lentils in creamy sauce',
        price: 9.99,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
      },
      {
        restaurantId: spiceRoute.id,
        name: 'Samosa',
        description: 'Crispy pastry with spiced filling',
        price: 4.99,
        category: 'Appetizer',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
      },
      {
        restaurantId: spiceRoute.id,
        name: 'Masala Chai',
        description: 'Spiced Indian tea',
        price: 2.99,
        category: 'Beverage',
        imageUrl: 'https://images.unsplash.com/photo-1597318112337-91346e0d215b',
      },
    ],
  });

  // Create Menu Items - American Diner (AMERICA)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: americanDiner.id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        price: 10.99,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      },
      {
        restaurantId: americanDiner.id,
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 4.99,
        category: 'Sides',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f',
      },
      {
        restaurantId: americanDiner.id,
        name: 'Chocolate Milkshake',
        description: 'Rich and creamy milkshake',
        price: 5.99,
        category: 'Beverage',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
      },
      {
        restaurantId: americanDiner.id,
        name: 'Caesar Salad',
        description: 'Fresh romaine with parmesan',
        price: 8.99,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
      },
    ],
  });

  // Create Menu Items - Burger House (AMERICA)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: burgerHouse.id,
        name: 'BBQ Bacon Burger',
        description: 'Smoky BBQ sauce with crispy bacon',
        price: 13.99,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
      },
      {
        restaurantId: burgerHouse.id,
        name: 'Onion Rings',
        description: 'Crispy battered onion rings',
        price: 5.99,
        category: 'Sides',
        imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d',
      },
      {
        restaurantId: burgerHouse.id,
        name: 'Vanilla Shake',
        description: 'Classic vanilla milkshake',
        price: 5.99,
        category: 'Beverage',
        imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Test User Credentials:');
  console.log('==========================');
  console.log('Admin (America):');
  console.log('  Email: nick.fury@avengers.com');
  console.log('  Password: admin123');
  console.log('\nManager (India):');
  console.log('  Email: captain.marvel@avengers.com');
  console.log('  Password: manager123');
  console.log('\nManager (America):');
  console.log('  Email: captain.america@avengers.com');
  console.log('  Password: manager123');
  console.log('\nMember (India):');
  console.log('  Email: thanos@avengers.com');
  console.log('  Password: member123');
  console.log('\nMember (India):');
  console.log('  Email: thor@avengers.com');
  console.log('  Password: member123');
  console.log('\nMember (America):');
  console.log('  Email: travis@avengers.com');
  console.log('  Password: member123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });