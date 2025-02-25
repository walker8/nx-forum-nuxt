<template>
  <el-container>
    <el-aside class="sidebar" :width="isCollapse ? '64px' : '200px'">
      <AdminSidebar :collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header style="padding: 0px">
        <admin-header @toggle-sidebar="isCollapse = !isCollapse" :is-collapse="isCollapse" />
      </el-header>
      <el-main class="forum-main">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
const isCollapse = ref(false)

useSeoMeta({
  title: '后台管理 - nx-forum'
})
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh; /* 设置容器高度为视口高度 */
  display: flex; /* 使用 Flexbox 布局 */
}

.sidebar {
  background-color: var(--v3-sidebar-menu-bg-color);
  transition: width 0.3s;
}
</style>
