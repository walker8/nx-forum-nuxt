import type { CustomPage, ForumInfo, Thread } from '~/types/global'

export const useForumPostPage = () =>
  useState<CustomPage<Thread>>('forumPostPage', () => ({
    total: 0,
    size: 0,
    current: 0,
    hasNext: false,
    errMsg: '',
    records: []
  }))

export const useForumInfo = () =>
  useState<ForumInfo>('forumInfo', () => ({
    threadCount: 0,
    followCount: 0,
    shortBrief: '',
    brief: '',
    iconName: '',
    seoTitle: '',
    seoKeywords: '',
    seoContent: '',
    backgroundImage: '',
    forumId: 0
  }))

export const useForumMenu = () =>
  useState('forumMenu', () => ({
    selctedMenu: '',
    menus: []
  }))
