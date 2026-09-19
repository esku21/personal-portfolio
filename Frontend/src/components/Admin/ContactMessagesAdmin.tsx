import { useState } from 'react'
import { Mail, Trash2, CheckCircle2, Archive, Clock, Search, ArrowUpRight } from 'lucide-react'
import type { ContactMessage } from '../../types'
import { portfolioApi } from '../../services/api'

interface ContactMessagesAdminProps {
  messages: ContactMessage[]
  onRefresh: () => void
}

export function ContactMessagesAdmin({ messages, onRefresh }: ContactMessagesAdminProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'archived') => {
    await portfolioApi.updateMessage(id, status)
    onRefresh()
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message permanently?')) {
      await portfolioApi.deleteMessage(id)
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      onRefresh()
    }
  }

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Mail className="text-rose-500" size={24} />
            <span>Contact Messages</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Incoming inquiries from the public portfolio contact form (PostgreSQL "ContactMessage" table)
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/60 self-start sm:self-auto text-xs">
          {(['all', 'unread', 'read', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filter === tab
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {tab}
              {tab === 'unread' && messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {messages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by sender, email or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      {/* Two Column In-Box View: Message List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg)
                if (msg.status === 'unread') {
                  handleStatusChange(msg.id, 'read')
                }
              }}
              className={`p-4 cursor-pointer transition-colors ${
                selectedMessage?.id === msg.id
                  ? 'bg-[#0d5543]/5 dark:bg-[#2dd4bf]/5 border-l-4 border-l-[#0d5543] dark:border-l-[#2dd4bf]'
                  : msg.status === 'unread'
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70'
                    : 'hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                  {msg.name}
                </span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  msg.status === 'unread'
                    ? 'bg-rose-500 text-white'
                    : msg.status === 'read'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                  {msg.status}
                </span>
              </div>
              <div className="text-xs text-neutral-800 dark:text-neutral-200 font-medium truncate">
                {msg.subject}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                {msg.message}
              </p>
              <div className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
                <Clock size={11} />
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'} · {msg.email}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-neutral-400 text-xs">
              No messages found in this view.
            </div>
          )}
        </div>

        {/* Message Details Preview Pane */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sticky top-6 shadow-sm">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedMessage.subject}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    From: <span className="font-medium text-neutral-800 dark:text-neutral-200">{selectedMessage.name}</span> ({selectedMessage.email})
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, selectedMessage.status === 'read' ? 'unread' : 'read')}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs"
                    title="Toggle Read/Unread"
                  >
                    <CheckCircle2 size={15} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs"
                    title="Archive"
                  >
                    <Archive size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950/70 p-4 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed min-h-[160px]">
                {selectedMessage.message}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Mail size={14} /> Reply via Email <ArrowUpRight size={13} />
                </a>

                <span className="text-[11px] font-mono text-neutral-400">
                  ID: {selectedMessage.id}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-neutral-400 text-xs">
              <Mail size={32} className="mx-auto mb-3 opacity-40 text-neutral-400" />
              Select a message from the list to read details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}