import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Package } from 'lucide-react';
import { Card, Badge, Loading } from '../components/UI';
import { Navbar, Sidebar } from '../components/Layout';
import { productAPI } from '../services/api';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, lowRes, sumRes] = await Promise.all([
          productAPI.getAllProducts(),
          productAPI.getLowStockProducts(),
          productAPI.getInventorySummary()
        ]);

        setProducts(allRes.data.products);
        setStats({
          total: sumRes.data.summary.totalProducts,
          value: sumRes.data.summary.totalInventoryValue,
          lowStock: lowRes.data.products
        });
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/inventory" />
      
      <main className="flex-1 p-4 md:ml-72 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">Inventory Status</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Complete inventory overview and analytics</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.total}</p>
                </div>
                <Package className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Inventory Value</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{(stats?.value || 0).toFixed(0)}</p>
                </div>
                <TrendingDown className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Low Stock Items</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.lowStock?.length || 0}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </Card>
          </div>

          {/* Low Stock Products */}
          {stats?.lowStock?.length > 0 && (
            <Card className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">⚠️ Low Stock Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.lowStock.map(product => (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -2 }}
                    className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      <Badge variant="warning">{product.sku}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Current Stock</p>
                        <p className="font-bold text-gray-900 dark:text-white">{product.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Minimum</p>
                        <p className="font-bold text-orange-600">{product.minStock}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* All Products */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Min Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.minStock}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        ₹{(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          product.quantity === 0 ? 'danger' :
                          product.quantity <= product.minStock ? 'warning' :
                          product.quantity > product.minStock * 2 ? 'success' :
                          'default'
                        }>
                          {product.quantity === 0 ? 'Out' :
                           product.quantity <= product.minStock ? 'Low' :
                           product.quantity > product.minStock * 2 ? 'High' :
                           'Normal'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
