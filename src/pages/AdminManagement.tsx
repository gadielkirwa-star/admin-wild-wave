import { motion } from 'framer-motion';
import { Plus, Edit, Shield, ShieldAlert, UserX, UserCheck, Search, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'sub-admin';
  status: 'active' | 'suspended' | 'blocked';
  createdAt: string;
  lastLogin: string;
}

const initialAdmins: Admin[] = [
  { id: '1', name: 'Super Admin', email: 'admin@wildwave.com', role: 'super-admin', status: 'active', createdAt: '2025-01-01', lastLogin: '2026-03-15' },
  { id: '2', name: 'John Manager', email: 'john@wildwave.com', role: 'admin', status: 'active', createdAt: '2025-06-15', lastLogin: '2026-03-14' },
  { id: '3', name: 'Sarah Support', email: 'sarah@wildwave.com', role: 'sub-admin', status: 'active', createdAt: '2025-09-20', lastLogin: '2026-03-13' },
  { id: '4', name: 'Mike Assistant', email: 'mike@wildwave.com', role: 'sub-admin', status: 'suspended', createdAt: '2025-11-10', lastLogin: '2026-02-28' }
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'sub-admin' as const });

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.password) {
      const admin: Admin = {
        id: Date.now().toString(),
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setAdmins([...admins, admin]);
      setNewAdmin({ name: '', email: '', password: '', role: 'sub-admin' });
      setShowAddModal(false);
    }
  };

  const updateStatus = (id: string, status: Admin['status']) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, status } : a));
  };

  const getRoleBadge = (role: Admin['role']) => {
    const styles = {
      'super-admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'admin': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'sub-admin': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    return styles[role];
  };

  const getStatusBadge = (status: Admin['status']) => {
    const styles = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'suspended': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'blocked': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-safari-charcoal dark:text-safari-cream">Admin Management</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Admins</p>
              <p className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mt-1">{admins.length}</p>
            </div>
            <Shield className="w-8 h-8 text-safari-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{admins.filter(a => a.status === 'active').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Suspended/Blocked</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{admins.filter(a => a.status !== 'active').length}</p>
            </div>
            <UserX className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search admins..." className="pl-10 pr-4 py-2 border rounded-lg w-full dark:bg-safari-charcoal dark:border-gray-700" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full safari-gradient flex items-center justify-center text-white font-semibold">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-safari-charcoal dark:text-safari-cream">{admin.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(admin.role)}`}>
                      {admin.role === 'super-admin' && <ShieldAlert className="w-3 h-3" />}
                      {admin.role === 'admin' && <Shield className="w-3 h-3" />}
                      {admin.role.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(admin.status)}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {admin.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{admin.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {admin.status === 'active' && admin.role !== 'super-admin' && (
                        <>
                          <button
                            onClick={() => updateStatus(admin.id, 'suspended')}
                            className="px-3 py-1 text-xs border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-all"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => updateStatus(admin.id, 'blocked')}
                            className="px-3 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                          >
                            Block
                          </button>
                        </>
                      )}
                      {admin.status !== 'active' && (
                        <button
                          onClick={() => updateStatus(admin.id, 'active')}
                          className="px-3 py-1 text-xs border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-all"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 max-w-md w-full card-shadow-lg"
          >
            <h2 className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mb-4">Add New Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  placeholder="john@wildwave.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                >
                  <option value="sub-admin">Sub Admin</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddAdmin}
                className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all"
              >
                Add Admin
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
