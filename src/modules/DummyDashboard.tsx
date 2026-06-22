import React from 'react';
import { TrendingUp, Users, Home, DollarSign, Calendar, MapPin, Star, ArrowRight } from 'lucide-react';

export const DummyDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Hero Section */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome to Rentilo</h1>
              <p className="text-lg text-slate-600">Manage your properties efficiently</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                Premium Plan
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +12% from last month
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Home size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Tenants</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +8% occupancy rate
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">$45.2K</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +5% growth
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
                <p className="text-orange-600 text-sm mt-1">3 urgent tasks</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Calendar size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Featured Properties</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All <ArrowRight size={18} className="ml-2" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=500"
                alt="Modern Apartment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Modern Apartment</h3>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  <Star size={14} className="mr-1" fill="currentColor" />
                  4.8
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-3 flex items-center">
                <MapPin size={16} className="mr-2" /> Downtown District
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-slate-900">$2,500/mo</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500"
                alt="Luxury Villa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Luxury Villa</h3>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  <Star size={14} className="mr-1" fill="currentColor" />
                  5.0
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-3 flex items-center">
                <MapPin size={16} className="mr-2" /> Hillside Avenue
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-slate-900">$5,200/mo</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Property Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=500"
                alt="Studio Loft"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Studio Loft</h3>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  <Star size={14} className="mr-1" fill="currentColor" />
                  4.6
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-3 flex items-center">
                <MapPin size={16} className="mr-2" /> Arts District
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-slate-900">$1,800/mo</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="max-w-7xl mx-auto px-6 py-8 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Property</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tenant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Activity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">Downtown Apartment</td>
                <td className="px-6 py-4 text-sm text-slate-600">John Smith</td>
                <td className="px-6 py-4 text-sm text-slate-600">Rent Payment</td>
                <td className="px-6 py-4 text-sm text-slate-600">Jun 14, 2024</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Completed</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">Luxury Villa</td>
                <td className="px-6 py-4 text-sm text-slate-600">Sarah Johnson</td>
                <td className="px-6 py-4 text-sm text-slate-600">Maintenance Request</td>
                <td className="px-6 py-4 text-sm text-slate-600">Jun 13, 2024</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">In Progress</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">Studio Loft</td>
                <td className="px-6 py-4 text-sm text-slate-600">Mike Chen</td>
                <td className="px-6 py-4 text-sm text-slate-600">Lease Renewal</td>
                <td className="px-6 py-4 text-sm text-slate-600">Jun 12, 2024</td>
                <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2024 Rentilo. All rights reserved. Built with React, Tailwind CSS & Magic MCP Server.</p>
        </div>
      </footer>
    </div>
  );
};
