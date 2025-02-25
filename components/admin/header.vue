<template>
  <div class="h-[55px] bg-white">
    <div class="flex items-center h-[55px] mx-auto max-w-full px-[10px]">
      <div class="cursor-pointer">
        <el-icon
          class="cursor-pointer text-[20px] mr-4 text-[#8a919f] hover:text-[var(--el-color-primary)]"
          @click="$emit('toggleSidebar')"
        >
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
      <div class="flex items-center justify-end w-full">
        <el-space wrap alignment="center" :size="10">
          <div class="cursor-pointer text-[#8a919f]" @click="goUserCenterAdmin">用户中心</div>
          <el-dropdown v-show="user.userName">
            <div class="cursor-pointer text-[#8a919f]">
              <el-badge
                :value="auditingCount.totalAuditCount"
                :max="99"
                class="item"
                :offset="[-6, 5]"
                :show-zero="false"
              >
                <el-icon :size="25"><BellFilled /></el-icon>
              </el-badge>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/admin/auditing/thread')">
                  待审核
                  <el-tag
                    type="danger"
                    effect="dark"
                    size="small"
                    class="ml-2"
                    v-if="auditingCount.totalAuditCount > 0"
                  >
                    {{ auditingCount.totalAuditCount }}
                  </el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown v-show="user.userName" class="ml-1">
            <div class="cursor-pointer text-[var(--el-color-primary)] flex items-center">
              <el-avatar :size="30" :src="user.avatar" />
              <div class="ml-1 text-base text-[#8a919f]">{{ user.userName }}</div>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/')">返回前台</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, BellFilled, Expand, Fold } from '@element-plus/icons-vue'
import { getAuditingCount } from '~/apis/admin'

interface Props {
  isCollapse?: boolean
}

defineProps<Props>()
defineEmits(['toggleSidebar'])

const auditingCount = useAuditingCount()
getAuditingCount(0).then((res) => {
  auditingCount.value = res.data
})

const { user } = useCurrentUser()
const go = (path: string) => {
  navigateTo(`${path}`)
}
const goUserCenterAdmin = () => {
  window.open('/uc/admin', '_blank')
}
</script>
