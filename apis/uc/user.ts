import Http from '../../utils/request'

export type UserQuery = {
  userId?: number
  userName?: string
  loginIp?: string
  orderBy?: string
  pageNo: number
  pageSize: number
}

export type UserCmd = {
  /**
   * 用户ID。
   */
  userId?: number

  /**
   * 用户名。
   */
  userName?: string

  /**
   * 邮箱。
   */
  email?: string

  /**
   * 手机号码。
   */
  phone?: string

  /**
   * 密码。
   */
  password?: string

  /**
   * 验证码。
   */
  verifyCode?: string

  /**
   * 头像。
   */
  avatar?: string

  /**
   * 个人介绍。
   */
  intro?: string
}

export const getCurrentUser = () => {
  return Http.get(`/v1/uc/users/current`)
}

export const getUserInfo = (userId: number) => {
  return Http.get(`/v1/uc/users/${userId}/info`)
}

export const updateCurrentUser = (user: UserCmd) => {
  return Http.put(`/v1/uc/users/current`, user)
}

export const getCurrentUserAccount = () => {
  return Http.get(`/v1/uc/users/current/account`)
}

export const queryUsersByAdmin = (query: UserQuery) => {
  return Http.get(`/v1/uc/admin/users`, query)
}

export const saveUserByAdmin = (userCmd: UserCmd) => {
  return Http.post(`/v1/uc/admin/users`, userCmd)
}

export interface RegisterParams {
  userName: string
  phone?: string
  email?: string
  verifyCode: string
  password: string
}

export const register = (data: RegisterParams) => {
  return Http.post('/v1/uc/users', data)
}

export const updateUserByAdmin = (userCmd: UserCmd) => {
  return Http.put(`/v1/uc/admin/users`, userCmd)
}

export const deleteUserByAdmin = (userId: number) => {
  return Http.put(`/v1/uc/admin/users/${userId}/delete`)
}

export const deleteUsersByAdmin = (userIds: number[]) => {
  return Http.put(`/v1/uc/admin/users/batch/delete`, userIds)
}

// 用户搜索接口
export function queryUsername(name: string) {
  return Http.get(`/v1/uc/users/username/${name}`)
}
