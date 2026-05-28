import { useMemo, useState } from 'react'
import { Ban, ChevronLeft, ChevronRight, Eye, Filter, Info, Mail, Search, Send, Trash2, UserCheck } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAdminStore } from '../store/adminStore'
import type { AdminUser } from '../store/adminStore'
import { ActionMenu } from '../components/ActionMenu'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'

const roleColors = {
  OWNER: 'bg-navy text-white',
  TENANT: 'bg-primary text-white',
  BROKER: 'bg-slate-700 text-white',
} as const

const kycColors = {
  Verified: { dot: 'bg-status-success', text: 'text-status-success' },
  Pending: { dot: 'bg-status-warning', text: 'text-status-warning' },
  Rejected: { dot: 'bg-status-error', text: 'text-status-error' },
} as const

const statusColors = {
  Active: 'bg-status-success-bg text-status-success-text',
  'Temp Banned': 'bg-slate-100 text-slate-600',
} as const

export function AdminUserManagement() {
  const users = useAdminStore((s) => s.users)
  const broadcasts = useAdminStore((s) => s.broadcasts)
  const toggleUserStatus = useAdminStore((s) => s.toggleUserStatus)
  const removeUser = useAdminStore((s) => s.removeUser)
  const addBroadcast = useAdminStore((s) => s.addBroadcast)

  const [sendTo, setSendTo] = useState('All Users')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== 'All Roles' && user.role !== roleFilter.toUpperCase()) return false
      if (statusFilter !== 'All Status' && user.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [users, roleFilter, statusFilter, searchQuery])

  const handleBroadcast = () => {
    if (!notificationTitle.trim()) {
      toast.error('Title required', 'Please enter a notification title.')
      return
    }
    if (!messageBody.trim()) {
      toast.error('Message body required', 'Please enter the announcement text.')
      return
    }
    addBroadcast(sendTo, notificationTitle, messageBody)
    toast.success('Broadcast sent', `Notification delivered to ${sendTo}.`)
    setNotificationTitle('')
    setMessageBody('')
  }

  const handleViewProfile = (user: AdminUser) => {
    toast.info(`Viewing ${user.name}`, `Role: ${user.role} • Status: ${user.status}`)
  }

  const handleSendEmail = (user: AdminUser) => {
    toast.success('Email drafted', `New message to ${user.email}`)
  }

  const handleToggleBan = (user: AdminUser) => {
    const isBanning = user.status === 'Active'
    confirm({
      title: isBanning ? 'Temporarily ban user?' : 'Reinstate user?',
      description: isBanning
        ? `${user.name} will lose access until manually reinstated.`
        : `${user.name} will regain platform access immediately.`,
      confirmLabel: isBanning ? 'Ban user' : 'Reinstate',
      variant: isBanning ? 'danger' : 'default',
      onConfirm: () => {
        toggleUserStatus(user.id)
        toast.success(isBanning ? 'User banned' : 'User reinstated')
      },
    })
  }

  const handleRemoveUser = (user: AdminUser) => {
    confirm({
      title: 'Delete user account?',
      description: `${user.name} (${user.email}) will be permanently removed. This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        removeUser(user.id)
        toast.success('User deleted', `${user.email} has been removed.`)
      },
    })
  }

  const handleExportCsv = () => {
    if (!filteredUsers.length) {
      toast.error('Nothing to export', 'Adjust filters and try again.')
      return
    }
    exportToCsv('users.csv', filteredUsers, [
      { key: 'id', label: 'User ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'kyc', label: 'KYC' },
      { key: 'status', label: 'Status' },
      { key: 'flags', label: 'Flags' },
      { key: 'lastActive', label: 'Last Active' },
    ])
    toast.success('Export started', `${filteredUsers.length} users downloaded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
          User Management
        </h1>

        {/* Broadcast Global Notification */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Send size={18} className="text-primary" />
              <h2 className="text-heading-3 font-bold text-text-primary">
                Broadcast Global Notification
              </h2>
            </div>
            {broadcasts.length > 0 && (
              <span className="rounded-pill bg-primary-100 px-3 py-1 text-badge font-bold text-primary">
                {broadcasts.length} sent today
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[200px_1fr]">
            <div>
              <label className="text-filter-label uppercase tracking-wider text-text-muted">Send To</label>
              <select
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option>All Users</option>
                <option>Owners</option>
                <option>Tenants</option>
                <option>Brokers</option>
              </select>
            </div>
            <div>
              <label className="text-filter-label uppercase tracking-wider text-text-muted">Notification Title</label>
              <input
                type="text"
                placeholder="e.g. Scheduled System Maintenance"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-filter-label uppercase tracking-wider text-text-muted">Message Body</label>
            <textarea
              placeholder="Enter the announcement message here..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-label text-text-muted">
              This will trigger a push notification and email to selected users.
            </p>
            <button
              type="button"
              onClick={handleBroadcast}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
            >
              <Send size={16} />
              Broadcast Message
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 rounded-input border border-outline bg-white pl-9 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label text-text-muted">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option>All Roles</option>
              <option>Owner</option>
              <option>Tenant</option>
              <option>Broker</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label text-text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Temp Banned</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="ml-auto inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            <Filter size={16} />
            Export CSV
          </button>
        </div>

        {/* Users Table */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">User Name</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">User ID</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Role</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">KYC</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Flags</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Last Active</th>
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-body text-text-muted">
                      No users match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-badge font-bold text-text-primary">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-body font-semibold text-text-primary">{user.name}</p>
                            <p className="text-label text-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-body text-text-muted">{user.id}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('inline-block rounded-pill px-3 py-1 text-badge font-bold uppercase', roleColors[user.role])}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('inline-flex items-center gap-1.5 text-body font-medium', kycColors[user.kyc].text)}>
                          <span className={cn('h-2 w-2 rounded-full', kycColors[user.kyc].dot)} />
                          {user.kyc}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('inline-block rounded-pill px-3 py-1 text-badge font-bold', statusColors[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('text-body font-bold', user.flags > 0 ? 'text-status-error' : 'text-text-muted')}>
                          {user.flags}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-body text-text-muted">{user.lastActive}</td>
                      <td className="px-2 py-4 text-center">
                        <ActionMenu
                          ariaLabel={`Actions for ${user.name}`}
                          items={[
                            { label: 'View profile', icon: Eye, onClick: () => handleViewProfile(user) },
                            { label: 'Send email', icon: Mail, onClick: () => handleSendEmail(user) },
                            {
                              label: user.status === 'Active' ? 'Temporarily ban' : 'Reinstate',
                              icon: user.status === 'Active' ? Ban : UserCheck,
                              variant: user.status === 'Active' ? 'danger' : 'default',
                              onClick: () => handleToggleBan(user),
                            },
                            { label: 'Delete account', icon: Trash2, variant: 'danger', onClick: () => handleRemoveUser(user) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors" aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn('h-8 w-8 rounded-button text-label font-medium transition-colors', currentPage === page ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light border border-outline')}
                >
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(3, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors" aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
          <Info size={18} className="mt-0.5 shrink-0 text-text-muted" />
          <div>
            <p className="text-body font-bold text-text-primary">Privacy Protocol</p>
            <p className="mt-0.5 text-label text-text-muted">
              Chat content is private. Admin can only review reported conversations with user-submitted evidence. All admin actions are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
