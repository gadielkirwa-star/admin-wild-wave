import { motion } from 'framer-motion';
import { Search, DollarSign, CreditCard, CheckCircle, Clock, XCircle, Download, FileText } from 'lucide-react';
import { db } from '../lib/db';
import { formatCurrency, formatDate } from '../lib/utils';

export default function Payments() {
  const payments = db.payments;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  const exportToPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payments Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #D4A574; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #D4A574; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { text-align: center; color: #666; margin-bottom: 10px; }
          .summary { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>WildWave Safaris - Payments Report</h1>
          <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="summary">
          <p><strong>Total Revenue:</strong> ${formatCurrency(totalRevenue)}</p>
          <p><strong>Completed Payments:</strong> ${completedPayments}</p>
          <p><strong>Pending Payments:</strong> ${pendingPayments}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(p => `
              <tr>
                <td>${p.transactionId}</td>
                <td>${p.customerName}</td>
                <td>${formatCurrency(p.amount)}</td>
                <td>${p.method}</td>
                <td>${p.status}</td>
                <td>${formatDate(p.date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `
    
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-safari-charcoal dark:text-safari-cream">Payments</h1>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90"
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-safari-gold mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-safari-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedPayments}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{pendingPayments}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-lg card-shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search payments..." className="pl-10 pr-4 py-2 border rounded-lg w-full dark:bg-safari-charcoal dark:border-gray-700" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100">{payment.transactionId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{payment.customerName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-safari-gold">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      payment.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {payment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                      {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(payment.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
