<template>
  <el-card class="mb-4 author-card">
    <template #header>
      <div class="flex items-center">
        <span>作者信息</span>
      </div>
    </template>
    <div class="p-4">
      <div class="flex gap-4 mb-4 items-center">
        <div class="flex-shrink-0">
          <el-avatar :size="60" :src="author?.avatarUrl || '/img/avatar.png'" />
        </div>
        <div class="flex-1">
          <div class="text-base font-bold text-[#373a40] hover:text-[#409eff] cursor-pointer">
            {{ author?.authorName }}
          </div>
          <div class="text-sm text-gray-600 line-clamp-2">
            {{ author?.intro || '暂无介绍' }}
          </div>
        </div>
      </div>
      <div class="flex justify-around py-2.5 mb-4 border-t border-b border-gray-100">
        <div class="text-center">
          <div class="text-base font-bold text-gray-800">
            {{ author?.threads || 0 }}
          </div>
          <div class="text-xs text-gray-600 mt-0.5">文章</div>
        </div>
        <div class="text-center">
          <div class="text-base font-bold text-gray-800">
            {{ author?.comments || 0 }}
          </div>
          <div class="text-xs text-gray-600 mt-0.5">评论</div>
        </div>
        <div class="text-center">
          <div class="text-base font-bold text-gray-800">
            {{ author?.fans || 0 }}
          </div>
          <div class="text-xs text-gray-600 mt-0.5">粉丝</div>
        </div>
      </div>
      <div class="flex gap-2.5">
        <el-button type="primary" class="flex-1 h-8">关注</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Author } from '~/types/global'

defineProps<{
  author?: Author
}>()

const open = (url: string) => {
  window.open(url, '_blank')
}
</script>
