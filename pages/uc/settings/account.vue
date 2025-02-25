<template>
  <el-card>
    <el-form :model="account" label-width="auto" ref="formRef">
      <el-form-item prop="email" label="邮箱">
        <el-text>{{ account.email }}</el-text>
        <el-button type="primary" size="small" class="ml-2" @click="changeEmail">换绑</el-button>
      </el-form-item>
      <el-divider style="margin: 0px; margin-top: 8px" />
      <el-form-item prop="password" label="密码" class="mt-6">
        <el-text>{{ account.password }}</el-text>
        <el-button type="primary" size="small" class="ml-2" @click="changePassword">重置</el-button>
      </el-form-item>
      <el-divider style="margin: 0px; margin-top: 8px" />
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { getCurrentUserAccount } from '~/apis/uc/user'

definePageMeta({
  layout: 'user-setting'
})
useSeoMeta({
  title: '账号设置'
})
const account = reactive({
  email: '',
  phone: '',
  password: '***************'
})
getCurrentUserAccount().then((res) => {
  account.email = res.data.email
  account.password = res.data.password
})
const changeEmail = () => {
  ElMessage.warning('暂不支持')
}
const changePassword = () => {
  ElMessage.warning('暂不支持')
}
</script>
