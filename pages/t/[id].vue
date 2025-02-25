<template>
  <el-card>
    <h1 class="article-title" v-if="thread.subject">
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          column-gap: 4px;
          margin-right: 8px;
        "
      >
        <el-tag type="success" v-if="thread.digest"> 精华 </el-tag>
      </div>
      {{ thread.subject }}
    </h1>
    <div class="article-info">
      <el-space wrap>
        <div class="author" @click="open(`/user/${thread.author?.authorId}`)">
          <el-link :underline="false">{{ thread.author?.authorName ?? 'unkown' }}</el-link>
        </div>
        <div>发布于 {{ thread.createTime }}</div>
        <div>阅读 {{ thread.views }}</div>
        <ClientOnly>
          <el-link
            :underline="false"
            :icon="Edit"
            @click="editThread"
            v-if="
              hasPermission('admin:thread:edit') ||
              (hasPermission('thread:edit') && user.userId === thread.author?.authorId)
            "
          />
        </ClientOnly>
      </el-space>
    </div>
    <div v-if="thread.updateAuthor" class="edit-info">
      本帖最后由 {{ thread.updateAuthor.authorName }} 于 {{ thread.updateTime }} 编辑
    </div>
    <el-alert
      v-if="thread.auditStatus === 1"
      title="当前帖子正在审核中，仅管理可见"
      type="warning"
      :closable="false"
    />
    <el-alert
      v-if="thread.auditStatus === 2"
      title="当前帖子审核不通过，仅管理可见"
      type="error"
      :closable="false"
    />
    <div class="article-content" v-html="processEmotions" @click="clickArticle($event)"></div>

    <!-- 关闭提示 -->
    <div v-if="thread.closed" class="closed-alert">
      <el-icon class="warning-icon"><Warning /></el-icon>
      <span>本帖已关闭，不再接受新回复</span>
    </div>
  </el-card>
  <thread-comment
    :threadId="thread.threadId"
    :forumId="thread.forumId"
    :authorId="thread.author?.authorId || 0"
    :order="thread.commentOrder"
    :disabled="thread.closed"
  />
  <common-image-viewer ref="imageViewer" />
  <el-backtop :bottom="50" />
</template>

<script setup lang="ts">
import { Edit, Warning } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'thread'
})

const imageViewer = ref()
const thread = useThread()
const { user } = useCurrentUser()
const { replaceEmotions } = useEmotions()

const { hasPermission } = await useUserAuth(thread.value.forumId)

useSeoMeta({
  title: thread.value.seoTitle,
  ogTitle: thread.value.seoTitle,
  description: thread.value.seoContent,
  ogDescription: thread.value.seoContent
})

const hasPreTag = computed(() => {
  return /<pre\b[^>]*>[\s\S]*<\/pre>/i.test(thread.value.content)
})
if (hasPreTag.value) {
  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: '/prismjs/themes/prism-tomorrow.css'
      },
      {
        rel: 'stylesheet',
        href: '/prismjs/plugins/toolbar/prism-toolbar.min.css'
      }
    ],
    script: [
      {
        src: '/prismjs/components/prism-core.min.js',
        tagPosition: 'bodyClose'
      },
      {
        src: '/prismjs/plugins/autoloader/prism-autoloader.min.js',
        tagPosition: 'bodyClose'
      },
      {
        src: '/prismjs/plugins/toolbar/prism-toolbar.min.js',
        tagPosition: 'bodyClose'
      },
      {
        src: '/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
        tagPosition: 'bodyClose'
      }
    ]
  })
}

const editThread = () => {
  navigateTo({
    path: '/editor/t/' + thread.value.threadId
  })
}

const open = (path: string) => {
  window.open(path, '_blank')
}

const clickArticle = (element: any) => {
  imageViewer.value.showImage(element, thread.value.content)
}

// 修改表情处理函数
const processEmotions = computed(() => {
  return replaceEmotions(thread.value.content)
})
</script>

<style lang="scss" scoped>
.article-title {
  margin: 0 0 13px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.4;
  color: #1d2129;
  overflow-wrap: break-word;
  display: flex;
}

.article-info {
  font-size: 14px;
  color: #8a919f;
  line-height: 24px;
  height: 24px;

  .author {
    color: #515767;

    :deep(.el-link) {
      font-weight: 500;

      &:hover {
        color: #1e80ff;
      }
    }
  }

  .el-icon {
    font-size: 16px;
  }
}

.article-content {
  max-width: 100%;
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.75;
  color: #333;

  :deep(code:not(pre code)) {
    background-color: #dfe0e1;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  }

  :deep(h2) {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 13px;
    color: #1d2129;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e6eb;
  }

  :deep(h3) {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 13px;
    color: #1d2129;
  }

  :deep(h4) {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 13px;
    color: #1d2129;
  }
}

:deep(img:not(.emotion-img)) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
  border-radius: 4px;
}

.el-alert {
  margin-top: 10px;

  &--warning {
    background-color: #fdf6ec;
    border: 1px solid #e6a23c;
  }

  &--error {
    background-color: #fef0f0;
    border: 1px solid #f56c6c;
  }
}

.edit-info {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 8px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}

.closed-alert {
  font-size: 12px;
  color: #f56c6c;
  justify-content: center;
  margin-top: 10px;
  padding-top: 6px;
  display: flex;
  align-items: center;
  gap: 3px;

  .warning-icon {
    font-size: 16px;
  }
}
</style>
