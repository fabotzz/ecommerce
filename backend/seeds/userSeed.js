import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const nike = await Tenant.findOne({ slug: 'nike' });
  const adidas = await Tenant.findOne({ slug: 'adidas' });

  await User.deleteMany({});

  await User.create([
    { name: 'Super Admin', email: 'super@admin.com', password: '123456', role: 'super_admin' },
    { name: 'Nike Admin', email: 'admin@nike.com', password: '123456', role: 'tenant_admin', tenantId: nike._id },
    { name: 'Nike Seller', email: 'seller@nike.com', password: '123456', role: 'seller', tenantId: nike._id },
    { name: 'Nike Customer', email: 'customer@nike.com', password: '123456', role: 'customer', tenantId: nike._id },
    { name: 'Adidas Admin', email: 'admin@adidas.com', password: '123456', role: 'tenant_admin', tenantId: adidas._id },
    { name: 'Adidas Seller', email: 'seller@adidas.com', password: '123456', role: 'seller', tenantId: adidas._id },
    { name: 'Adidas Customer', email: 'customer@adidas.com', password: '123456', role: 'customer', tenantId: adidas._id },
  ]);

  console.log('✅ Users created!');
  process.exit(0);
};

run();