import { FeatureGate } from '../components/FeatureGate'

/** Owner Financials - Premium Feature */
export function OwnerFinancials() {
  return (
    <FeatureGate feature="financial_reports">
      <div className="min-h-screen bg-[#f8fafc] pb-12">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight">
              Financial Reports
            </h1>
            <p className="text-[15px] text-[#64748b] mt-1">
              Generate comprehensive financial reports for your properties.
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#64748b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#0f172a] mb-2">
              Financial Reports Coming Soon
            </h2>
            <p className="text-[15px] text-[#64748b] max-w-md mx-auto">
              Track income, expenses, and generate detailed financial reports for tax purposes and portfolio analysis.
            </p>
          </div>
        </div>
      </div>
    </FeatureGate>
  )
}
