<template>
  <div class="new">
    <el-space direction="vertical" fill class="editor">
      <div class="title">
        <el-input
          v-model="threadCmd.subject"
          placeholder="请输入标题，标题可以为空"
          maxlength="80"
          size="large"
          :show-word-limit="true"
        />
      </div>
      <EditorTinymce @update-content="updateContent" />
    </el-space>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'editor'
})
const threadCmd = useThreadCmd()
threadCmd.value.threadId = 0
threadCmd.value.forumId = 0
const updateContent = (newContent: string) => {
  threadCmd.value.content = newContent
}

useSeoMeta({
  title: '新建文章'
})
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
}
.new {
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
@media screen and (max-width: 960px) {
  .editor {
    width: 100%;
  }
}
</style>
