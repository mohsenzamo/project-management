<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page" mode="out-in">
      <div :key="route.path">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

body {
  margin: 0;
  padding: 0;
}
</style>
