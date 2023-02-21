<template>
    <nav class="bg-green-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white flex items-center">
                <RouterLink :to="{ path: '/desk/' + currentDesk }">
                    <span class="cursor-pointer">{{ currentDesk }}</span>
                </RouterLink>
                <i class="pi pi-angle-left" style="font-size: 1.3rem;"></i>
                <RouterLink :to="{ path: '/project/' + currentProject.name }">
                    <span class="cursor-pointer">{{ currentProject.name }}</span>
                </RouterLink>
                <i class="pi pi-angle-left" style="font-size: 1.3rem;"></i>
                <span class="cursor-default">{{ currentTask.name }}</span>
            </p>
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
            class="bg-white transition-all z-20 h-screen pt-28 overflow-y-scroll custom px-12">
            <Card class="w-full shadow-md h-full relative">
                <template #header>
                    <div
                        class="bg-gray-300 w-32 h-32 absolute -top-12 -left-10 rounded-full flex items-center justify-center shadow-lg">
                        <i class="pi pi-user" style="font-size: 3rem"></i>
                    </div>
                    <div class="ribbon">
                        <span class="font-iransans shadow-md bg-light-blue">3</span>
                    </div>
                </template>
                <template #title>
                    <p class="mt-10 mr-12 text-3xl">
                        {{ currentTask.name }}
                    </p>
                </template>
                <template #content>
                    <div class="px-10">
                        <p class="text-lg mb-3">
                            <span class="ml-2 font-bold">پروژه:</span>
                            <span>{{ currentTask.projectId }}</span>
                        </p>
                        <p class="text-lg mb-3">
                            <span class="ml-2 font-bold">میزکار:</span>
                            <span>{{ currentTask.deskId }}</span>
                        </p>
                        <div class="text-lg mb-5">
                            <p class="ml-2 font-bold">توضیحات:</p>
                            <p>{{ currentTask.description }}</p>
                        </div>
                        <div class="splide splide_project mx-auto px-4" role="group" style="width: 99%;">
                            <div class="splide__track">
                                <ul class="splide__list">
                                    <li class="splide__slide" v-for="i in 10" :key="i">
                                        <img src="../../../../dashboard.png" class="w-100 h-auto"/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { ref, computed, onMounted } from 'vue'
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import Card from 'primevue/card';

export default {
    name: 'UserPanel',

    components: {
        Avatar,
        Card
    },

    props: ["id"],

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                gap: '1rem',
                autoplay: true
            });

            splide.mount();
        })
        const deskStore = useDeskStore();
        const sideBar = ref(true)

        const currentProject: any = computed(() => deskStore.currentProject)
        const currentTask: any = computed(() => deskStore.currentTask)


        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))



        return {
            currentProject,
            sideBar,
            selectedDesk,
            currentDesk,
            currentTask
        }
    },
}
</script>

<style lang="scss">
.ribbon {
    width: 110px;
    height: 110px;
    display: block;
    position: absolute;
    overflow: hidden;
}

.ribbon span {
    width: 150px;
    height: 34px;
    top: 20px;
    right: -40px;
    position: absolute;
    display: block;
    color: #333;
    font-family: arial;
    font-size: 18px;
    color: white;
    text-align: center;
    line-height: 34px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
}

.p-button::v-deep .p-button-icon-left {
    margin-left: .5rem;
    margin-right: 0;
}

.p-progressbar::v-deep .p-progressbar-value {
    @apply bg-blue-400;
}

.p-chip .p-chip-icon {
    margin-left: .5rem;
}

.custom::-webkit-scrollbar {
    display: none;
}
</style>

