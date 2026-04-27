import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tenant from '../models/Tenant.js';

dotenv.config();

const tenants = [
  {
    slug: 'nike',
    name: 'Nike Store',
    theme: { primaryColor: '#111111', secondaryColor: '#111111' },
    plan: 'pro',
    limits: { maxProducts: 100, maxUsers: 10 },
  },
  {
    slug: 'adidas',
    name: 'Adidas Store',
    theme: { primaryColor: '#4f46e5', secondaryColor: '#1e1b4b' },
    plan: 'starter',
    limits: { maxProducts: 30, maxUsers: 5 },
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Tenant.deleteMany({});
  await Tenant.insertMany(tenants);
  console.log('✅ Tenants created!');
  process.exit(0);
};

run();