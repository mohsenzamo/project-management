<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ count }}
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { useCounterStore } from '@/store/index';
import { computed } from "vue";


export default {
  name: 'HomePage',

  components: {
    HelloWorld
  },

  setup() {
    const store = useCounterStore();

    return {
      count: computed(() => store.doubleCount),
      value: ''
    };
  }
}
</script>
