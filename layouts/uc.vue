<template>
  <el-container>
    <el-aside class="sidebar" :width="isCollapse ? '64px' : '200px'">
      <UcSidebar :collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header style="padding: 0px">
        <UcHeader @toggle-sidebar="isCollapse = !isCollapse" :is-collapse="isCollapse" />
      </el-header>
      <el-main class="uc-main">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
const isCollapse = ref(false)

useSeoMeta({
  title: '用户中心管理 - nx-forum'
})
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  background-color: var(--v3-sidebar-menu-bg-color);
  transition: width 0.3s;
}

.uc-main {
  padding: 20px;
  background-color: var(--v3-body-bg-color);
}
</style>
