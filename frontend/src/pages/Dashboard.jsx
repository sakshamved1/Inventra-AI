import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Package, ShieldCheck, ArrowUpRight, IndianRupee, Sparkles } from 'lucide-react';
import { Card, Loading, Badge } from '../components/UI';
import { Navbar, Sidebar } from '../components/Layout';
import { productAPI, transactionAPI, aiAPI } from '../services/api';

const KPICard = ({ icon: Icon, title, value, trend, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${color} rounded-xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-sm bg-white bg-opacity-20 px-2 py-1 rounded-lg">
            <TrendingUp size={16} />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-white text-opacity-80 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transRes, healthRes] = await Promise.all([
          productAPI.getInventorySummary(),
          transactionAPI.getRecentTransactions(5),
          aiAPI.getHealthScore()
        ]);

        setSummary(summaryRes.data.summary);
        setTransactions(transRes.data.transactions);
        setHealthScore(healthRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  const chartData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/dashboard" />
      
      <main className="flex-1 p-4 md:ml-72 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6 dark:border-gray-700/80 dark:bg-gray-800/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
                  <Sparkles size={16} />
                  Inventory Intelligence
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Welcome back! Here’s a refined overview of stock health, value, and movement.</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-white shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck size={16} />
                  AI health is {healthScore?.status || 'stable'}
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              icon={Package}
              title="Total Products"
              value={summary?.totalProducts || 0}
              color="bg-gradient-to-br from-blue-600 to-blue-400"
            />
            <KPICard
              icon={IndianRupee }
              title="Inventory Value"
              value={`₹${(summary?.totalInventoryValue || 0).toFixed(0)}`}
              color="bg-gradient-to-br from-green-600 to-green-400"
            />
            <KPICard
              icon={AlertCircle}
              title="Low Stock Items"
              value={summary?.lowStockCount || 0}
              color="bg-gradient-to-br from-orange-600 to-orange-400"
            />
            <KPICard
              icon={TrendingUp}
              title="Health Score"
              value={healthScore?.healthScore || 0}
              trend="Good"
              color={`bg-gradient-to-br ${healthScore?.healthScore >= 80 ? 'from-green-600 to-green-400' : 'from-yellow-600 to-yellow-400'}`}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 border-0 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Trend</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Projected movement across the week</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} />
                  +12.4%
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-0 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Health Status</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke={healthScore?.healthScore >= 80 ? '#10b981' : '#f59e0b'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(healthScore?.healthScore || 0) * 3.77} 377`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{healthScore?.healthScore}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                </div>
                <Badge variant={healthScore?.healthScore >= 80 ? 'success' : 'warning'}>
                  {healthScore?.status}
                </Badge>
                <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  Stock balance is {healthScore?.healthScore >= 80 ? 'healthy' : 'needs attention'}.
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latest stock movement activity</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
                Live updates
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{tx.productId?.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant={tx.type === 'IN' ? 'success' : 'danger'}>
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{tx.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
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
