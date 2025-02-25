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
            <div class="hidden-lg-and-up m-header" v-if="forumMenu.menus?.length > 0">
              <van-tabs
                v-model:active="forumMenu.selctedMenu"
                sticky
                shrink
                @click-tab="onClickTab"
              >
                <van-tab v-for="menu in forumMenu.menus" :title="menu.nickName" :name="menu.name" />
              </van-tabs>
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
const onClickTab = ({ name }) => {
  navigateTo(`/f/${name}`)
}
watch(
  () => route.params.id,
  (to) => {
    let forumName = ''
    if (to) {
      forumName = String(to)
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
<style lang="scss" scoped>
.common-layout {
  height: 100%;
  width: fit-content;
}
.m-header {
  width: 100%;
  margin-bottom: 5px;
}
.m-header .el-card {
  --el-card-padding: 10px;
}
.forum-main {
  padding-top: 0px;
  max-width: 720px;
}
@media screen and (max-width: 720px) {
  .common-layout {
    width: 100%;
  }
}
@media screen and (max-width: 960px) {
  .el-main {
    padding: 0px;
  }
  .forum-main {
    width: calc(100vw - 40px);
  }
}
@media screen and (min-width: 960px) {
  .forum-main {
    width: 720px;
  }
}
.forum-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 让容器至少占据整个视口高度 */
}
.content {
  flex-grow: 1; /* 让主要内容区域尽可能占据剩余空间 */
}
</style>
