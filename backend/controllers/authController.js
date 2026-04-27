import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, tenantId: user.tenantId || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email, tenantId: req.tenantId });
    if (userExists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'customer', tenantId: req.tenantId });
    res.status(201).json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, tenantId: req.tenantId }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};