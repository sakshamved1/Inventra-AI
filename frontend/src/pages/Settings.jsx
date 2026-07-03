import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/UI';
import { Navbar, Sidebar } from '../components/Layout';

export const Settings = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/settings" />
      
      <main className="flex-1 p-4 md:ml-72 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Manage your account and preferences</p>
          </div>

          {/* Account Settings */}
          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Configuration</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your Gemini API key for AI Assistant features. Keep your API key secure and never share it publicly.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 To get your API key, visit <a href="https://makersuite.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">Google AI Studio</a>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
                    <p className="font-semibold text-gray-900 dark:text-white">MongoDB</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Collections</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Users, Products, Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inventra AI </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  A modern, production-ready inventory management system built with MERN stack and AI-powered insights.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Version</h3>
                <p className="text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technology Stack</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frontend</p>
                    <ul className="text-sm text-gray-900 dark:text-gray-300 space-y-1">
                      <li>• React 18</li>
                      <li>• Vite</li>
                      <li>• Tailwind CSS</li>
                      <li>• Framer Motion</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Backend</p>
                    <ul className="text-sm text-gray-900 dark:text-gray-300 space-y-1">
                      <li>• Node.js</li>
                      <li>• Express.js</li>
                      <li>• MongoDB</li>
                      <li>• Gemini API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
