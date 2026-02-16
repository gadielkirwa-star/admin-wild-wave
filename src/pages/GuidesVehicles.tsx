import { motion } from 'framer-motion';
import { Users, Car, Star, Phone, Mail, MapPin } from 'lucide-react';
import { guides, vehicles } from '../lib/db';

export default function GuidesVehicles() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-3xl font-display font-bold text-safari-charcoal dark:text-safari-cream mb-6">Guides & Vehicles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Guides</p>
              <p className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mt-1">{guides.length}</p>
            </div>
            <Users className="w-8 h-8 text-safari-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Vehicles</p>
              <p className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mt-1">{vehicles.length}</p>
            </div>
            <Car className="w-8 h-8 text-safari-gold" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-safari-charcoal dark:text-safari-cream mb-4">Safari Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6 hover:card-shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full safari-gradient flex items-center justify-center text-white text-xl font-bold">
                  {guide.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-safari-charcoal dark:text-safari-cream">{guide.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{guide.specialization}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-safari-gold text-safari-gold" />
                    <span className="text-sm font-medium text-safari-gold">{guide.rating}</span>
                    <span className="text-sm text-gray-500">({guide.tours} tours)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {guide.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {guide.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {guide.languages.join(', ')}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  guide.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                }`}>
                  {guide.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-display font-semibold text-safari-charcoal dark:text-safari-cream mb-4">Vehicle Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow p-6 hover:card-shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-safari-charcoal dark:text-safari-cream">{vehicle.model}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.type}</p>
                </div>
                <Car className="w-8 h-8 text-safari-gold" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Plate Number</span>
                  <span className="font-medium text-safari-charcoal dark:text-safari-cream">{vehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                  <span className="font-medium text-safari-charcoal dark:text-safari-cream">{vehicle.capacity} passengers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Year</span>
                  <span className="font-medium text-safari-charcoal dark:text-safari-cream">{vehicle.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Mileage</span>
                  <span className="font-medium text-safari-charcoal dark:text-safari-cream">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>
              <div className="pt-4 border-t dark:border-gray-700">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  vehicle.status === 'in-use' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
