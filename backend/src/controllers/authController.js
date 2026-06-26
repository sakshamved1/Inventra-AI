import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { DEFAULT_PERMISSIONS, buildPermissionState } from '../utils/permissions.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create pending user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isApproved: false,
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Your account is pending admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    user.permissions = { ...DEFAULT_PERMISSIONS, ...(user.permissions || {}) };
    await user.save();

    res.status(200).json({ success: true, message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { view, add, edit, delete: deletePermission } = req.body;
    user.permissions = buildPermissionState({ view, add, edit, delete: deletePermission });
    user.isApproved = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Permissions updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
