import { useMemo, useState } from 'react'
import { Filter, Download, MessageSquare, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

export function EnterpriseBrokers() {
  const navigate = useNavigate()
  const { enterpriseBlocks } = useEnterpriseContext()
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const users = usePrototypeStore((s) => s.users)
  const allProperties = usePrototypeStore((s) => s.properties)
  const chats = usePrototypeStore((s) => s.chats)
  const payments = usePrototypeStore((s) => s.payments)
  const applications = usePrototypeStore((s) => s.applications)
  const { user } = useAuth()
  const [selectedBroker, setSelectedBroker] = useState<typeof users[0] | null>(null)

  // Navigate to messages page with a specific broker chat
  const openChatWithBroker = (brokerId: string) => {
    const ownerId = user?.id ?? ''
    // Ensure chat thread exists
    const existingThread = chats.find((t) => t.type === 'owner_broker' && t.participantIds.includes(brokerId) && t.participantIds.includes(ownerId))
    if (!existingThread) {
      const timestamp = new Date().toISOString()
      usePrototypeStore.setState((state) => ({
        chats: [{ id: `chat-ent-broker-${Date.now()}`, type: 'owner_broker' as const, participantIds: [ownerId, brokerId], messages: [], updatedAt: timestamp }, ...state.chats],
      }))
    }
    navigate(`${ROUTES.ENTERPRISE.ROOT}/messages`)
  }

  const allBrokers = useMemo(
    () => users.filter((u) => u.roles.includes('broker') && u.status === 'Active'),
    [users],
  )

  const brokerAssignmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    brokerAssignments.filter((a) => a.status === 'Active').forEach((a) => {
      counts[a.brokerId] = (counts[a.brokerId] ?? 0) + 1
    })
    return counts
  }, [brokerAssignments])

  // Include ALL property IDs owned by this enterprise (blocks + units)
  const enterprisePropertyIds = useMemo(() => {
    const ids = new Set<string>()
    enterpriseBlocks.forEach((b) => {
      ids.add(b.id)
      // Add unit property IDs from the block's units array
      b.enterpriseBlock?.units.forEach((u) => { if (u.propertyId) ids.add(u.propertyId) })
    })
    // Also include any other properties owned by this user
    allProperties.filter((p) => p.ownerId === (user?.id ?? '')).forEach((p) => ids.add(p.id))
    return ids
  }, [enterpriseBlocks, allProperties, user?.id])

  const enterpriseAssignments = useMemo(
    () => brokerAssignments.filter((a) => enterprisePropertyIds.has(a.propertyId) && a.status === 'Active'),
    [brokerAssignments, enterprisePropertyIds],
  )

  const assignmentMapping = useMemo(() => {
    return enterpriseAssignments.map((a) => {
      const broker = users.find((u) => u.id === a.brokerId)
      const property = allProperties.find((p) => p.id === a.propertyId)
      // Find parent block name if this is a unit property
      const parentBlock = enterpriseBlocks.find((b) => b.enterpriseBlock?.units.some((u) => u.propertyId === a.propertyId))
      return {
        id: a.id,
        name: broker ? `${broker.firstName} ${broker.lastName}` : 'Unknown',
        avatar: broker?.avatar,
        initials: broker ? `${broker.firstName[0]}${broker.lastName[0]}` : '??',
        block: parentBlock?.enterpriseBlock?.blockName ?? '—',
        propertyName: property?.title ?? '—',
        assignedAt: a.createdAt,
      }
    })
  }, [enterpriseAssignments, users, allProperties, enterpriseBlocks])

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0f172a] tracking-tight">Broker Management</h1>
          <p className="mt-1 text-[14px] text-text-muted">Manage brokers across your enterprise portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Filter size={14} /> Filter</button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Available Brokers</p>
          <p className="mt-2 text-[36px] font-extrabold text-[#0f172a] leading-none">{allBrokers.length}</p>
        </div>
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Enterprise Assignments</p>
          <p className="mt-2 text-[36px] font-extrabold text-[#0f172a] leading-none">{enterpriseAssignments.length}</p>
        </div>
        <div className="rounded-xl bg-[#0f172a] p-6 shadow-sm text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Commission Rate</p>
          <p className="mt-2 text-[42px] font-extrabold leading-none">2%</p>
        </div>
      </div>

      {/* All Brokers Table */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">All Available Brokers</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
              <th className="px-6 py-3">Broker</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Assignments</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBrokers.map((broker) => {
              const assignCount = brokerAssignmentCounts[broker.id] ?? 0
              const isHere = enterpriseAssignments.some((a) => a.brokerId === broker.id)
              return (
                <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => setSelectedBroker(broker)} className="flex items-center gap-3 text-left">
                      {broker.avatar ? (
                        <img src={broker.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{broker.firstName[0]}{broker.lastName[0]}</div>
                      )}
                      <div>
                        <p className="text-[13px] font-bold text-[#0f172a] hover:text-primary transition-colors">{broker.firstName} {broker.lastName}</p>
                        <p className="text-[11px] text-text-muted">{broker.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-text-muted">{broker.phone}</td>
                  <td className="px-4 py-4"><span className="rounded-pill bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#0f172a]">{assignCount}</span></td>
                  <td className="px-4 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold', isHere ? 'text-green-700' : 'text-slate-500')}>
                      <span className={cn('h-2 w-2 rounded-full', isHere ? 'bg-green-500' : 'bg-slate-400')} />
                      {isHere ? 'Assigned' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setSelectedBroker(broker)} className="rounded-lg border border-outline px-3 py-1.5 text-[11px] font-bold text-[#0f172a] hover:bg-hover-light">Profile</button>
                      <button type="button" onClick={() => openChatWithBroker(broker.id)} className="rounded-lg bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"><MessageSquare size={12} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Assignment Mapping */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">Broker Assignment Mapping</h2>
        </div>
        {assignmentMapping.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
                <th className="px-6 py-3">Broker</th>
                <th className="px-4 py-3">Block</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Since</th>
              </tr>
            </thead>
            <tbody>
              {assignmentMapping.map((m) => (
                <tr key={m.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {m.avatar ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{m.initials}</div>}
                      <p className="text-[13px] font-bold text-[#0f172a]">{m.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[15px] font-bold text-[#0f172a]">{m.block}</td>
                  <td className="px-4 py-4 text-[13px] text-text-primary">{m.propertyName}</td>
                  <td className="px-4 py-4 text-[12px] text-text-muted">{new Date(m.assignedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] font-semibold text-text-muted">No assignments yet</p>
            <p className="mt-1 text-[12px] text-text-muted">Use Assignment Management to assign brokers.</p>
          </div>
        )}
      </div>

      {/* Broker Profile Modal */}
      {selectedBroker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => { setSelectedBroker(null); setChatOpen(false) }} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline bg-white px-6 py-5">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Broker Profile</h2>
              <button type="button" onClick={() => { setSelectedBroker(null); setChatOpen(false) }} className="rounded-lg p-2 text-text-muted hover:bg-hover-light"><X size={18} /></button>
            </div>
            <div className="px-6 py-6 space-y-5">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                {selectedBroker.avatar ? <img src={selectedBroker.avatar} alt="" className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-[20px] font-bold">{selectedBroker.firstName[0]}{selectedBroker.lastName[0]}</div>}
                <div>
                  <h3 className="text-[20px] font-bold text-[#0f172a]">{selectedBroker.firstName} {selectedBroker.lastName}</h3>
                  <p className="text-[13px] text-text-muted">Professional Broker</p>
                  <span className={cn('mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold', selectedBroker.status === 'Active' ? 'text-green-700' : 'text-slate-500')}><span className={cn('h-2 w-2 rounded-full', selectedBroker.status === 'Active' ? 'bg-green-500' : 'bg-slate-400')} />{selectedBroker.status}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-canvas-alt p-3 text-center">
                  <p className="text-[20px] font-extrabold text-[#0f172a]">{(() => { const months = Math.floor((Date.now() - new Date(selectedBroker.createdAt).getTime()) / (30 * 86400000)); return months < 12 ? `${months}m` : `${Math.floor(months / 12)}y` })()}</p>
                  <p className="text-[9px] font-bold uppercase text-text-muted">Experience</p>
                </div>
                <div className="rounded-lg bg-canvas-alt p-3 text-center">
                  <p className="text-[20px] font-extrabold text-[#0f172a]">{applications.filter((a) => a.brokerId === selectedBroker.id && a.status === 'active').length}</p>
                  <p className="text-[9px] font-bold uppercase text-text-muted">Deals Closed</p>
                </div>
                <div className="rounded-lg bg-canvas-alt p-3 text-center">
                  <p className="text-[20px] font-extrabold text-[#0f172a]">Rs. {payments.filter((p) => p.brokerId === selectedBroker.id && p.category === 'COMMISSION' && p.status === 'Successful').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}</p>
                  <p className="text-[9px] font-bold uppercase text-text-muted">Commission Earned</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-4 text-[13px] border-t border-outline pt-4">
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Email</p><p className="mt-1 font-semibold text-[#0f172a]">{selectedBroker.email}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Phone</p><p className="mt-1 font-semibold text-[#0f172a]">{selectedBroker.phone}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">KYC Status</p><span className={cn('mt-1 inline-block rounded-pill px-2 py-0.5 text-[10px] font-bold', selectedBroker.kycStatus === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{selectedBroker.kycStatus}</span></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Active Assignments</p><p className="mt-1 font-semibold text-[#0f172a]">{brokerAssignmentCounts[selectedBroker.id] ?? 0} properties</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Leads Managed</p><p className="mt-1 font-semibold text-[#0f172a]">{applications.filter((a) => a.brokerId === selectedBroker.id).length}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Member Since</p><p className="mt-1 font-semibold text-[#0f172a]">{new Date(selectedBroker.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
              </div>

              {/* Assigned Properties */}
              {enterpriseAssignments.filter((a) => a.brokerId === selectedBroker.id).length > 0 && (
                <div className="border-t border-outline pt-4">
                  <p className="text-[10px] font-bold uppercase text-text-muted mb-2">Assigned to your properties</p>
                  <div className="space-y-2">
                    {enterpriseAssignments.filter((a) => a.brokerId === selectedBroker.id).map((a) => {
                      const prop = allProperties.find((p) => p.id === a.propertyId)
                      return <div key={a.id} className="rounded-lg bg-canvas-alt p-2.5 text-[12px] font-semibold text-[#0f172a]">{prop?.title ?? 'Unit'}</div>
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-outline bg-white px-6 py-4">
              <button type="button" onClick={() => { setSelectedBroker(null); openChatWithBroker(selectedBroker.id) }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white"><MessageSquare size={14} /> Chat</button>
              <a href={`tel:${selectedBroker.phone}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-outline px-4 py-2.5 text-[12px] font-bold text-[#0f172a]">Call</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
