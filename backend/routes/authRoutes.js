import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import Tenant from '../models/Tenant.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.get('/tenant/config', async (req, res) => {
  try {
    res.json({ name: req.tenant.name, theme: req.tenant.theme, plan: req.tenant.plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;