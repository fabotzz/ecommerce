import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import resolveTenant from './middleware/tenant.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/superadmin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = (await import('./models/User.js')).default;
    const jwt = (await import('jsonwebtoken')).default;
    const user = await User.findOne({ email, role: 'super_admin' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, tenantId: null },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/superadmin/tenants', async (req, res) => {
  try {
    const Tenant = (await import('./models/Tenant.js')).default;
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api', resolveTenant);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));