<template>
    <div
        class="w-fit h-fit bg-red-200 rounded-xl shadow-2xl absolute top-16 left-2 p-6 z-50">
        <slot />
        <button class="absolute top-2 left-3 text-xl" @click="$emit('close')">
            <i class="pi pi-times" style="font-size: 1rem"></i>
        </button>
    </div>
</template>
  
<script lang="ts">

export default {
    name: 'errorMassege',
}
</script>
  
<style>
.error-enter-from {
    opacity: 0;
}

.error-enter-to {
    opacity: 1;
}

.error-enter-to {
    transition: all .5s ease;
}

.error-leave-from {
    opacity: 1;
}

.error-leave-to {
    opacity: 0;
}

.error-leave-active {
    transition: all .5s ease;
}
</style>
  