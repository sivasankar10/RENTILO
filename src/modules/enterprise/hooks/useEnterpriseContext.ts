import { useOutletContext } from 'react-router-dom'
import type { PrototypeProperty } from '@shared/types/prototype'

interface EnterpriseContext {
  currentBlockId: string
  enterpriseBlocks: PrototypeProperty[]
}

export function useEnterpriseContext() {
  return useOutletContext<EnterpriseContext>()
}
