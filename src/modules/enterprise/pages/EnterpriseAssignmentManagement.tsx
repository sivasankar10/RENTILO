import { useMemo, useState } from 'react'
import { Check, UserCheck, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

export function EnterpriseAssignmentManagement() {
  const { user } = useAuth()
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const users = usePrototypeStore((s) => s.users)
  const leases = usePrototypeStore((s) => s.leases)
  const negotiations = usePrototypeStore((s) => s.commissionNegotiations)
  const createNegotiation = usePrototypeStore((s) => s.createCommissionNegotiation)
  const sendBrokerOffer = usePrototypeStore((s) => s.sendBrokerOffer)
  const decideBrokerOffer = usePrototypeStore((s) => s.decideBrokerOffer)
  const allProperties = usePrototypeStore((s) => s.properties)

  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock
  const units = blockData?.units ?? []

  const [selectedUnitPropertyId, setSelectedUnitPropertyId] = useState<string | null>(null)
  const [showCommissionModal, setShowCommissionModal] = useState<{ brokerId: string; brokerName: string } | null>(null)
  const [commission, setCommission] = useState('2')
  const [note, setNote] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // All brokers
  const brokers = useMemo(() => users.filter((u) => u.roles.includes('broker') && u.status === 'Active'), [users])

  // Count assignments per broker
  const brokerAssignmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    brokerAssignments.filter((a) => a.status === 'Active').forEach((a) => { counts[a.brokerId] = (counts[a.brokerId] ?? 0) + 1 })
    return counts
  }, [brokerAssignments])

  // Enterprise negotiations for the selected unit
  const unitNegotiations = useMemo(() => {
    if (!selectedUnitPropertyId) return []
    return negotiations.filter((n) => n.propertyId === selectedUnitPropertyId && n.ownerId === (user?.id ?? ''))
  }, [negotiations, selectedUnitPropertyId, user?.id])

  // Check assignment for selected unit
  const unitAssignment = useMemo(() => {
    if (!selectedUnitPropertyId) return null
    return brokerAssignments.find((a) => a.propertyId === selectedUnitPropertyId && a.status === 'Active') ?? null
  }, [brokerAssignments, selectedUnitPropertyId])

  const handleAssignClick = (brokerId: string, brokerName: string) => {
    setShowCommissionModal({ brokerId, brokerName })
    setCommission('2')
    setNote('')
  }

  const handleSendOffer = () => {
    if (!showCommissionModal || !selectedUnitPropertyId || !user?.id) return
    // Create negotiation and immediately send broker offer
    const negId = createNegotiation(user.id, selectedUnitPropertyId, `${commission}%`, note || `Assignment offer for unit property`)
    if (negId) {
      sendBrokerOffer(negId, showCommissionModal.brokerId, `${commission}%`)
      setSuccessMsg(`Offer sent to ${showCommissionModal.brokerName} at ${commission}% commission. Waiting for response.`)
    }
    setShowCommissionModal(null)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  // Enterprise owner can accept broker offer (auto-accept to simulate)
  const handleAcceptOffer = (negId: string, brokerId: string) => {
    decideBrokerOffer(negId, brokerId, 'accepted')
    setSuccessMsg('Broker assigned successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleRejectOffer = (negId: string, brokerId: string) => {
    decideBrokerOffer(negId, brokerId, 'rejected')
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5"><UserCheck size={13} /> Broker Management</p>
        <h1 className="mt-1 text-[28px] font-extrabold text-[#0f172a] tracking-tight">Assignment Management</h1>
        <p className="mt-2 text-[14px] text-text-muted">Select a unit, then assign a broker with commission negotiation.</p>
      </div>

      {successMsg && <div className="rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-[13px] font-semibold text-green-700 flex items-center gap-2"><Check size={16} /> {successMsg}</div>}

      {/* Units Grid with status */}
      <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Units in Block {blockData?.blockName ?? ''}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {units.map((unit) => {
            const hasLease = unit.propertyId ? leases.some((l) => l.propertyId === unit.propertyId && (l.status === 'active' || l.status === 'pending_owner_onboarding')) : false
            const status = hasLease ? 'Occupied' : unit.status
            const isSelected = selectedUnitPropertyId === unit.propertyId
            const hasAssignment = unit.propertyId ? brokerAssignments.some((a) => a.propertyId === unit.propertyId && a.status === 'Active') : false
            return (
              <button key={unit.unitId} type="button" onClick={() => setSelectedUnitPropertyId(unit.propertyId ?? null)} disabled={!unit.propertyId}
                className={cn('rounded-xl border p-4 text-left transition-all', isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary-50' : 'border-outline hover:bg-hover-light', !unit.propertyId && 'opacity-50 cursor-not-allowed')}>
                <p className="text-[15px] font-bold text-[#0f172a]">{unit.unitNumber}</p>
                <p className="mt-1 text-[10px] text-text-muted">Floor {unit.floor}</p>
                <span className={cn('mt-2 inline-block rounded-pill px-2 py-0.5 text-[9px] font-bold', status === 'Vacant' ? 'bg-amber-50 text-amber-700' : status === 'Occupied' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600')}>{status}</span>
                {hasAssignment && <p className="mt-1 text-[9px] font-bold text-primary">Broker Assigned</p>}
              </button>
            )
          })}
        </div>
        {units.length === 0 && <p className="text-[13px] text-text-muted italic">No units added yet. Add units via Portfolio page.</p>}
      </div>

      {/* Selected Unit: Current Assignment or Negotiation Status */}
      {selectedUnitPropertyId && (
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#0f172a] mb-3">
            Unit: {allProperties.find((p) => p.id === selectedUnitPropertyId)?.unit ?? '—'}
          </h3>

          {unitAssignment && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4">
              <p className="text-[10px] font-bold uppercase text-green-600">Currently Assigned</p>
              <p className="mt-1 text-[14px] font-bold text-[#0f172a]">{users.find((u) => u.id === unitAssignment.brokerId)?.firstName} {users.find((u) => u.id === unitAssignment.brokerId)?.lastName}</p>
            </div>
          )}

          {/* Active Negotiations */}
          {unitNegotiations.length > 0 && (
            <div className="space-y-3 mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Negotiations</p>
              {unitNegotiations.map((neg) => (
                <div key={neg.id} className="rounded-lg border border-outline p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-[#0f172a]">Commission: {neg.rounds[neg.rounds.length - 1]?.commission ?? '—'}</p>
                      <p className="text-[11px] text-text-muted">Status: <span className="font-semibold">{neg.status.replace(/_/g, ' ')}</span></p>
                    </div>
                    <span className={cn('rounded-pill px-2.5 py-1 text-[10px] font-bold', neg.status === 'accepted' ? 'bg-green-50 text-green-700' : neg.status === 'broker_rejected' || neg.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')}>{neg.status === 'accepted' ? 'Accepted' : neg.status.includes('rejected') ? 'Rejected' : 'Pending'}</span>
                  </div>
                  {/* Broker offers */}
                  {neg.brokerOffers.map((offer) => {
                    const broker = users.find((u) => u.id === offer.brokerId)
                    return (
                      <div key={`${offer.brokerId}-${offer.offeredAt}`} className="mt-3 flex items-center justify-between rounded-lg bg-canvas-alt p-3">
                        <div>
                          <p className="text-[12px] font-bold text-[#0f172a]">{broker?.firstName} {broker?.lastName}</p>
                          <p className="text-[10px] text-text-muted">Offered: {offer.commission} · Status: {offer.status}</p>
                        </div>
                        {offer.status === 'pending' && (
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleAcceptOffer(neg.id, offer.brokerId)} className="rounded-lg bg-green-600 px-3 py-1.5 text-[10px] font-bold text-white">Accept</button>
                            <button type="button" onClick={() => { setShowCommissionModal({ brokerId: offer.brokerId, brokerName: broker ? `${broker.firstName} ${broker.lastName}` : 'Broker' }); setCommission(offer.commission.replace('%', '')); setNote('Counter-offer') }} className="rounded-lg border border-primary bg-white px-3 py-1.5 text-[10px] font-bold text-primary">Counter</button>
                            <button type="button" onClick={() => handleRejectOffer(neg.id, offer.brokerId)} className="rounded-lg border border-red-200 px-3 py-1.5 text-[10px] font-bold text-red-600">Reject</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Broker Table — show when unit selected and no final assignment */}
      {selectedUnitPropertyId && !unitAssignment && (
        <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
            <div><h3 className="text-[15px] font-bold text-[#0f172a]">Available Brokers</h3><p className="mt-1 text-[11px] text-text-muted">Click "Assign" to send a commission offer to the broker.</p></div>
            <span className="rounded-pill bg-slate-100 px-3 py-1 text-[11px] font-bold text-text-muted">{brokers.length} brokers</span>
          </div>
          <table className="w-full text-left">
            <thead><tr className="border-b border-outline bg-canvas-alt"><th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Broker</th><th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Phone</th><th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Assigned</th><th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted text-center">Action</th></tr></thead>
            <tbody>
              {brokers.map((broker) => {
                const assignCount = brokerAssignmentCounts[broker.id] ?? 0
                const hasPendingOffer = unitNegotiations.some((n) => n.brokerOffers.some((o) => o.brokerId === broker.id && o.status === 'pending'))
                return (
                  <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                    <td className="px-6 py-4"><div className="flex items-center gap-3">{broker.avatar ? <img src={broker.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{broker.firstName[0]}{broker.lastName[0]}</div>}<div><p className="text-[13px] font-bold text-[#0f172a]">{broker.firstName} {broker.lastName}</p><p className="text-[11px] text-text-muted">{broker.email}</p></div></div></td>
                    <td className="px-4 py-4 text-[13px] text-text-muted">{broker.phone}</td>
                    <td className="px-4 py-4"><span className="rounded-pill bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#0f172a]">{assignCount} properties</span></td>
                    <td className="px-4 py-4 text-center">
                      {hasPendingOffer ? (
                        <span className="rounded-pill bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">Offer Sent</span>
                      ) : (
                        <button type="button" onClick={() => handleAssignClick(broker.id, `${broker.firstName} ${broker.lastName}`)} className="rounded-lg bg-[#0f172a] px-4 py-2 text-[11px] font-bold text-white hover:bg-slate-800">Assign</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!selectedUnitPropertyId && (
        <div className="rounded-xl border border-dashed border-outline bg-white p-12 text-center">
          <UserCheck size={32} className="mx-auto text-text-muted" />
          <p className="mt-3 text-[15px] font-bold text-[#0f172a]">Select a unit above</p>
          <p className="mt-1 text-[13px] text-text-muted">Choose a unit to view its broker assignment or send a new offer.</p>
        </div>
      )}

      {/* Commission Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setShowCommissionModal(null)} />
          <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-outline px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a]">Commission Offer</h2>
                <p className="mt-1 text-[12px] text-text-muted">Set commission for {showCommissionModal.brokerName}</p>
              </div>
              <button type="button" onClick={() => setShowCommissionModal(null)} className="rounded-lg p-2 text-text-muted hover:bg-hover-light"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[12px] font-bold text-text-primary">Commission Percentage (%)</label>
                <input type="number" min="0.5" max="10" step="0.5" value={commission} onChange={(e) => setCommission(e.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-outline bg-white px-4 text-[16px] font-bold text-[#0f172a] outline-none focus:border-primary" />
                <p className="mt-1 text-[11px] text-text-muted">Standard range: 1% - 3% of monthly rent per lease closed.</p>
              </div>
              <div>
                <label className="text-[12px] font-bold text-text-primary">Note (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Any terms or conditions..." className="mt-1.5 w-full rounded-lg border border-outline bg-white px-4 py-3 text-[13px] text-[#0f172a] outline-none resize-none focus:border-primary" />
              </div>
              <div className="rounded-lg bg-canvas-alt border border-outline p-4">
                <p className="text-[11px] font-bold uppercase text-text-muted">Summary</p>
                <p className="mt-2 text-[14px] font-bold text-[#0f172a]">{commission}% commission → {showCommissionModal.brokerName}</p>
                <p className="mt-1 text-[11px] text-text-muted">Unit: {allProperties.find((p) => p.id === selectedUnitPropertyId)?.unit ?? '—'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline px-6 py-4">
              <button type="button" onClick={() => setShowCommissionModal(null)} className="rounded-lg border border-outline px-5 py-2.5 text-[13px] font-bold text-[#0f172a]">Cancel</button>
              <button type="button" onClick={handleSendOffer} className="rounded-lg bg-[#0f172a] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-slate-800">Send Offer to Broker</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
