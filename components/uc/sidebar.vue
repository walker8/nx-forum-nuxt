<template>
  <div class="logo" v-show="!collapse">用户中心</div>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="1"
        :collapse="collapse"
        :unique-opened="true"
        :collapse-transition="false"
      >
        <el-menu-item index="1" @click="go('/uc/admin')">
          <el-icon size="16px">
            <Icon name="tabler:layout-grid" />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2" @click="go('/uc/admin/users')">
          <el-icon size="16px">
            <Icon name="tabler:users" />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-sub-menu index="3">
          <template #title>
            <el-icon size="16px">
              <Icon name="tabler:user-plus" />
            </el-icon>
            <span>登录注册</span>
          </template>
          <el-menu-item index="3-1" @click="go('/uc/admin/login')">
            <el-icon>
              <Icon name="tabler:login" />
            </el-icon>
            <span>登录设置</span>
          </el-menu-item>
          <el-menu-item index="3-2" @click="go('/uc/admin/register')">
            <el-icon>
              <Icon name="tabler:user-cog" />
            </el-icon>
            <span>注册设置</span>
          </el-menu-item>
          <el-menu-item index="3-3" @click="go('/uc/admin/mail')">
            <el-icon>
              <Icon name="tabler:mail" />
            </el-icon>
            <span>邮件设置</span>
          </el-menu-item>
          <el-menu-item index="3-4" @click="go('/uc/admin/sms')">
            <el-icon>
              <Icon name="tabler:message" />
            </el-icon>
            <span>短信设置</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon size="16px">
              <Icon name="tabler:settings" />
            </el-icon>
            <span>角色权限</span>
          </template>
          <el-menu-item index="4-1" @click="go('/uc/admin/roles')">
            <el-icon size="16px">
              <Icon name="tabler:user-cog" />
            </el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="4-2" @click="go('/uc/admin/permissions')">
            <el-icon size="16px">
              <Icon name="tabler:shield-check" />
            </el-icon>
            <span>权限管理</span>
          </el-menu-item>
          <el-menu-item index="4-3" @click="go('/uc/admin/role-users')">
            <el-icon size="16px">
              <Icon name="tabler:shield-check" />
            </el-icon>
            <span>角色查询</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false
})

const go = (path: string) => {
  navigateTo(path)
}
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: 101%;
  :deep(.scrollbar-wrapper) {
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      display: none;
    }
    &.is-vertical {
      display: block;
    }
  }
}

:deep(.scrollbar-wrapper) {
  --el-menu-bg-color: var(--v3-sidebar-menu-bg-color);
  --el-menu-text-color: var(--v3-sidebar-menu-text-color);
  --el-menu-active-color: var(--v3-sidebar-menu-active-text-color);
  --el-menu-hover-bg-color: var(--v3-sidebar-menu-hover-bg-color);
}

.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
}

.logo {
  width: 100%;
  height: 60px;
  font-size: large;
  line-height: 60px;
  text-align: center;
  color: white;
}
</style>
