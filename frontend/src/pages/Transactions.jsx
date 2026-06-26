import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card, Button, Input, Select, Loading, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { Navbar, Sidebar } from '../components/Layout';
import { transactionAPI, productAPI } from '../services/api';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'OUT',
    quantity: 1,
    reason: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, prodRes] = await Promise.all([
        transactionAPI.getTransactionHistory(),
        productAPI.getAllProducts()
      ]);
      setTransactions(transRes.data.transactions);
      setProducts(prodRes.data.products);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await transactionAPI.createTransaction(formData);
      setShowModal(false);
      setFormData({ productId: '', type: 'OUT', quantity: 1, reason: '' });
      setErrors({});
      fetchData();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to create transaction' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/transactions" />
      
      <main className="flex-1 lg:ml-64 pt-16 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Transactions</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your stock movements</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
              <Plus size={20} />
              <span>New Transaction</span>
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((tx) => (
                      <motion.tr
                        key={tx._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                          {tx.productId?.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={tx.type === 'IN' ? 'success' : 'danger'}>
                            {tx.type === 'IN' ? 'Stock In' : 'Stock Out'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{tx.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{tx.reason}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
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
        onClose={() => setShowModal(false)}
        title="New Transaction"
      >
        <div className="space-y-4">
          <Select
            label="Product"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            error={errors.productId}
            options={[
              { value: '', label: 'Select a product' },
              ...products.map(p => ({ value: p._id, label: `${p.name} (${p.quantity} in stock)` }))
            ]}
          />

          <Select
            label="Transaction Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            options={[
              { value: 'IN', label: 'Stock In' },
              { value: 'OUT', label: 'Stock Out' }
            ]}
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            error={errors.quantity}
            min="1"
          />

          <Input
            label="Reason (Optional)"
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="e.g., Restock, Damaged, Return"
          />

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Create
            </Button>
            <Button onClick={() => setShowModal(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
