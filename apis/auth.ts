import Http from '../utils/request'

/**
 * 查询用户权限
 * @param forumId
 * @returns
 */
export const queryPermissions = (forumId: number = 0) => {
  if (forumId && forumId > 0) {
    return Http.get(`/v1/auth/permissions?forumId=${forumId}`)
  }
  return Http.get(`/v1/auth/permissions`)
}
