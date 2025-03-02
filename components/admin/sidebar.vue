<template>
  <div class="logo" v-show="!collapse">后台管理</div>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeIndex"
        :collapse="collapse"
        :unique-opened="true"
        :collapse-transition="false"
      >
        <el-menu-item index="0" @click="go('/admin')">
          <el-icon size="16px">
            <Icon name="tabler:layout-grid" />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="1" v-if="hasPermission('admin:system')">
          <template #title>
            <el-icon size="16px">
              <Icon name="tabler:settings" />
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item
            index="1-0"
            @click="go('/admin/base')"
            v-if="hasPermission('admin:system:basic')"
          >
            <el-icon><Icon name="tabler:settings-filled" /></el-icon>
            <span>基本设置</span>
          </el-menu-item>
          <el-menu-item
            index="1-3"
            @click="go('/admin/forum')"
            v-if="hasPermission('admin:system:forum')"
          >
            <el-icon><Icon name="tabler:grid-dots" /></el-icon>
            <span>版块管理</span>
          </el-menu-item>
          <el-menu-item
            index="1-4"
            @click="go('/admin/audit')"
            v-if="hasPermission('admin:system:audit')"
          >
            <template #title>
              <el-icon size="16px">
                <Icon name="tabler:shield-check" />
              </el-icon>
              <span>审核设置</span>
            </template>
          </el-menu-item>
          <el-menu-item
            index="1-6"
            @click="go('/admin/image')"
            v-if="hasPermission('admin:system:image')"
          >
            <template #title>
              <el-icon size="16px">
                <Icon name="tabler:photo" />
              </el-icon>
              <span>图片管理</span>
            </template>
          </el-menu-item>
          <el-menu-item
            index="1-5"
            @click="go('/admin/custom-page')"
            v-if="hasPermission('admin:system:page')"
          >
            <template #title>
              <el-icon size="16px">
                <Icon name="tabler:file-text" />
              </el-icon>
              <span>自定义页面</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2" v-if="hasPermission('admin:thread')">
          <template #title>
            <el-icon size="16px">
              <Icon name="tabler:article" />
            </el-icon>
            <span>帖子管理</span>
          </template>
          <el-sub-menu index="2-0">
            <template #title>
              <el-icon><Icon name="tabler:circle-check" /></el-icon>
              <span>已通过</span>
            </template>
            <el-menu-item
              index="2-0-0"
              @click="go('/admin/passed/thread')"
              v-if="hasPermission('admin:thread:search')"
            >
              主题帖
            </el-menu-item>
            <el-menu-item
              index="2-0-1"
              @click="go('/admin/passed/comment')"
              v-if="hasPermission('admin:comment:search')"
            >
              评论
            </el-menu-item>
            <el-menu-item
              index="2-0-2"
              @click="go('/admin/passed/reply')"
              v-if="hasPermission('admin:comment:search')"
            >
              楼中楼
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-1">
            <template #title>
              <el-icon><Icon name="tabler:clock" /></el-icon>
              <span>审核中</span>
              <van-tag
                round
                type="danger"
                style="margin-left: 5px"
                v-if="auditingCount?.totalAuditCount > 0"
              >
                {{ auditingCount?.totalAuditCount }}
              </van-tag>
            </template>
            <el-menu-item
              index="2-1-0"
              @click="go('/admin/auditing/thread')"
              v-if="hasPermission('admin:thread:search')"
            >
              主题帖
              <van-tag
                round
                type="danger"
                style="margin-left: 5px"
                v-if="auditingCount?.threadAuditCount > 0"
              >
                {{ auditingCount?.threadAuditCount }}
              </van-tag>
            </el-menu-item>
            <el-menu-item
              index="2-1-1"
              @click="go('/admin/auditing/comment')"
              v-if="hasPermission('admin:comment:search')"
            >
              评论
              <van-tag
                round
                type="danger"
                style="margin-left: 5px"
                v-if="auditingCount?.commentAuditCount > 0"
              >
                {{ auditingCount?.commentAuditCount }}
              </van-tag>
            </el-menu-item>
            <el-menu-item
              index="2-1-2"
              @click="go('/admin/auditing/reply')"
              v-if="hasPermission('admin:comment:search')"
            >
              楼中楼
              <van-tag
                round
                type="danger"
                style="margin-left: 5px"
                v-if="auditingCount.replyAuditCount > 0"
              >
                {{ auditingCount.replyAuditCount }}
              </van-tag>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-2">
            <template #title>
              <el-icon><Icon name="tabler:trash" /></el-icon>
              <span>回收站</span>
            </template>
            <el-menu-item
              index="2-2-0"
              @click="go('/admin/recycle/thread')"
              v-if="hasPermission('admin:thread:search')"
              >主题帖
            </el-menu-item>
            <el-menu-item
              index="2-2-1"
              @click="go('/admin/recycle/comment')"
              v-if="hasPermission('admin:comment:search')"
            >
              评论
            </el-menu-item>
            <el-menu-item
              index="2-2-2"
              @click="go('/admin/recycle/reply')"
              v-if="hasPermission('admin:comment:search')"
            >
              楼中楼
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><Icon name="tabler:users" /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="3-1" @click="go('/admin/ban')"> 小黑屋 </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  collapse?: boolean
}

// 定义props，设置默认值为true
const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const go = (path: string) => {
  navigateTo(`${path}`)
}

const auditingCount = useAuditingCount()

const route = useRoute()
const { hasPermission } = await useUserAuth()
if (!hasPermission('admin:manage')) {
  navigateTo('/')
}
// 创建路由到index的映射表
const routeIndexMap: Record<string, string> = {
  '/admin': '0',
  '/admin/base': '1-0',
  '/admin/forum': '1-3',
  '/admin/audit': '1-4',
  '/admin/image': '1-6',
  '/admin/custom-page': '1-5',
  '/admin/passed/thread': '2-0-0',
  '/admin/passed/comment': '2-0-1',
  '/admin/passed/reply': '2-0-2',
  '/admin/auditing/thread': '2-1-0',
  '/admin/auditing/comment': '2-1-1',
  '/admin/auditing/reply': '2-1-2',
  '/admin/recycle/thread': '2-2-0',
  '/admin/recycle/comment': '2-2-1',
  '/admin/recycle/reply': '2-2-2',
  '/admin/ban': '3-1'
}

// 优化后的计算属性（处理Nuxt3的动态路由）
const activeIndex = computed(() => {
  // 使用path匹配基础路由
  const basePath = route.path.replace(/\/$/, '') // 移除结尾的斜杠
  const matchedKey = Object.keys(routeIndexMap)
    .sort((a, b) => b.length - a.length) // 优先匹配更长路径
    .find((key) => basePath.startsWith(key))

  return matchedKey ? routeIndexMap[matchedKey as keyof typeof routeIndexMap] : '0'
})
</script>

<style lang="scss" scoped>
.el-scrollbar {
  // 多 1% 是为了在顶部模式时防止垂直滚动
  height: 101%;
  :deep(.scrollbar-wrapper) {
    // 限制水平宽度
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
    &.is-vertical {
      // 当为顶部模式时隐藏垂直滚动条
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
  .el-menu-item, :deep(.el-sub-menu__title) {
    height: 50px;
    line-height: 50px;
  }
  
  .logo {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
}
</style>
