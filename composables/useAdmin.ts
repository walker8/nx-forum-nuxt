export enum AuditStatus {
  PASSED,
  AUDITING,
  REJECTED
}
export const useAuditStatus = () => {
  const route = useRoute()
  const type = route.params.type
  let auditStatus = ref<AuditStatus | null>(null)
  let deleted = false
  switch (type) {
    case 'recycle':
      deleted = true
      break
    case 'auditing':
      auditStatus.value = AuditStatus.AUDITING
      break
    default:
      auditStatus.value = AuditStatus.PASSED
      break
  }
  return { auditStatus, deleted }
}

export const useAuditingCount = () =>
  useState('auditingCount', () => ({
    threadAuditCount: 0,
    commentAuditCount: 0,
    replyAuditCount: 0,
    totalAuditCount: 0
  }))
