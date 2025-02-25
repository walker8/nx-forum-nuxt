<template>
  <div class="h-screen flex flex-col">
    <div class="bg-white border-t border-gray-200 py-2.5 px-5 text-right">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
    </div>
    <div class="flex-1 bg-white p-5">
      <EditorTinymce
        ref="editorRef"
        @update-content="handleContentUpdate"
        :initial-content="content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPageContentByAdmin, updatePageContent } from '~/apis/custom-page'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const pageId = computed(() => Number(route.params.id))

const content = ref('')
const saving = ref(false)
const editorRef = ref()

const fetchContent = async () => {
  try {
    const res = await getPageContentByAdmin(pageId.value)
    content.value = res.data
    editorRef.value?.initContent(content.value)
  } catch (error) {
    console.error('获取内容失败', error)
  }
}

const handleContentUpdate = (newContent: string) => {
  content.value = newContent
}

const handleSave = async () => {
  try {
    saving.value = true
    await updatePageContent(pageId.value, content.value)
    ElMessage.success('内容保存成功')
    router.back()
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(fetchContent)
</script> 