import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ApiKey from '../models/ApiKey.js';
import { authenticateToken, generateToken, requireAuth } from '../auth/middleware.js';
import crypto from 'crypto';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, username: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Generate API key
router.post('/api-keys', authenticateToken, async (req, res) => {
  try {
    const { name, permissions = ['read'], expiresAt } = req.body;

    // Validate permissions based on user role
    const allowedPermissions = ['read'];
    if (req.user.role === 'admin') {
      allowedPermissions.push('write', 'admin');
    } else if (req.user.role === 'user') {
      allowedPermissions.push('write');
    }

    const invalidPermissions = permissions.filter((p) => !allowedPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return res.status(403).json({
        error: `Insufficient permissions. You cannot create API keys with: ${invalidPermissions.join(', ')}`,
      });
    }

    const key = crypto.randomBytes(32).toString('hex');
    const apiKey = new ApiKey({
      key,
      user: req.user._id,
      name,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    await apiKey.save();
    res
      .status(201)
      .json({ apiKey: { id: apiKey._id, key, name, permissions, isActive: apiKey.isActive } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// List API keys (only active ones)
router.get('/api-keys', authenticateToken, async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({ user: req.user._id, isActive: true }).select('-key');
    res.json({ apiKeys });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Get specific API key (with key value) - only active keys
router.get('/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ _id: req.params.id, user: req.user._id, isActive: true });
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ apiKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
});

// Revoke API key
router.delete('/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ _id: req.params.id, user: req.user._id });
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    apiKey.isActive = false;
    await apiKey.save();
    res.json({ message: 'API key revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

export default router;
