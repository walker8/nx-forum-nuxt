<template>
  <el-card>
    <div v-if="thread.subject">
      <el-tag type="success" v-if="thread.digest" class="mr-1.5 mb-2.5"> 精华 </el-tag>
      <h1 class="article-title">{{ thread.subject }}</h1>
    </div>
    <div class="article-info">
      <el-space wrap>
        <div class="author" @click="open(`/user/${thread.author?.authorId}`)">
          <el-link underline="never">{{ thread.author?.authorName ?? 'unkown' }}</el-link>
        </div>
        <div>发布于 {{ thread.createTime }}</div>
        <div>阅读 {{ thread.views }}</div>
        <ClientOnly>
          <el-link
            underline="never"
            :icon="Edit"
            @click="editThread"
            v-if="
              hasPermission('admin:thread:edit') ||
              (hasPermission('thread:edit') && user.userId === thread.author?.authorId)
            "
          />
        </ClientOnly>
        <ClientOnly>
          <el-button v-if="user.userId" link type="danger" @click="onReport">
            举报
          </el-button>
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
import { useReport } from '~/composables/useReport'

definePageMeta({
  layout: 'thread'
})

const imageViewer = ref()
const thread = useThread()
const { user } = useCurrentUser()
const { replaceEmotions } = useEmotions()
const { openReportDialog } = useReport()

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

function onReport() {
  if (!thread.value)
    return
  openReportDialog(thread.value.threadId, 'THREAD', thread.value.forumId)
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
  font-size: 26px;
  font-weight: 600;
  line-height: 1.4;
  color: #1d2129;
  overflow-wrap: break-word;
  display: inline;
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
  /* 允许在单词内换行 */
  word-wrap: break-word;
  /* 单词可以在任意字符间断开 */
  word-break: break-word;
  /* 超出显示省略号 */
  white-space: normal;
  /* 保持所有文字在一个方块内 */
  overflow-wrap: break-word;

  :deep(code:not(pre code)) {
    background-color: #dfe0e1;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  }

  :deep(pre:not(:has(code))) {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    background-color: #f6f8fa;
    padding: 12px;
    border-radius: 4px;
    margin: 16px 0;
  }

  :deep(h2) {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    margin: 13px 0;
    color: #1d2129;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e6eb;
  }

  :deep(h3) {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    margin: 10px 0;
    color: #1d2129;
  }

  :deep(h4) {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin: 8px 0;
    color: #1d2129;
  }

  :deep(h5) {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    margin: 8px 0;
    color: #1d2129;
  }

  :deep(h6) {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    margin: 6px 0;
    color: #1d2129;
  }

  // 优化ol ul li的样式
  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
    margin: 12px 0;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(li) {
    margin-bottom: 8px;
    line-height: 1.6;
    position: relative;
  }

  :deep(ul ul),
  :deep(ol ul) {
    list-style-type: circle;
    margin: 8px 0 8px 16px;
  }

  :deep(ul ol),
  :deep(ol ol) {
    list-style-type: lower-alpha;
    margin: 8px 0 8px 16px;
  }

  :deep(ul ul ul),
  :deep(ol ul ul),
  :deep(ul ol ul),
  :deep(ol ol ul) {
    list-style-type: square;
  }

  :deep(ul ol ol),
  :deep(ol ol ol),
  :deep(ul ul ol),
  :deep(ol ul ol) {
    list-style-type: lower-roman;
  }

  // 优化 blockquote 样式
  :deep(blockquote) {
    margin: 16px 0;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-left: 4px solid #1e80ff;
    color: #5a6270;
    font-size: 15px;
    line-height: 1.7;
    border-radius: 0 4px 4px 0;
    position: relative;
    overflow: hidden;

    p {
      margin: 0;
      position: relative;
    }

    p:not(:last-child) {
      margin-bottom: 8px;
    }

    blockquote {
      margin-left: 16px;
      border-left-color: #409eff;
    }
  }

  // 优化表格样式
  :deep(table) {
    width: 100%;
    margin: 16px 0;
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    overflow-x: auto; // 在小屏幕上允许水平滚动

    th,
    td {
      border: 1px solid #e4e6eb;
      padding: 8px 12px;
      text-align: left;
      min-width: 120px; // 设置最小宽度防止内容挤压
    }

    th {
      background-color: #f6f8fa;
      font-weight: 600;
      color: #1d2129;
    }

    tr:nth-child(even) {
      background-color: #f9f9fa;
    }

    tr:hover {
      background-color: #f2f3f5;
    }

    // 移动端优化
    @media (max-width: 768px) {
      font-size: 14px;

      th,
      td {
        padding: 6px 8px;
        min-width: 100px;
      }
    }
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
