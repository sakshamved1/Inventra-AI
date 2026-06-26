import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Please provide an SKU'],
    unique: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Electronics', 'Clothing', 'Food', 'Beverages', 'Books', 'Home', 'Sports', 'Other'],
    default: 'Other'
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide a quantity'],
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  minStock: {
    type: Number,
    required: [true, 'Please provide minimum stock threshold'],
    default: 10,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update updatedAt before saving
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Product', productSchema);
