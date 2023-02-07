<template>
  <div class="about">
    <h1>This is an about page</h1>

    <InputText type="text" v-model="value" />


  </div>
</template>

<script lang="ts">
import InputText from 'primevue/inputtext';


export default {
  name: 'AboutUs',

  components: {
    InputText
  },

  data() {
    return {
      value: '',
    }
  },

  methods: {
  }
}
</script>

