<template>
  <el-container>
    <el-header style="padding: 0px">
      <common-header />
    </el-header>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px" class="hidden-md-and-down">
          <el-menu :default-active="userSettings.selected" class="el-menu-vertical-demo">
            <el-menu-item
              v-for="menu in userSettings.settings"
              :index="menu.value"
              @click="goUserSettings(menu.value)"
            >
              <span>{{ menu.label }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="forum-main">
          <div class="hidden-lg-and-up m-header">
            <van-tabs v-model:active="userSettings.selected" sticky shrink @click-tab="onClickTab">
              <van-tab
                v-for="menu in userSettings.settings"
                :title="menu.label"
                :name="menu.value"
              />
            </van-tabs>
          </div>
          <slot />
        </el-main>
      </el-container>
    </div>
  </el-container>
</template>
<script setup lang="ts">
const route = useRoute()
const userSettings = useUserSettings()
if (route.path.endsWith('account')) {
  userSettings.value.selected = 'account'
} else {
  userSettings.value.selected = ''
}
const onClickTab = ({ name }) => {
  goUserSettings(name)
}
const goUserSettings = (name: string) => {
  navigateTo(`/uc/settings/${name}`)
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
</style>
