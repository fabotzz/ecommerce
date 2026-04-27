import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#1e1b4b' },
    logoUrl: { type: String, default: '' },
  },
  plan: { type: String, enum: ['free', 'starter', 'pro'], default: 'free' },
  limits: {
    maxProducts: { type: Number, default: 10 },
    maxUsers: { type: Number, default: 2 },
  },
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);