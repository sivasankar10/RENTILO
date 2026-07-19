import { useMemo } from 'react'
import { Filter, Download } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useAuth } from '@shared/hooks/useAuth'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

export function EnterpriseBrokers() {
  const { enterpriseBlocks } = useEnterpriseContext()
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const users = usePrototypeStore((s) => s.users)
  const allProperties = usePrototypeStore((s) => s.properties)
  const { user } = useAuth()

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
            </tr>
          </thead>
          <tbody>
            {allBrokers.map((broker) => {
              const assignCount = brokerAssignmentCounts[broker.id] ?? 0
              const isHere = enterpriseAssignments.some((a) => a.brokerId === broker.id)
              return (
                <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {broker.avatar ? (
                        <img src={broker.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{broker.firstName[0]}{broker.lastName[0]}</div>
                      )}
                      <div>
                        <p className="text-[13px] font-bold text-[#0f172a]">{broker.firstName} {broker.lastName}</p>
                        <p className="text-[11px] text-text-muted">{broker.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-text-muted">{broker.phone}</td>
                  <td className="px-4 py-4"><span className="rounded-pill bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#0f172a]">{assignCount}</span></td>
                  <td className="px-4 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold', isHere ? 'text-green-700' : 'text-slate-500')}>
                      <span className={cn('h-2 w-2 rounded-full', isHere ? 'bg-green-500' : 'bg-slate-400')} />
                      {isHere ? 'Assigned' : 'Available'}
                    </span>
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
    </div>
  )
}
