import { ElMessage } from 'element-plus'
import { getCurrentUser } from '~/apis/uc/user'
import { getAuthConfig, logout, type AuthConfigVO } from '~/apis/uc/login'
import type { ForumMenuItemVO, UserVO } from '~/types/global'
import { queryPermissions } from '~/apis/auth'

export const useUser = () =>
  useState<UserVO>('user', () => ({
    userId: 0,
    avatar: '',
    userName: '',
    intro: ''
  }))

export const useUserSettings = () =>
  useState('userSettings', () => ({
    selected: 'profile',
    settings: [
      {
        value: 'profile',
        label: '个人资料'
      },
      {
        value: 'account',
        label: '账号设置'
      }
    ]
  }))

export const useUserHome = () =>
  useState('userHome', () => ({
    selected: '',
    tabs: [
      {
        value: '',
        label: '文章'
      },
      {
        value: 'comment',
        label: '评论'
      },
      {
        value: 'favorite',
        label: '收藏'
      },
      {
        value: 'like',
        label: '点赞'
      }
    ]
  }))

export const useUserNotification = () =>
  useState('userNotification', () => ({
    selected: 'reply',
    tabs: [
      {
        value: 'reply',
        label: '评论消息',
        count: 'replyCount'
      },
      {
        value: 'mention',
        label: '@提醒',
        count: 'mentionCount'
      },
      {
        value: 'system',
        label: '系统消息',
        count: 'systemCount'
      }
    ]
  }))

export const useUserNotificationCount = () =>
  useState('userNotificationCount', () => ({
    replyCount: 0,
    systemCount: 0,
    mentionCount: 0,
    totalCount: 0
  }))

export const useUserMenus = () => useState<ForumMenuItemVO[]>('userMenus', () => [])

export const useUserInfo = () =>
  useState('userInfo', () => ({
    userId: 0,
    userName: '',
    avatar: '',
    intro: '',
    createTime: ''
  }))

let fetchPromise: Promise<void> | null = null
export function useCurrentUser() {
  const user = useUser()

  if (import.meta.client && !(user.value.userId && user.value.userId > 0)) {
    // 只在客户端执行代码 并且 userId 没有赋值
    nextTick(() => {
      const token = useCookie('x_token')
      if (token.value && !fetchPromise) {
        fetchPromise = getCurrentUser()
          .then((res) => {
            const data = res.data
            if (!data) {
              token.value = ''
            } else {
              user.value = { ...user.value, ...data }
              user.value.avatar = data.avatar || '/img/avatar.png'
            }
          })
          .finally(() => {
            fetchPromise = null
          })
      }
    })
  }

  const handleLogout = () => {
    showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })
      .then(async () => {
        // 用户点击确认
        try {
          await logout()
          // 清空用户信息
          user.value = {
            userId: 0,
            avatar: '',
            userName: '',
            intro: ''
          }
          // 清除token
          const token = useCookie('x_token')
          token.value = ''
          ElMessage.success('退出登录成功')
          // 跳转到首页
          navigateTo('/')
        } catch (error) {
          ElMessage.error('退出登录失败')
        }
      })
      .catch(() => {
        // 用户点击取消
      })
  }
  return { user, handleLogout }
}

export const useAuthConfig = async () => {
  const authConfig = useState<AuthConfigVO>('authConfig', () => ({
    loginConfig: undefined,
    registerConfig: undefined
  }))
  if (import.meta.client && !authConfig.value.loginConfig) {
    // 只在客户端执行代码 并且 loginConfig没有赋值
    await nextTick()
    let res = await getAuthConfig()
    authConfig.value = res.data
  }
  return authConfig
}

/**
 * 获取权限，仅在客户端执行（onMounted）
 * @param forumId 版块id
 * @returns
 */
export const useUserAuth = async (forumId: number = 0) => {
  const userAuth = useState('userAuth', () => ({
    permissionMap: new Map()
  }))
  // 获取用户权限
  if (!forumId || forumId < 10) {
    // 10 以下为系统板块
    forumId = 0
  }
  if (!userAuth.value.permissionMap.get(forumId)) {
    let res = await queryPermissions(forumId)
    userAuth.value.permissionMap.set(forumId, res.data)
  }
  const hasPermission = (permission: string, forumId: number = 0) => {
    if (!forumId || forumId < 10) {
      // 10 以下为系统板块
      forumId = 0
    }
    if (userAuth.value.permissionMap.get(forumId)?.includes(permission)) {
      return true
    }
    return false
  }
  return { userAuth, hasPermission }
}
