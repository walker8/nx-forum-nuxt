<template>
  <div class="w-67.5">
    <el-card v-if="forumInfo.brief" class="mb-4">
      <div class="text-gray-500 text-xs font-normal leading-6" v-html="forumInfo.brief" />
    </el-card>
    <el-card v-if="hotPosts.length >= 3" class="article-hot">
      <template #header>
        <div class="card-header flex items-center justify-between">
          <span>文章榜</span>
        </div>
      </template>
      <div class="hot-posts">
        <div
          v-for="(post, index) in hotPosts"
          :key="post.threadId"
          @click="go(`/t/${post.threadId}`)"
          class="post-item flex items-start py-2 px-3 hover:bg-gray-100 cursor-pointer"
        >
          <span class="rank-num mr-2" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
          <div class="post-title flex-1 text-sm text-gray-700 truncate">
            {{ post.subject }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { type Thread } from '~/types/global'
import { getHotPosts as getHotPostsApi } from '~/apis/thread'

const forumInfo = useForumInfo()

const hotPosts = ref<Thread[]>([])

const getHotPosts = async () => {
  try {
    const { data } = await getHotPostsApi({
      days: 7,
      limit: 8
    })
    hotPosts.value = data
  } catch (error) {
    console.error('获取热门文章失败:', error)
  }
}

const go = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  nextTick(() => {
    getHotPosts()
  })
})
</script>
