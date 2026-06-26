import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';

export const createTransaction = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either IN or OUT' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update product quantity
    if (type === 'IN') {
      product.quantity += quantity;
    } else {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.quantity -= quantity;
    }

    await product.save();

    // Create transaction
    const transaction = await Transaction.create({
      productId,
      type,
      quantity,
      reason,
      createdBy: req.userId
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ createdBy: req.userId })
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      productId: req.params.productId,
      createdBy: req.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const transactions = await Transaction.find({ createdBy: req.userId })
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
