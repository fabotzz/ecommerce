import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Tenant from '../models/Tenant.js';

dotenv.config();

const products = [
  { name: 'Basic T-Shirt', price: 49.90, description: '100% cotton t-shirt', category: 'Clothing', image: 'https://via.placeholder.com/300?text=T-Shirt' },
  { name: 'Jeans Pants', price: 129.90, description: 'Light blue straight cut jeans', category: 'Clothing', image: 'https://via.placeholder.com/300?text=Jeans' },
  { name: 'Sports Sneakers', price: 199.90, description: 'Running shoes with advanced cushioning', category: 'Footwear', image: 'https://via.placeholder.com/300?text=Sneakers' },
  { name: 'XYZ Smartphone', price: 1299.90, description: 'Smartphone with 48MP camera', category: 'Electronics', image: 'https://via.placeholder.com/300?text=Smartphone' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const nike = await Tenant.findOne({ slug: 'nike' });
    if (!nike) { console.error('❌ Rode o tenantSeed.js primeiro!'); process.exit(1); }
    await Product.deleteMany({ tenantId: nike._id });
    await Product.insertMany(products.map(p => ({ ...p, tenantId: nike._id })));
    console.log('✅ Products created!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();