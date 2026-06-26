import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Lock, Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Navbar, Sidebar } from '../components/Layout';
import { Card, Button, Loading } from '../components/UI';
import api from '../services/api';
import useAuthStore from '../context/authStore';

const permissionLabels = {
  view: 'View',
  add: 'Add',
  edit: 'Edit',
  delete: 'Delete'
};

export const AdminPanel = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePermission = async (targetUser, permissionKey) => {
    const nextValue = !targetUser.permissions?.[permissionKey];
    try {
      await api.put(`/auth/users/${targetUser._id}/permissions`, {
        ...targetUser.permissions,
        [permissionKey]: nextValue
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update permission', error);
    }
  };

  const approveUser = async (targetUser) => {
    try {
      await api.put(`/auth/users/${targetUser._id}/approve`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to approve user', error);
    }
  };

  if (loading) return <Loading />;

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md text-center">
          <Shield className="mx-auto mb-3 text-red-500" size={40} />
          <h2 className="text-2xl font-semibold">Access denied</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Only admins can access this panel.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/settings" />
      <main className="flex-1 lg:ml-64 pt-16 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Approve new users and manage their permissions.</p>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Permissions</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((entry) => (
                    <tr key={entry._id}>
                      <td className="px-4 py-3 font-medium">{entry.name}</td>
                      <td className="px-4 py-3">{entry.email}</td>
                      <td className="px-4 py-3">
                        {entry.isApproved ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">Approved</span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(permissionLabels).map(([key, label]) => (
                            <button
                              key={key}
                              onClick={() => togglePermission(entry, key)}
                              className={`rounded-full px-2.5 py-1 text-xs ${entry.permissions?.[key] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {!entry.isApproved && (
                          <Button onClick={() => approveUser(entry)} className="flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            Approve
                          </Button>
                        )}
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
