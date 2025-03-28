<template>
  <el-card class="thread-list pb-4">
    <div v-if="loading" class="pt-5 pl-3 pr-3">
      <el-skeleton :rows="2" animated />
    </div>
    <div v-else-if="forumPostPage.errMsg">
      <el-empty :description="forumPostPage.errMsg" />
    </div>
    <div v-else>
      <el-empty description="暂无内容" v-if="forumPostPage.records?.length === 0" />
      <div
        v-for="thread in forumPostPage.records"
        class="hover:bg-[#f2f3f5] pl-2 pr-2 sm:pl-5 sm:pr-5 pt-3"
      >
        <a :href="`/t/${thread.threadId}`" target="_blank">
          <div class="flex gap-1.5" v-if="thread.subject">
            <div style="color: #252933; font-size: 16px; font-weight: 600; line-height: 24px">
              <el-text type="primary" style="margin-right: 6px" v-if="thread.top">置顶</el-text>
              <el-tag type="success" class="mr-1.5" size="small" effect="dark" v-if="thread.digest">
                精华
              </el-tag>
              <el-tag type="warning" class="mr-1.5" size="small" effect="dark" v-if="thread.closed">
                关闭
              </el-tag>
              {{ thread.subject }}
            </div>
          </div>
          <div v-if="thread.brief">
            <el-text line-clamp="1" style="color: #8a919f; font-size: 13px; line-height: 22px">
              {{ thread.brief }}
            </el-text>
          </div>
        </a>
        <div style="color: #8a919f; font-size: 13px; line-height: 22px">
          <div class="flex flex-wrap gap-2 items-center">
            <el-tag
              type="info"
              size="small"
              class="cursor-pointer hover:text-[#409eff] hover:bg-sky-100"
              @click.stop="goForum(thread.forumName)"
            >
              {{ thread.forumNickName }}
            </el-tag>
            <div
              class="max-w-25 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-[#409eff]"
              @click.stop="goUserHome(thread.authorId)"
            >
              {{ thread.authorName }}
            </div>
            <div class="flex items-center justify-center">
              <el-icon>
                <ChatDotRound />
              </el-icon>
              <div style="margin-left: 2px">{{ thread.comments }}</div>
            </div>
            <div class="flex items-center justify-center">
              <el-icon>
                <Icon name="tabler:thumb-up" />
              </el-icon>
              <div style="margin-left: 2px">{{ thread.likes }}</div>
            </div>
            <div class="text-gray-200">|</div>
            <div>{{ thread.createTime }}</div>
          </div>
        </div>
        <el-divider style="margin: 0px; margin-top: 8px" />
      </div>
      <common-load-more
        :has-next="forumPostPage.hasNext"
        :disable-load-more="disableLoadMore"
        @load-more="loadMoreThreads"
        class="mr-4 ml-4 pt-1"
      >
        加载更多内容
      </common-load-more>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ChatDotRound } from '@element-plus/icons-vue'
import type { Thread } from '~/types/global'

const props = defineProps({
  disableLoadMore: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  forumPostPage: {
    type: Object,
    default: () => {
      return {
        records: [],
        hasNext: false,
        total: 0,
        current: 0,
        size: 0,
        errMsg: undefined
      }
    }
  }
})

const emits = defineEmits(['loadMoreThreads'])
const loadMoreThreads = () => {
  emits('loadMoreThreads')
}
const clickThread = (thread: Thread) => {
  if (thread?.threadId) {
    window.open('/t/' + thread.threadId, '_blank')
  }
}
const goUserHome = (userId: number) => {
  window.open(`/user/${userId}`, '_blank')
}
const goForum = (forumName: string) => {
  navigateTo(`/f/${forumName}`)
}
</script>
