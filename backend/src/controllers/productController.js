import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { createdBy: req.userId };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, quantity, price, minStock, description } = req.body;

    if (!name || !sku || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if SKU already exists for this user
    const existingSKU = await Product.findOne({ sku, createdBy: req.userId });
    if (existingSKU) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      category,
      quantity: quantity || 0,
      price,
      minStock: minStock || 10,
      description,
      createdBy: req.userId
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.userId,
      $expr: { $lte: ['$quantity', '$minStock'] }
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.userId });
    
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalInventoryValue,
        lowStockCount,
        totalQuantity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
