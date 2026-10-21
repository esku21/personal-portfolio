import { useState } from 'react'
import { Mail, Trash2, CheckCircle2, Archive, Clock, Search, ArrowUpRight, Phone, UserRound, X } from 'lucide-react'
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
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState('')

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'archived') => {
    setActionError('')
    setBusyId(id)
    try {
      await portfolioApi.updateMessage(id, status)
      setSelectedMessage((current) => current?.id === id ? { ...current, status } : current)
      await onRefresh()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update this message.')
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message permanently?')) {
      setActionError('')
      setBusyId(id)
      try {
        await portfolioApi.deleteMessage(id)
        if (selectedMessage?.id === id) setSelectedMessage(null)
        await onRefresh()
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'Could not delete this message.')
      } finally {
        setBusyId('')
      }
    }
  }

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  }).sort((left, right) => {
    return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
  })

  return (
    <div className="admin-workspace-page space-y-6">
      {/* Header */}
      <div className="admin-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Mail className="text-rose-500" size={24} />
            <span>Contact Messages</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Review inquiries, manage their status, and reply directly from the inbox.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-100 p-1 text-xs dark:border-neutral-700/60 dark:bg-neutral-800/70 self-start sm:self-auto">
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
          placeholder="Search name, email, phone or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      {actionError && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError('')} aria-label="Dismiss error"><X size={15} /></button>
        </div>
      )}

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Showing <span className="font-semibold text-neutral-700 dark:text-neutral-200">{filtered.length}</span> of {messages.length} messages
      </p>

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
              className={`cursor-pointer border-l-4 p-4 transition-colors ${
                selectedMessage?.id === msg.id
                  ? 'border-l-[#0d5543] bg-[#0d5543]/5 dark:border-l-[#2dd4bf] dark:bg-[#2dd4bf]/5'
                  : 'border-l-transparent'
                } ${msg.status === 'unread' && selectedMessage?.id !== msg.id
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
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'} · {msg.email} · {msg.phone}
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
        <div className="lg:sticky lg:top-6 lg:col-span-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedMessage.subject}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1"><UserRound size={13} />{selectedMessage.name}</span>
                    <a href={`mailto:${selectedMessage.email}`} className="inline-flex items-center gap-1 hover:text-[#0d5543]"><Mail size={13} />{selectedMessage.email}</a>
                    <a href={`tel:${selectedMessage.phone}`} className="inline-flex items-center gap-1 hover:text-[#0d5543]"><Phone size={13} />{selectedMessage.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => handleStatusChange(selectedMessage.id, selectedMessage.status === 'read' ? 'unread' : 'read')}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs"
                    title="Toggle Read/Unread"
                  >
                    <CheckCircle2 size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs"
                    title="Archive"
                  >
                    <Archive size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={busyId === selectedMessage.id}
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