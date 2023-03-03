<template>
    <nav class="bg-purple-500 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">حساب کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <Avatar icon="pi pi-user" class="" shape="circle" />
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'block absolute top-0 right-0 lg:static p-2.5 translate-x-0': sideBar, 'hidden p-0 translate-x-full': !sideBar }"
            class="sidebar w-56 lg:w-1/5 bg-white transition-all z-30 h-screen pt-16"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <RouterLink :to="{ name: 'UserPanel' }">
                <p
                    class="selected-sidebar flex items-center font-bold py-1.5 px-5 gap-3.5 rounded-sm shadow-sm mt-1 cursor-pointer">
                    <i class="home-icon pi pi-home text-lg"></i>
                    <span>داشبورد</span>
                </p>
            </RouterLink>
            <div class="divider-line mt-2.5"></div>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="flex flex-col justify-center items-center bg-white z-20 h-screen pt-14 overflow-y-scroll custom">
            <p class="text-xl mt-5 mr-3">تنظیمات حساب کاربری:</p>
            <Card class="w-full sm:w-9/12 md:w-2/5 border-t-0 sm:border-t-2 border-t-purple-400 p-5 mx-auto shadow-none sm:shadow-2xl rounded-xl mt-0 sm:mt-12">
                <template #header>
                    <label
                        class="w-24 h-24 flex flex-col justify-center items-center bg-white rounded-full tracking-wide border cursor-pointer overflow-hidden hover:text-light-blue mx-auto"
                        @mouseenter="hoverImage = true" @mouseleave="hoverImage = false">
                        <i class="pi pi-user text-3xl"></i>
                        <!-- <div class="w-full h-full relative">
                            <img src="../../../../project.png" class="w-full h-full" />
                            <div v-if="hoverImage"
                                class="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                <i class="pi pi-pencil text-white cursor-pointer" style="font-size: 1.2rem;"></i>
                            </div>
                        </div> -->
                        <input type='file' class="hidden" />
                    </label>
                </template>
                <template #content>
                    <form class="flex flex-col justify-center items-center gap-2.5">
                        <InputText type="text" placeholder="نام کاربری" class=" text-sm rounded-lg w-full" />
                        <InputText type="password" placeholder="رمز عبور" class=" text-sm rounded-lg w-full" />
                        <Button type="button" label="ثبت"
                            class="p-button-sm p-button-primary rounded-lg w-full text-sm font-bold" />
                    </form>
                </template>
                <template #footer>
                    <div class="flex justify-center gap-3">
                        <Avatar icon="pi pi-instagram" shape="circle"
                            class="cursor-pointer border border-red-400 bg-transparent text-red-400" />
                        <Avatar icon="pi pi-whatsapp" shape="circle"
                            class="cursor-pointer border border-green-400 bg-transparent text-green-400" />
                        <Avatar icon="pi pi-telegram" shape="circle"
                            class="cursor-pointer border border-blue-400 bg-transparent text-blue-400" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    name: 'UserProfile',

    components: {
        Button,
        Avatar,
        InputText,
        Card,
    },

    setup() {
        const sideBar = ref(true)
        const hoverImage = ref(false)

        return {
            sideBar,
            hoverImage
        }
    },
}
</script>

<style lang="scss">
.p-card {
    @apply font-yekan;

    .p-card-body {
        @apply w-full;
    }
}</style>

