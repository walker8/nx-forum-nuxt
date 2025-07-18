<template>
  <el-form :model="threadCmd" label-width="80px">
    <el-form-item label="版块">
      <el-select
        v-if="menus?.length > 0"
        v-model="threadCmd.forumId"
        placeholder="请选择版块"
        :disabled="!menus?.length || (threadCmd.threadId !== undefined && threadCmd.threadId > 0)"
      >
        <el-option v-for="menu in menus" :label="menu.nickName" :value="menu.forumId" />
      </el-select>
      <el-text v-else>-</el-text>
      <div class="text-sm pt-1 text-gray-400" v-if="forumShortBrief">
        {{ forumShortBrief }}
      </div>
    </el-form-item>
    <el-form-item label="评论排序">
      <el-select v-model="threadCmd.commentOrder" placeholder="请选择排序">
        <el-option label="时间正序" :value="0" />
        <el-option label="时间倒序" :value="1" />
        <el-option label="热门排序" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <div style="display: flex; justify-content: flex-end; margin-left: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submitDisabled">
          {{
            isSubmitting
              ? threadCmd.threadId
                ? '更新中...'
                : '发布中...'
              : threadCmd.threadId
                ? submitDisabled
                  ? '禁止更新'
                  : '确认更新'
                : submitDisabled
                  ? '禁止发布'
                  : '确定发布'
          }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { getUserForumMenu } from '~/apis/forum'
import { createThread, updateThread } from '~/apis/thread'

const threadCmd = useThreadCmd()
const forumInfo = useForumInfo()
if (forumInfo?.value.forumId > 0) {
  threadCmd.value.forumId = forumInfo.value.forumId
}
const menus = useUserMenus()
getUserForumMenu().then((res) => {
  const data = res.data
  menus.value = data
  if (menus && menus.value.length > 0) {
    threadCmd.value.forumId =
      menus.value.find((menu) => menu.forumId === forumInfo.value.forumId)?.forumId ||
      menus.value[0].forumId
    useUserAuth(threadCmd.value.forumId)
  }
})
const forumShortBrief = computed(() => {
  return menus?.value.find((menu) => menu.forumId === threadCmd.value.forumId)?.shortBrief || ''
})
// 添加提交状态变量
const isSubmitting = ref(false)

// 提交按钮禁用状态
const submitDisabled = computed(() => {
  if (isSubmitting.value) {
    return true
  }
  if (threadCmd.value.threadId) {
    // 编辑
    return !hasPermission('thread:edit', threadCmd.value.forumId)
  } else {
    // 发帖
    return !hasPermission('thread:new', threadCmd.value.forumId)
  }
})
const getMenuNameById = (forumId: number) => {
  const menu = menus.value.find((menu) => menu.forumId === forumId)
  return menu ? menu.name : ''
}
const emits = defineEmits(['cancel'])
const cancel = () => {
  // 隐藏弹出框
  emits('cancel')
}

const onSubmit = () => {
  isSubmitting.value = true // 开始提交时设置为true

  if (threadCmd.value.threadId) {
    updateThread(threadCmd.value.threadId, threadCmd.value)
      .then((res) => {
        if (res.errCode === '0005') {
          ElMessage.warning(res.data)
          navigateTo({
            path: '/f/' + getMenuNameById(threadCmd.value.forumId)
          })
        } else {
          ElMessage.success(res.data)
          navigateTo({
            path: '/t/' + threadCmd.value.threadId
          })
        }
        threadCmd.value.content = ''
        threadCmd.value.subject = ''
      })
      .catch((err) => {
        ElMessage.error(err)
      })
      .finally(() => {
        isSubmitting.value = false // 完成后重置状态
        cancel()
      })
  } else {
    createThread(threadCmd.value)
      .then((res) => {
        if (res.errCode === '0005') {
          ElMessage.warning(res.data)
        } else {
          ElMessage.success(res.data)
        }
        navigateTo({
          path: '/f/' + getMenuNameById(threadCmd.value.forumId)
        })
        threadCmd.value.content = ''
        threadCmd.value.subject = ''
      })
      .catch((err) => {
        ElMessage.error(err)
      })
      .finally(() => {
        isSubmitting.value = false // 完成后重置状态
        cancel()
      })
  }
}
const { hasPermission } = await useUserAuth(threadCmd.value.forumId)
onMounted(() => {
  watch(
    () => threadCmd.value.forumId,
    () => {
      useUserAuth(threadCmd.value.forumId)
    }
  )
})
</script>
