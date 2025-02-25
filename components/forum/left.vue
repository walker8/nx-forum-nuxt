<template>
  <client-only>
    <div class="relative z-1000" ref="navbarRef">
      <div
        :class="{ 'fixed mt-5 top-0': isSticky, 'overflow-y-auto h-full': true }"
        style="width: 200px"
      >
        <el-menu :default-active="forumMenu.selctedMenu" class="el-menu-vertical-demo">
          <el-menu-item
            v-for="menu in forumMenu.menus"
            :index="menu.name"
            @click="goForum(menu.name)"
          >
            <el-icon size="16px" style="position: relative; top: 0px">
              <Icon :name="menu.iconName" />
            </el-icon>
            <span>{{ menu.nickName }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </client-only>
</template>
<script setup>
const forumMenu = useForumMenu()
const goForum = (path) => {
  navigateTo(`/f/${path}`)
}

const navbarRef = ref(null)
const isSticky = ref(false)

const handleScroll = () => {
  if (navbarRef.value) {
    const rect = navbarRef.value.getBoundingClientRect()
    isSticky.value = rect.top <= 0
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
