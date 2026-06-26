import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Card, Button, Input, Select, Loading, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { Navbar, Sidebar } from '../components/Layout';
import { productAPI } from '../services/api';
import useAuthStore from '../context/authStore';

export const Products = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Other',
    quantity: 0,
    price: 0,
    minStock: 10,
    description: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Food', label: 'Food' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Books', label: 'Books' },
    { value: 'Home', label: 'Home' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    setFilteredProducts(filtered);
  }, [products, search, category]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'price' || name === 'minStock' ? parseInt(value) : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.price) newErrors.price = 'Price is required';
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await productAPI.updateProduct(editingId, formData);
      } else {
        await productAPI.createProduct(formData);
      }
      setShowModal(false);
      setFormData({ name: '', sku: '', category: 'Other', quantity: 0, price: 0, minStock: 10, description: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ name: '', sku: '', category: 'Other', quantity: 0, price: 0, minStock: 10, description: '' });
    setEditingId(null);
    setShowModal(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/products" />
      
      <main className="flex-1 lg:ml-64 pt-16 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
            </div>
            {(user?.role === 'admin' || user?.permissions?.add) && (
              <Button onClick={handleAddNew} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Product</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Products Table */}
          <Card>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                        <td className="px-4 py-3"><Badge>{product.category}</Badge></td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 flex space-x-2">
                          {(user?.role === 'admin' || user?.permissions?.edit) && (
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          {(user?.role === 'admin' || user?.permissions?.delete) && (
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Product' : 'Add Product'}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <Input
            label="Product Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />

          <Input
            label="SKU"
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            error={errors.sku}
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categories}
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />

          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
          />

          <Input
            label="Minimum Stock"
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleInputChange}
          />

          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleCloseModal} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
