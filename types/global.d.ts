export interface ApiResponse<T = any> {
  success: boolean
  errCode?: string
  errMessage?: string
  data: T
}
export interface CustomPage<T> {
  records: T[]
  total: number
  size: number
  current: number
  hasNext: boolean
  errMsg: undefined | string
}

export interface Author {
  authorId: null | number
  authorName: null | string
  avatarUrl: null | string
  intro: null | string
  threads: null | number
  comments: null | number
  fans: null | number
  followed: boolean
}

export interface Thread {
  threadId: number
  forumId: number
  forumName: string
  forumNickName: string
  categoryId: number
  content: string
  comments: number
  subject: string
  top: boolean
  blocked: boolean
  closed: boolean
  digest: boolean
  author: null | Author
  createTime: string
  updateAuthor: null | Author
  updateTime: string
  docType: number
  views: number
  likes: number
  liked: boolean
  dislikes: number
  collections: number
  collected: boolean
  auditStatus: number
  commentOrder: number
  imageCount: number
  seoTitle: string
  seoContent: string
  brief?: string
  errMsg: undefined | string
}

export interface CommentVO {
  replies: null | []
  commentId: number
  replyCount: number
  images: string[]
  threadId: number
  threadTitle: string
  threadCommentCount: number
  likes: number
  message: string
  createTime: string
  updateTime: string | null
  authorId: number
  authorName: string
  avatarUrl: string
  loading?: boolean
  pageNo?: number | null | undefined
  liked?: boolean
  replies?: CommentReplyVO[]
}

export interface CommentReplyVO {
  /** 主评论ID */
  commentId: number
  /** 回复ID */
  replyId: number
  /** 主题帖ID */
  threadId: number
  /** 点赞数 */
  likes: number
  /** 是否已点赞 */
  liked: boolean
  /** 回复内容 */
  message: string
  /** 创建时间 */
  createTime: string
  /** 回复作者信息 */
  authorId: number
  authorName: string
  avatarUrl: string
  /** 被回复用户信息 */
  replyAuthorId: number | null
  replyAuthorName: string | null
  replyAvatarUrl: string | null
}

export interface ThreadCmd {
  threadId?: number
  forumId: number
  categoryId?: number
  content: string
  subject: string
}

export interface ForumInfo {
  forumId: number
  threadCount: number
  followCount: number
  shortBrief: string
  brief: string
  iconName: string
  seoTitle: string
  seoKeywords: string
  seoContent: string
  backgroundImage: string
}

export interface ForumMenuItemVO {
  forumId: number
  name: string
  nickName: string
  iconName: string
}

export interface UserVO {
  userId: number
  userName: string
  avatar?: string
  intro?: string
}

export interface NotificationVO {
  postId: number
  postTitle: string
  forumId: number
  forumName: string
  forumNickName: string
  notificationType: number | null
  notificationStatus: number | null
  subject: string | null
  message: string
  url: string | null
  authorId: number
  authorName: string
  createTime: string
}

export interface Query {
  pageNo: number
  pageSize: number
  orderBy?: string
}

// 角色相关类型
export interface RoleCreateCmd {
  roleName: string
  roleKey: string
  remark: string
  perms: string[]
  priority: number
}

export interface RoleUpdateCmd {
  roleId: number
  roleName: string
  remark: string
  roleStatus: number
  perms: string[]
  priority: number
}

// 权限相关类型
export interface PermissionCreateCmd {
  parentId: number
  permName: string
  perms: string
  remark: string
  permType: number
  permOrder: number
}

export interface PermissionUpdateCmd {
  permId: number
  parentId: number
  permName: string
  permStatus: number
  perms: string
  permType: number
  permOrder: number
  remark: string
}

// 用户角色相关类型
export interface UserRoleVO {
  userName: string
  roleKey: string
  roleScope: string
  createUserName: string
  expireTime: string
  createTime: string
}

export interface BanVO {
  id: number
  userId: number
  userName: string
  forumId?: number
  forumName?: string
  reason: string
  expireTime?: string
  createTime: string
  expired: boolean
}

export interface BanCreateCmd {
  userId: number
  forumId?: number
  reason: string
  expireTime?: string
}

// 补充LikeCmd类型
declare interface LikeCmd {
  targetType: number
  targetId: number
}
