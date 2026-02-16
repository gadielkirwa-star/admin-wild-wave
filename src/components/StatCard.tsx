import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  color: string
}

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-safari-cream mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-safari-cream/60">{title}</p>
    </motion.div>
  )
}
