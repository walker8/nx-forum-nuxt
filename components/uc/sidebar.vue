<template>
  <div class="logo" v-show="!collapse">用户中心</div>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="1"
        :collapse="collapse"
        :unique-opened="true"
        :collapse-transition="false"
        class="el-menu-vertical"
        :class="{ 'mobile-menu': isMobile }"
      >
        <el-menu-item index="1" @click="handleMenuClick('/uc/admin')">
          <el-icon size="16px">
            <Icon name="tabler:layout-grid" />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2" @click="handleMenuClick('/uc/admin/users')">
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
          <el-menu-item index="3-1" @click="handleMenuClick('/uc/admin/login')">
            <el-icon>
              <Icon name="tabler:login" />
            </el-icon>
            <span>登录设置</span>
          </el-menu-item>
          <el-menu-item index="3-2" @click="handleMenuClick('/uc/admin/register')">
            <el-icon>
              <Icon name="tabler:user-cog" />
            </el-icon>
            <span>注册设置</span>
          </el-menu-item>
          <el-menu-item index="3-3" @click="handleMenuClick('/uc/admin/mail')">
            <el-icon>
              <Icon name="tabler:mail" />
            </el-icon>
            <span>邮件设置</span>
          </el-menu-item>
          <el-menu-item index="3-4" @click="handleMenuClick('/uc/admin/sms')">
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
          <el-menu-item index="4-1" @click="handleMenuClick('/uc/admin/roles')">
            <el-icon size="16px">
              <Icon name="tabler:user-cog" />
            </el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="4-2" @click="handleMenuClick('/uc/admin/permissions')">
            <el-icon size="16px">
              <Icon name="tabler:shield-check" />
            </el-icon>
            <span>权限管理</span>
          </el-menu-item>
          <el-menu-item index="4-3" @click="handleMenuClick('/uc/admin/role-users')">
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

const emit = defineEmits(['close-sidebar'])
const router = useRouter()

// 检测是否为移动端
const isMobile = ref(false)
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// 处理菜单点击事件
const handleMenuClick = (path: string) => {
  router.push(path)

  // 在移动端点击菜单项后自动收起侧边栏
  if (isMobile.value) {
    emit('close-sidebar')
  }
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
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

/* 移动端适配 */
@media (max-width: 768px) {
  .el-menu-item,
  :deep(.el-sub-menu__title) {
    height: 50px;
    line-height: 50px;
  }

  .logo {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }

  /* 移动端菜单样式 */
  .mobile-menu {
    .el-menu-item,
    :deep(.el-sub-menu__title) {
      padding-left: 15px !important;
    }

    .el-menu--inline .el-menu-item {
      padding-left: 30px !important;
    }
  }
}
</style>
