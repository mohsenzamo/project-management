<template>
    <nav class="bg-yellow-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
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
            <RouterLink :to="{ name: 'UserProfile' }">
                <Avatar icon="pi pi-user" class="" shape="circle" />
            </RouterLink>
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
            <Card class="w-full shadow-md relative mb-10">
                <template #header>
                    <div class="cursor-pointer bg-gray-300 w-14 h-14 absolute top-5 left-5 rounded-full flex items-center justify-center shadow-lg"
                        @click="openStatus = !openStatus">
                        <i class="pi pi-user" style="font-size: 1.2rem"></i>
                        <i v-if="currentTask.isDone" class="pi pi-check absolute top-0 right-0 text-green-500"></i>
                        <i v-else class="pi pi-clock absolute top-0 right-0 text-blue-500"></i>
                        <Transition name="status1">
                            <i v-if="openStatus" class="pi pi-check-circle absolute top-16 text-green-500 cursor-pointer"
                                style="font-size: 1.3rem;"></i>
                        </Transition>
                        <Transition name="status3">
                            <i v-if="openStatus"
                                class="pi pi-exclamation-circle absolute top-24 text-yellow-500 cursor-pointer"
                                style="font-size: 1.3rem;"></i>
                        </Transition>
                        <Transition name="status3">
                            <i v-if="openStatus" class="pi pi-times-circle absolute top-32 text-red-500 cursor-pointer"
                                style="font-size: 1.3rem;"></i>
                        </Transition>
                    </div>
                    <div class="absolute top-5 left-24 flex flex-col items-center justify-center">
                        <Knob v-model="currentTask.deadline.unit" :size="62" class="font-iransans" />
                        <p>{{ currentTask.deadline.period }}</p>
                    </div>
                    <div class="ribbon">
                        <span class="font-iransans shadow-md bg-light-blue">{{ currentTask.point }}</span>
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
                            <p v-if="currentTask.description.length > 0" dir="ltr" v-html="currentTask.description"
                                class="w-full" />
                            <p v-else>----</p>
                        </div>
                        <div class="splide splide_project mx-auto px-4" role="group" style="width: 99%;">
                            <div class="splide__track">
                                <ul class="splide__list">
                                    <li class="splide__slide">
                                        <label
                                            class="h-full w-100 flex flex-col items-center px-4 py-8 bg-white rounded-lg tracking-wide border cursor-pointer hover:text-light-blue">
                                            <i class="pi pi-image"></i>
                                            <span class="mt-2 text-sm leading-normal">انتخاب عکس</span>
                                            <input type='file' class="hidden" />
                                        </label>
                                    </li>
                                    <li class="splide__slide cursor-pointer relative" v-for="i in 5" :key="i"
                                        @click="modalImage = true" @mouseenter="shadowBack = i"
                                        @mouseleave="shadowBack = -1">
                                        <img src="../../../../dashboard.png" class="w-100 h-auto" />
                                        <div v-if="shadowBack === i"
                                            class="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                            <i class="pi pi-eye text-white cursor-pointer" style="font-size: 1.3rem;"></i>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="w-full flex flex-col gap-3 mt-5">
                            <Dropdown v-model="selectedDropComment" :options="commentSubjectDrop" optionLabel="name"
                                placeholder="موضوع کامنت" class="drop-down w-1/2" />
                            <div class="w-1/2 flex items-center justify-center">
                                <Textarea v-model="comment" :autoResize="true" rows="5" cols="500"
                                    placeholder="متن کامنت" />
                            </div>
                            <Button label="ثبت" class="p-button-sm p-button-success w-1/6" />
                        </div>

                        <div v-if="comment.length > 0 && selectedDropComment && selectedDropComment.code">
                            <!-- <Message :closable="false" :severity="selectedDropComment.code">{{ comment }}</Message> -->
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <transition name="modal">
        <div v-if="modalImage" class="fixed inset-0 flex items-center justify-center z-50 lg:z-40">
            <div class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70" @click="modalImage = false" />
            <div class="w-10/12 bg-gray-300 rounded-md shadow-2xl relative animate-open p-2 h-auto lg:w-6/12">
                <img src="../../../../dashboard.png" class="w-100 h-auto" />
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { ref, computed, onMounted } from 'vue'
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Knob from 'primevue/knob';



export default {
    name: 'UserPanel',

    components: {
        Knob,
        Dropdown,
        Avatar,
        Card,
        Textarea,
        Button
    },

    props: ["id"],

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide', {
                perPage: 3,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                gap: '1rem',
                autoplay: false
            });

            const collection: any = document.getElementsByClassName("ql-align-right");
            if (collection && collection.length > 0) {
                Object.values(collection).forEach((elmnt: any) => {
                    elmnt.style.direction = "rtl";
                })
            }
            splide.mount();
        })
        const comment = ref('')
        const deskStore = useDeskStore();
        const sideBar = ref(true)
        const modalImage = ref(false)
        const shadowBack = ref(-1)
        const currentProject: any = computed(() => deskStore.currentProject)
        const currentTask: any = computed(() => deskStore.currentTask)
        const selectedDropComment = ref<any>(null)
        const commentSubjectDrop = ref([
            { name: 'اخطار', code: 'warn' },
            { name: 'ارور', code: 'error' },
            { name: 'موفق', code: 'success' },
            { name: 'راهنما', code: 'info' }
        ])
        const openStatus = ref<boolean>(false)

        // let timer = ref<any>(0)

        // const currentTaskDeadline = computed(() => {
        //     if (currentTask.value.deadline.period === 'ساعت') {
        //         return currentTask.value.deadline.unit * 60
        //     } else if (currentTask.value.deadline.period === 'روز') {
        //         return currentTask.value.deadline.unit * 60 * 24
        //     } else if (currentTask.value.deadline.period === 'هفته') {
        //         return currentTask.value.deadline.unit * 60 * 24 * 7
        //     } else {
        //         return 0
        //     }
        // })



        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        return {
            currentProject,
            sideBar,
            selectedDesk,
            currentDesk,
            currentTask,
            selectedDropComment,
            commentSubjectDrop,
            comment,
            openStatus,
            modalImage,
            shadowBack
            // currentTaskDeadline
        }
    },
}
</script>

<style lang="scss">
.status1-enter-active {
    transition: all 0.4s ease;
}

.status1-leave-active {
    transition: all 0.8s ease;
}

.status1-enter-from,
.status1-leave-to {
    opacity: 0;
    top: 0;
}

.status2-enter-active,
.status2-leave-active {
    transition: all 0.6s ease;
}

.status2-enter-from,
.status2-leave-to {
    opacity: 0;
    top: 0;
}

.status3-enter-active {
    transition: all 0.8s ease;
}

.status3-leave-active {
    transition: all 0.4s ease;
}

.status3-enter-from,
.status3-leave-to {
    opacity: 0;
    top: 0;
}

.w-full::v-deep .ql-align-right .ql-direction-rtl {
    @apply bg-blue-800
}

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

