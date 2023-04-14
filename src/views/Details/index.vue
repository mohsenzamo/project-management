<template>
    <nav class="bg-red-500 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">حساب کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4 relative">
            <Avatar icon="pi pi-wallet" class="" shape="circle" />
            <Avatar icon="pi pi-bell" class="" shape="circle" />
            <Avatar icon="pi pi-power-off" class="cursor-pointer" shape="circle" @click="logOutPopup = true" />
            <transition name="modal">
                <div v-if="logOutPopup"
                    class="logout-popup flex flex-col items-center justify-center gap-2 absolute top-14 left-16 bg-gray-300 w-44 px-2 py-4 rounded-lg shadow-lg z-20">
                    <i class="pi pi-exclamation-circle" style="font-size: 1.8rem;"></i>
                    <p>از حساب خارج میشوید؟</p>
                    <div class="flex gap-2">
                        <Button label="انصراف" class="p-button-sm p-button-secondary w-16 h-8 rounded-md"
                            @click="logOutPopup = false" />
                        <Button label="خروج" class="p-button-sm p-button-danger w-16 h-8 rounded-md" @click="logOut" />
                    </div>
                </div>
            </transition>
            <Avatar icon="pi pi-user" class="" shape="circle" />
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'block absolute top-0 right-0 lg:static p-2.5 translate-x-0': sideBar, 'hidden p-0 translate-x-full': !sideBar }"
            class="sidebar w-56 lg:w-1/5 bg-white transition-all z-30 h-screen pt-16"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <p @click="router.go(-1)"
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-red-500 pi pi-arrow-right text-lg"></i>
                <span>بازگشت</span>
            </p>
            <RouterLink :to="{ name: 'UserPanel' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="home-icon pi pi-home text-lg"></i>
                    <span>داشبورد</span>
                </p>
            </RouterLink>
            <div class="divider-line mt-2.5"></div>
            <RouterLink :to="{ name: 'UserChat' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="text-blue-400 pi pi-comments text-lg"></i>
                    <span>گفتگو</span>
                </p>
            </RouterLink>
            <RouterLink :to="{ name: 'UserWallet' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="text-purple-400 pi pi-wallet text-lg"></i>
                    <span>کیف پول</span>
                </p>
            </RouterLink>
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-yellow-400 pi pi-star text-lg"></i>
                <span>امتیازها</span>
            </p>
            <RouterLink :to="{ name: 'UserNotes' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="text-green-400 pi pi-book text-lg"></i>
                    <span>یادداشت ها</span>
                </p>
            </RouterLink>
            <RouterLink :to="{ name: 'UserNotification' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="text-pink-400 pi pi-bell text-lg"></i>
                    <span>اعلان ها</span>
                </p>
            </RouterLink>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }" class="bg-white z-20 h-screen pt-14 flex">
            <div class="w-3/4 overflow-y-scroll custom p-4 border">
                <div class="border-b-2 pb-3">
                    <div class="flex gap-3">
                        <Card class="rounded-xl shadow-md w-32 h-40">
                            <template #content>
                                <div class="flex flex-col items-center gap-1 text-center">
                                    <span class="p-2 rounded-full bg-slate-200 flex items-center justify-center w-8">
                                        <i class="pi pi-check-circle text-green-400"></i>
                                    </span>
                                    <p>کارهای امروز من</p>
                                    <p class="text-green-400">0</p>
                                </div>
                            </template>
                        </Card>
                        <Card class="rounded-xl shadow-md w-32 h-40">
                            <template #content>
                                <div class="flex flex-col items-center gap-1 text-center">
                                    <span class="p-2 rounded-full bg-slate-200 flex items-center justify-center w-8">
                                        <i class="pi pi-calendar text-red-400"></i>
                                    </span>
                                    <p>کارهای دارای تاخیر</p>
                                    <p class="text-red-400">0</p>
                                </div>
                            </template>
                        </Card>
                        <Card class="rounded-xl shadow-md w-32 h-40">
                            <template #content>
                                <div class="flex flex-col items-center gap-1 text-center">
                                    <span class="p-2 rounded-full bg-slate-200 flex items-center justify-center w-8">
                                        <i class="pi pi-clock text-blue-400"></i>
                                    </span>
                                    <p>کارهای قابل پیگیری</p>
                                    <p class="text-blue-400">0</p>
                                </div>
                            </template>
                        </Card>
                        <Card class="rounded-xl shadow-md w-32 h-40 cursor-pointer" @click="addCarts = true">
                            <template #content>
                                <div class="flex flex-col items-center gap-1 text-center">
                                    <span class="p-2 rounded-full bg-slate-200 flex items-center justify-center w-8">
                                        <i class="pi pi-credit-card text-pink-400"></i>
                                    </span>
                                    <p>کارت های من</p>
                                    <p class="text-pink-400">0</p>
                                </div>
                            </template>
                        </Card>
                        <Card class="rounded-xl shadow-md w-32 h-40">
                            <template #content>
                                <div class="flex flex-col items-center gap-1 text-center">
                                    <span class="p-2 rounded-full bg-slate-200 flex items-center justify-center w-8">
                                        <i class="pi pi-star text-yellow-400"></i>
                                    </span>
                                    <p>امتیاز های من</p>
                                    <p class="text-yellow-400">{{ userPoint }}</p>
                                </div>
                            </template>
                        </Card>
                    </div>
                    <div class="flex mt-5">
                        <p class="w-1/12 text-xl text-center">همکاران من:</p>
                        <div class="splide splide_teammate px-2 w-11/12" role="group">
                            <div class="splide__track">
                                <ul class="splide__list">
                                    <li v-for="i in 20" :key="i"
                                        class="splide__slide py-2 flex justify-center items-center">
                                        <Avatar :label="'U' + i" class="mr-2"
                                            style="background-color:#9c27b0; color: #ffffff" shape="circle" />

                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-3 mt-5 px-3">
                    <Card class="w-full shadow-md rounded-lg overflow-hidden">
                        <template #header>
                            <div class="bg-green-600 p-2 text-white text-center">
                                کارهای من
                            </div>
                        </template>
                        <template #content>
                            <!-- <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                                <template v-if="isMyTask">
                                    <template v-for="task in currentDesk.tasks" :key="task._id">
                                        <div @click="taskRoutePush(task._id)"
                                            v-if="task.responsible.username === currentUsername"
                                            class="bg-gray-100 flex items-center rounded-md mb-1 p-2 justify-between shadow-md cursor-pointer">
                                            <p class="flex items-center">
                                                <Avatar v-if="task.status === 'done'" icon="pi pi-check" shape="circle"
                                                    class="cursor-pointer bg-inherit" />
                                                <Avatar v-else-if="task.status === 'undone'" icon="pi pi-times"
                                                    shape="circle" class="cursor-pointer bg-inherit" />
                                                <Avatar v-else-if="task.status === 'pending'" icon="pi pi-clock"
                                                    shape="circle" class="cursor-pointer bg-inherit" />
                                                <span class="mx-2">{{ task.title }}</span>
                                            </p>
                                            <Avatar :label="task.responsible.username[0]" shape="circle" />
                                        </div>
                                    </template>
                                </template>
                                <p v-else class="text-center">تسکی برای انجام ندارم</p>
                            </div> -->
                        </template>
                    </Card>
                    <Card class="w-full shadow-md rounded-lg">
                        <template #header>
                            <div class="bg-red-400 p-2 text-white text-center rounded-t-lg">
                                پیگیری از دیگران
                            </div>
                        </template>
                        <template #content>
                            <!-- <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                                <template v-if="isTeammateTask">
                                    <template v-for="task in currentDesk.tasks" :key="task._id">
                                        <div @click="taskRoutePush(task._id)"
                                            v-if="task.responsible.username !== currentUsername"
                                            class="bg-gray-100 flex items-center rounded-md mb-1 p-2 justify-between shadow-md cursor-pointer">
                                            <p class="flex items-center">
                                                <Avatar v-if="task.status === 'done'" icon="pi pi-check" shape="circle"
                                                    class="cursor-pointer bg-inherit" />
                                                <Avatar v-else-if="task.status === 'undone'" icon="pi pi-times"
                                                    shape="circle" class="cursor-pointer bg-inherit" />
                                                <Avatar v-else-if="task.status === 'pending'" icon="pi pi-clock"
                                                    shape="circle" class="cursor-pointer bg-inherit" />
                                                <span class="mx-2">{{ task.title }}</span>
                                            </p>
                                            <Avatar :label="task.responsible.username[0]" shape="circle" />
                                        </div>
                                    </template>
                                </template>
                                <p v-else class="text-center">تسکی برای پیگیری نیست</p>
                            </div> -->
                        </template>
                    </Card>
                </div>
                <div class="my-3 px-3">
                    <Card class="w-full shadow-md rounded-lg overflow-hidden">
                        <template #header>
                            <div class="bg-blue-400 p-2 text-white text-center">
                                وضعیت پیشرفت پروژه ها
                            </div>
                        </template>
                        <template #content>
                            <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                                <!-- <template v-if="currentDesk.projects.length > 0">
                                    <div @click="projectRoutePush(project._id)" v-for="project in currentDesk.projects"
                                        :key="project._id"
                                        class="bg-gray-100 text-sm py-2 px-4 rounded-md shadow-md cursor-pointer">
                                        <p class="text-xl font-medium mb-2">
                                            <span class="ml-1">پروژه:</span>
                                            <span>{{ project.title }}</span>
                                        </p>
                                        <ProgressBar
                                            :value="Math.floor((project.number_of_tasks.done_tasks * 100) / (project.number_of_tasks.done_tasks + project.number_of_tasks.undone_tasks))" />
                                        <div class="flex flex-row-reverse gap-2 mt-2">
                                            <p>
                                                <span class="ml-1">کارهای انجام شده:</span>
                                                <span>{{ project.number_of_tasks.done_tasks }}</span>
                                            </p>
                                            <p>
                                                <span class="ml-1">کارهای باقی مانده:</span>
                                                <span>{{ project.number_of_tasks.undone_tasks }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <p v-else class="text-center">پروژه ای موجود نیست</p> -->
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="w-1/4 flex flex-col gap-5 h-full relative">
                <RouterLink :to="{ name: 'UserProfile' }">
                    <div class="ribbon">
                        <span class="font-iransans shadow-md bg-light-blue">مشخصات</span>
                    </div>
                </RouterLink>
                <div class="flex flex-col items-center mx-3">
                    <div class="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center shadow-md">
                        <i class="pi pi-user" style="font-size: 2.2rem;"></i>
                    </div>
                    <p>{{ userFullname }}</p>
                    <p>{{ today }}</p>
                </div>
                <div class="mx-3">
                    <p>میزکارشما:</p>
                    <div class="h-72 overflow-y-scroll custom flex flex-col gap-2">
                        <Card v-for="desk in alldesks" :key="desk._id"
                            class="w-full h-20 flex justify-center items-center rounded-xl shadow-md border-t-2 border-pink-400"
                            :class="{ 'cursor-pointer': desk.isActive, 'cursor-not-allowed bg-slate-300': !desk.isActive }">
                            <template #content>
                                <div class="h-full w-full text-center" @click="desk.isActive ? deskRoutePush(desk) : null">
                                    <p>{{ desk.title }}</p>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="addCarts" @close="addCarts = false">
            <p class="font-bold my-3">لیست کارت ها:</p>
            <div class="mb-3">
                <p class="mb-2">اضافه کردن کارت:</p>
                <div class="flex items-center justify-around gap-2">
                    <InputText type="text" placeholder="شماره کارت..." class="w-full sm:w-3/5 h-10 rounded-lg" />
                    <InputText type="text" placeholder="شماره شبا..." class="w-full sm:w-3/5 h-10 rounded-lg" />
                    <Button label="ثبت" class="p-button-sm p-button-success w-20 h-10 rounded-lg" />
                </div>
            </div>
            <div>
                <p>کارت های من:</p>
                <div class="grid grid-cols-3 gap-y-5 overflow-y-scroll h-36 items-center card-box mb-3">
                    <div v-for="i in 5" :key="i" class="flex bg-white w-fit gap-2 rounded-md p-2 flex-col">
                        <p>6037603760376037</p>
                        <p>شباااااااااااا</p>
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg" @click="addCarts = false" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import InputSwitch from 'primevue/inputswitch';
import InlineMessage from 'primevue/inlinemessage';
import popUp from '@/components/popUp.vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useDeskStore } from '@/store/deskStore';

export default {
    name: 'UserDetails',

    components: {
        Button,
        Avatar,
        Card,
        popUp,
        InputText
    },

    beforeRouteEnter(to: any, from: any, next: any) {
        const deskStore = useDeskStore()
        const profileStore = useProfileStore()
        deskStore.changeLoading(true)
        const accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")
        if (accessToken && refreshToken) {
            deskStore.fetchDesks().then(() => {
                profileStore.fetchProfile().then(() => {
                    deskStore.changeLoading(false)
                    next()
                })
            }).catch(() => {
                next({ path: '/' })
            })
        } else {
            next({ path: '/' })
        }
    },

    setup() {
        onMounted(() => {
            const splideTeammate = new Splide('.splide_teammate', {
                perPage: 10,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                arrows: false,
            });

            splideTeammate.mount();
        })
        const router = useRouter()
        const profileStore = useProfileStore()
        const deskStore = useDeskStore();
        const userPosition = computed(() => profileStore.userProfile.position)
        const userFullname = computed(() => profileStore.profile.fname + ' ' + profileStore.profile.lname)
        const userPoint = computed(() => profileStore.profile.point)
        const alldesks = computed(() => deskStore.allDesk)
        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const logOutPopup = ref(false)
        const addCarts = ref(false)
        const today = new Date().toLocaleDateString('fa-IR');

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function deskRoutePush(desk: any) {
            router.push({
                name: "UserDesk",
                params: { id: desk._id },
            });
        }

        return {
            logOut,
            deskRoutePush,
            alldesks,
            userPoint,
            sideBar,
            userPosition,
            userFullname,
            logOutPopup,
            router,
            today,
            addCarts
        }
    },
}
</script>

<style lang="scss">
.card-box::-webkit-scrollbar {
    width: 5px;
}

.card-box::-webkit-scrollbar-track {
    background: #f1f1f1;
    @apply rounded;
}

.card-box::-webkit-scrollbar-thumb {
    background: #888;
    @apply rounded;
}

.logout-popup {
    &::before {
        content: "\A";
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 13px solid;
        position: absolute;
        top: -12px;
        left: 8px;
        @apply border-b-slate-300
    }
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

.modal-enter-from {
    opacity: 0;
}

.modal-enter-to {
    opacity: 1;
}

.modal-enter-to {
    transition: all .5s ease;
}

.modal-leave-from {
    opacity: 1;
}

.modal-leave-to {
    opacity: 0;
}

.modal-leave-active {
    transition: all .5s ease;
}

.custom::-webkit-scrollbar {
    display: none;
}

.p-card {
    @apply font-yekan;

    .p-card-body {
        @apply w-full;
    }
}

.home-icon {
    color: #D45044
}

.scaleLeft-enter-active,
.scaleRight-enter-active {
    transition: all 0.7s ease;
}

.scaleLeft-leave-active,
.scaleRight-leave-active {
    transition: all 0.6s ease;
}

.scaleRight-enter-from,
.scaleRight-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(-180deg);
    position: absolute;
}

.scaleRight-leave-from {
    opacity: 0;
}

.scaleLeft-enter-from,
.scaleLeft-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(180deg);
    position: absolute;
}

.scaleLeft-leave-from {
    opacity: 0;
}

.divider-line {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

