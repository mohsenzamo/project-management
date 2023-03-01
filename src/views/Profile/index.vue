<template>
    <nav class="bg-purple-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">حساب کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <Avatar icon="pi pi-user" class="" shape="circle" />
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'w-1/5 p-4 translate-x-0': sideBar, 'w-0 p-0 translate-x-full': !sideBar }"
            class="w-1/5 bg-white transition-all z-20 h-screen pt-20" style="box-shadow: .3em 0 .3em .4em #ccc">
            <RouterLink :to="{ name: 'UserPanel' }">
                <p
                    class="flex items-center hover:bg-gray-400 hover:text-white hover:font-bold p-2 gap-3 rounded-sm cursor-pointer hover:shadow-sm">
                    <i class="pi pi-home text-red-600" style="font-size: 1rem;"></i>
                    <span>داشبورد</span>
                </p>
            </RouterLink>
            <hr class="bg-light-blue border-none mt-4" style="height: .1rem;" />
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <p class="text-xl mt-5 mr-3">تنظیمات حساب کاربری:</p>
            <Card class="w-2/5 p-5 mx-auto mt-28">
                <template #header>
                    <label
                        class="w-40 flex flex-col items-center bg-white rounded-lg tracking-wide border cursor-pointer hover:text-light-blue mx-auto"
                        @mouseenter="hoverImage = true" @mouseleave="hoverImage = false">
                        <i class="pi pi-user m-10 text-3xl"></i>
                        <!-- <div class="w-100 h-100 relative">
                            <img src="../../../../project.png" class="w-full h-auto" />
                            <div v-if="hoverImage"
                                class="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                <i class="pi pi-pencil text-white cursor-pointer" style="font-size: 1.2rem;"></i>
                            </div>
                        </div> -->
                        <input type='file' class="hidden" />
                    </label>
                </template>
                <template #content>
                    <div class="my-2">
                        <InputText type="text" placeholder="نام کاربری" class="h-10 w-full" />
                    </div>
                    <div class="my-2">
                        <InputText type="password" placeholder="رمز عبور" class="h-10 w-full" />
                    </div>
                    <div>
                        <Button label="ثبت" class="p-button-sm p-button-success w-16 h-8" />
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-between gap-3">
                        <Button class="p-0 w-32" aria-label="Youtube">
                            <i class="pi pi-telegram px-2"></i>
                            <span class="px-4">تلگرام</span>
                        </Button>
                        <Button class="p-0 w-32 p-button-success" aria-label="Youtube">
                            <i class="pi pi-whatsapp px-2"></i>
                            <span class="px-3">واتساپ</span>
                        </Button>
                        <Button class="p-0 w-32 p-button-danger" aria-label="Youtube">
                            <i class="pi pi-instagram px-2"></i>
                            <span class="px-2">اینستاگرام</span>
                        </Button>
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

<style lang="scss"></style>

