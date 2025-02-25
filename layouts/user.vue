<template>
  <el-container>
    <el-header style="padding: 0px">
      <common-header />
    </el-header>
    <div class="common-layout">
      <div class="error-page" v-if="errorMsg">
        <el-empty :description="errorMsg" />
      </div>
      <div class="success-page" v-else>
        <el-card class="user-header">
          <el-space>
            <el-avatar
              :src="userInfo.avatar"
              style="margin-right: 10px"
              shape="square"
              :size="100"
            />
            <div class="user-info">
              <el-text class="user-name" :line-clamp="1">
                {{ userInfo.userName }}
              </el-text>
              <el-text type="info" :line-clamp="2" class="user-intro">
                {{ userInfo.intro }}
              </el-text>
              <el-text type="info" :line-clamp="1" class="user-time">
                注册于 {{ userInfo.createTime }}
              </el-text>
            </div>
          </el-space>
        </el-card>
        <el-container>
          <el-aside width="200px" class="hidden-md-and-down">
            <el-menu :default-active="userHome.selected" class="el-menu-vertical-demo">
              <el-menu-item
                v-for="menu in userHome.tabs"
                :index="menu.value"
                @click="goUserTabs(menu.value)"
              >
                <span>{{ menu.label }}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="forum-main">
            <div class="hidden-lg-and-up m-header">
              <van-tabs v-model:active="userHome.selected" sticky shrink @click-tab="onClickTab">
                <van-tab v-for="menu in userHome.tabs" :title="menu.label" :name="menu.value" />
              </van-tabs>
            </div>
            <slot />
          </el-main>
        </el-container>
      </div>
    </div>
  </el-container>
</template>
<script setup lang="ts">
import { getUserInfo } from '~/apis/uc/user'

const route = useRoute()
const userHome = useUserHome()
if (route.path.endsWith('comment')) {
  userHome.value.selected = 'comment'
} else if (route.path.endsWith('like')) {
  userHome.value.selected = 'like'
} else if (route.path.endsWith('favorite')) {
  userHome.value.selected = 'favorite'
} else {
  userHome.value.selected = ''
}
const userInfo = useUserInfo()
const errorMsg = ref('')
watch(
  () => route.params.userId,
  (to) => {
    // navigateTo 获取不到路由参数，需要通过userInfo传进来
    let userId = Number(to || userInfo.value.userId)
    if (isNaN(userId) || userId <= 0) {
      errorMsg.value = '用户不存在'
    } else {
      getUserInfo(userId)
        .then((res) => {
          const data = res.data
          userInfo.value = data
          userInfo.value.avatar = userInfo.value.avatar || '/img/avatar.png'
        })
        .catch((err) => {
          errorMsg.value = err
        })
    }
  },
  { flush: 'pre', immediate: true, deep: true }
)
const onClickTab = ({ name }) => {
  goUserTabs(name)
}
const goUserTabs = (name: string) => {
  userHome.value.selected = name
  if (name) {
    navigateTo(`/user/${userInfo.value.userId}/${name}`)
  } else {
    navigateTo(`/user/${userInfo.value.userId}`)
  }
}
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100%;
  width: fit-content;
  margin: 0 auto;
  margin-top: 10px;
}
.m-header {
  width: 100%;
  margin-bottom: 5px;
}
.m-header .el-card {
  --el-card-padding: 10px;
}
.user-header {
  margin-right: 20px;
  margin-bottom: 20px;
}
.user-name {
  font-size: 24px;
  color: black;
}
.user-name,
.user-intro,
.user-time {
  display: block;
}
.user-time {
  margin-top: 5px;
}
.forum-main {
  padding-top: 0px;
  max-width: 720px;
}
@media screen and (max-width: 1200px) {
  .user-header {
    margin-left: 0px;
    max-width: 720px;
  }
  .el-main {
    --el-main-padding: 0px;
  }
}
@media screen and (max-width: 960px) {
  .el-main {
    padding: 0px;
  }
  .forum-main {
    width: calc(100vw - 40px);
  }
  .user-header {
    margin-left: 0px;
    margin-right: 0px;
  }
}
@media screen and (max-width: 720px) {
  .common-layout {
    width: 100%;
  }
}
@media screen and (min-width: 960px) {
  .forum-main {
    width: 720px;
  }
}
</style>
