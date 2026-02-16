import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Mail, Save } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-3xl font-display font-bold text-safari-charcoal dark:text-safari-cream mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-safari-gold" />
              <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" defaultValue="admin@wildwavesafaris.com" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input type="tel" defaultValue="+254 713 241 666" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-safari-gold" />
              <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">Change Password</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-safari-gold" />
              <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for new bookings</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-safari-gold rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for payments</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-safari-gold rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for enquiries</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-safari-gold rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Weekly summary reports</span>
                <input type="checkbox" className="w-5 h-5 text-safari-gold rounded" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-safari-gold" />
              <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                <select className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                  <option>EAT (UTC+3)</option>
                  <option>GMT (UTC+0)</option>
                  <option>EST (UTC-5)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                <select className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                  <option>USD ($)</option>
                  <option>KES (KSh)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-safari-gold" />
              <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">Contact</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Email: wildwavesafaris@gmail.com</p>
              <p>Phone: +254 713 241 666</p>
              <p>Location: Thika Road, Spur Mall, Nairobi</p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 safari-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
