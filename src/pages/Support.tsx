import { motion } from 'framer-motion';
import { Search, MessageSquare, Clock, CheckCircle, User, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';

const supportTickets = [
  { id: '1', ticketId: 'SUP-2026-045', customer: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555 0101', subject: 'Question about Masai Mara Safari', message: 'Hi, I would like to know if the Masai Mara package includes hot air balloon rides?', status: 'open', priority: 'high', date: '2026-03-15 10:30', replies: 0 },
  { id: '2', ticketId: 'SUP-2026-044', customer: 'Michael Chen', email: 'michael@example.com', phone: '+44 20 1234', subject: 'Visa requirements for Kenya', message: 'What are the visa requirements for UK citizens traveling to Kenya?', status: 'pending', priority: 'medium', date: '2026-03-15 09:15', replies: 1 },
  { id: '3', ticketId: 'SUP-2026-043', customer: 'Emma Williams', email: 'emma@example.com', phone: '+61 2 9876', subject: 'Group discount inquiry', message: 'Do you offer discounts for groups of 10 or more people?', status: 'resolved', priority: 'low', date: '2026-03-14 16:45', replies: 3 },
  { id: '4', ticketId: 'SUP-2026-042', customer: 'James Brown', email: 'james@example.com', phone: '+1 555 0202', subject: 'Payment options', message: 'Can I pay in installments for the Serengeti Adventure package?', status: 'open', priority: 'high', date: '2026-03-14 14:20', replies: 0 },
  { id: '5', ticketId: 'SUP-2026-041', customer: 'Lisa Anderson', email: 'lisa@example.com', phone: '+49 30 1234', subject: 'Best time to visit', message: 'When is the best time to visit for the Great Migration?', status: 'pending', priority: 'medium', date: '2026-03-14 11:00', replies: 1 }
];

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState(supportTickets[0]);
  const [replyMessage, setReplyMessage] = useState('');

  const openTickets = supportTickets.filter(t => t.status === 'open').length;
  const pendingTickets = supportTickets.filter(t => t.status === 'pending').length;
  const resolvedTickets = supportTickets.filter(t => t.status === 'resolved').length;

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      alert(`Reply sent to ${selectedTicket.customer}`);
      setReplyMessage('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-3xl font-display font-bold text-safari-charcoal dark:text-safari-cream mb-6">Customer Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{openTickets}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{pendingTickets}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-safari-charcoal p-6 rounded-lg card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{resolvedTickets}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-safari-charcoal rounded-lg card-shadow">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search tickets..." className="pl-10 pr-4 py-2 border rounded-lg w-full dark:bg-safari-charcoal dark:border-gray-700" />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedTicket.id === ticket.id ? 'bg-safari-sand dark:bg-gray-800' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-safari-charcoal dark:text-safari-cream">{ticket.customer}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{ticket.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    ticket.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{ticket.ticketId}</span>
                  <span>{ticket.date.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-safari-charcoal rounded-lg card-shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-safari-charcoal dark:text-safari-cream">{selectedTicket.subject}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.ticketId}</p>
              </div>
              <select className="px-3 py-1 border rounded-lg text-sm dark:bg-safari-charcoal dark:border-gray-700">
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {selectedTicket.customer}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {selectedTicket.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {selectedTicket.phone}
              </div>
            </div>
          </div>

          <div className="p-6 max-h-[400px] overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full safari-gradient flex items-center justify-center text-white font-semibold">
                  {selectedTicket.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTicket.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{selectedTicket.date}</p>
                </div>
              </div>
            </div>

            {selectedTicket.replies > 0 && (
              <div className="mb-6">
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="bg-safari-gold/10 rounded-lg p-4 inline-block">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Thank you for your inquiry. {selectedTicket.subject.includes('balloon') ? 'Yes, hot air balloon rides are included in the premium package.' : selectedTicket.subject.includes('visa') ? 'UK citizens can obtain a visa on arrival or apply online.' : 'Yes, we offer 15% discount for groups of 10+.'}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Admin - {selectedTicket.date.split(' ')[0]} 14:30</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-safari-gold flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t dark:border-gray-700">
            <div className="flex gap-3">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="flex-1 px-4 py-2 border rounded-lg resize-none dark:bg-safari-charcoal dark:border-gray-700"
              />
              <button
                onClick={handleSendReply}
                className="px-6 py-2 safari-gradient text-white rounded-lg hover:opacity-90 flex items-center gap-2 h-fit"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
