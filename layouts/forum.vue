<template>
  <el-container class="forum-container">
    <div class="content">
      <el-header style="padding: 0px" class="hidden sm:block">
        <common-header />
      </el-header>
      <div class="common-layout mx-auto sm:mt-2">
        <el-container>
          <el-aside width="200px" class="hidden-md-and-down" v-if="forumMenu.menus?.length > 0">
            <ForumLeft />
          </el-aside>
          <el-main class="forum-main">
            <div class="hidden-lg-and-up m-header forum-menu" v-if="forumMenu.menus?.length > 0">
              <div class="w-full border-b border-gray-10 bg-white">
                <div class="flex overflow-x-auto no-scrollbar">
                  <button
                    v-for="menu in forumMenu.menus"
                    :key="menu.name"
                    :class="[
                      'px-3 py-2 text-sm font-normal whitespace-nowrap transition-colors duration-200 relative',
                      forumMenu.selctedMenu === menu.name
                        ? 'text-[#409eff] font-medium'
                        : 'text-gray-600 hover:text-gray-800'
                    ]"
                    @click="onClickTab({ name: menu.name })"
                  >
                    {{ menu.nickName }}
                    <div
                      v-if="forumMenu.selctedMenu === menu.name"
                      class="absolute bottom-0 left-0 w-full h-0.5 bg-[#409eff]"
                    ></div>
                  </button>
                </div>
              </div>
            </div>
            <slot />
          </el-main>
          <el-aside class="hidden-sm-and-down">
            <ForumRight />
          </el-aside>
        </el-container>
      </div>
    </div>
    <CommonFooter />
    <CommonTabbar />
  </el-container>
</template>
<script setup lang="ts">
import { getForumInfoByName, getForumShowMenu } from '~/apis/forum'
import { queryThreads, type ThreadQuery } from '~/apis/thread'
const forumPostPage = useForumPostPage()
const forumInfo = useForumInfo()
const forumMenu = useForumMenu()
const route = useRoute()
const user = useUser()

let threadQuery: ThreadQuery = {
  forumName: '',
  authorName: '',
  keyword: '',
  orderBy: 'last_comment_time',
  pageNo: 1,
  pageSize: 20
}
const queryForumThreads = (forumName: string) => {
  forumPostPage.value.errMsg = ''
  // 查询帖子列表
  threadQuery.forumName = forumName
  queryThreads(threadQuery)
    .then((res) => {
      // 获取列表成功
      let data = res.data
      forumPostPage.value = data
    })
    .catch(async (errMsg) => {
      // 获取列表失败
      if (import.meta.client) {
        forumPostPage.value.errMsg = String(errMsg)
        goLoginPage(forumInfo.value.forumId)
      }
    })
}

try {
  let res = await getForumShowMenu()
  const data = res.data
  forumMenu.value.selctedMenu = route.params.id || data.defaultForumName
  forumMenu.value.menus = data.records
  res = await getForumInfoByName(forumMenu.value.selctedMenu)
  forumInfo.value = res.data
  queryForumThreads(forumMenu.value.selctedMenu)
} catch (e) {
  forumPostPage.value.errMsg = String(e)
  if (import.meta.client) {
    setTimeout(() => {
      goLoginPage(forumInfo.value.forumId)
    }, 200)
  }
}
const onClickTab = ({ name }: { name: string }) => {
  if (name === 'all') {
    navigateTo('/all')
  } else {
    navigateTo(`/f/${name}`)
  }
}
watch(
  () => route.params.id,
  (to) => {
    let forumName = ''
    if (to) {
      forumName = String(to)
      forumMenu.value.selctedMenu = forumName
    }
    getForumInfoByName(forumName).then((res) => {
      forumInfo.value = res.data
    })
    queryForumThreads(forumName)
  },
  { flush: 'pre', immediate: false, deep: true }
)

/**
 * 没有访问论坛权限并且未登录转跳登录页面
 * @param forumId
 */
const goLoginPage = async (forumId: number) => {
  const { hasPermission } = await useUserAuth(forumId)
  if (!hasPermission('forum:visit', forumId)) {
    if (!user.value.userId || user.value.userId === 0) {
      navigateTo('/uc/login')
    }
  }
}
onMounted(() => {
  nextTick(() => {
    goLoginPage(forumInfo.value.forumId)
  })
  watch(
    () => forumInfo.value.forumId,
    (to) => {
      let forumId = 0
      if (to) {
        forumId = Number(to)
      }
      goLoginPage(forumId)
    },
    { flush: 'pre', immediate: false, deep: true }
  )
})
</script>
