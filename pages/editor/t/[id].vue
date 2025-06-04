<template>
  <div class="edit">
    <el-empty :description="errorMsg" v-if="errorMsg" />
    <el-space direction="vertical" fill v-else>
      <div class="title">
        <el-input
          v-model="threadCmd.subject"
          placeholder="请输入标题，标题可以为空"
          maxlength="80"
          size="large"
          :show-word-limit="true"
        />
      </div>
      <EditorTinymce @update-content="updateContent" ref="tinymceEditor" />
    </el-space>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'editor'
})
import { getThreadForEdit } from '@/apis/thread'
const route = useRoute()
const threadCmd = useThreadCmd()
const threadId = Number(route.params.id)
const tinymceEditor = ref()
const errorMsg = ref()
threadCmd.value.threadId = threadId
// 获取帖子内容
getThreadForEdit(threadId)
  .then((res) => {
    const data = res.data
    threadCmd.value.subject = data.subject
    threadCmd.value.content = data.content
    threadCmd.value.forumId = data.forumId
    threadCmd.value.commentOrder = data.commentOrder
    tinymceEditor?.value?.initContent(res.data.content)
    errorMsg.value = ''
  })
  .catch((err) => {
    errorMsg.value = err
  })
const updateContent = (newContent: string) => {
  threadCmd.value.content = newContent
}
useSeoMeta({
  title: '编辑文章'
})
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
}
.edit {
  height: 100%;
  width: 100%;
  margin-top: 10px;
  justify-content: center;
  display: flex;
}
.editor {
  display: flex;
  max-width: 1360px;
}
</style>
