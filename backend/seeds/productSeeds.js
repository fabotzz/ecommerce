const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Basic T-Shirt',
    price: 49.90,
    description: '100% cotton t-shirt, comfortable and durable',
    category: 'Clothing',
    image: 'https://via.placeholder.com/300?text=T-Shirt'
  },
  {
    name: 'Jeans Pants',
    price: 129.90,
    description: 'Light blue straight cut jeans',
    category: 'Clothing',
    image: 'https://via.placeholder.com/300?text=Jeans'
  },
  {
    name: 'Sports Sneakers',
    price: 199.90,
    description: 'Running shoes with advanced cushioning',
    category: 'Footwear',
    image: 'https://via.placeholder.com/300?text=Sneakers'
  },
  {
    name: 'XYZ Smartphone',
    price: 1299.90,
    description: 'Smartphone with 48MP camera and 128GB storage',
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Smartphone'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();