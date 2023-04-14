<template>
    <nav class="bg-pink-400 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">حساب کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4 relative">
            <Avatar icon="pi pi-wallet" class="" shape="circle" />
            <div class="relative">
                <Avatar icon="pi pi-bell" class="animate-wiggle cursor-pointer" shape="circle"
                    @click="notificationPupop = true" />
                <small
                    class="absolute bg-yellow-400 w-5 h-5 rounded-full flex items-center justify-center -top-2 -right-2">4</small>
                <transition name="modal">
                    <div v-if="notificationPupop"
                        class="notification-popup flex flex-col items-center justify-center gap-2 absolute top-12 left-0 bg-gray-300 w-44 px-2 py-4 rounded-lg shadow-lg z-20">
                        <div v-for="i in 3" :key="i"
                            class="border-2 border-white hover:bg-white rounded-md px-2 flex gap-2 w-full items-center cursor-pointer">
                            <small>title</small>
                            <small class="text-xs">text..</small>
                        </div>
                        <div class="flex gap-2">
                            <Button label="بیشتر" class="p-button-sm p-button-info w-16 h-8 rounded-md" />
                            <Button label="انصراف" class="p-button-sm p-button-secondary w-16 h-8 rounded-md mx-auto"
                                @click="notificationPupop = false" />
                        </div>
                    </div>
                </transition>
            </div>
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
            <RouterLink :to="{ name: 'UserDetails' }">
                <Avatar icon="pi pi-user" class="" shape="circle" />
            </RouterLink>
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'block absolute top-0 right-0 lg:static p-2.5 translate-x-0': sideBar, 'hidden p-0 translate-x-full': !sideBar }"
            class="sidebar w-56 lg:w-1/5 bg-white transition-all z-30 h-screen pt-16"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <p @click="router.go(-1)"
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-pink-500 pi pi-arrow-right text-lg"></i>
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
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-pink-400 pi pi-bell text-lg"></i>
                <span>اعلان ها</span>
            </p>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white z-20 h-screen pt-14 overflow-y-scroll custom flex flex-col">
            <p class="mt-3 mr-3 text-3xl">اعلان ها:</p>
            <transition name="scaleRight" appear>
                <template v-if="notificationDetails">
                    <div class="w-full h-full flex flex-col justify-between pb-10">
                        <div>
                            <div class="flex items-center gap-4 px-10 mt-5">
                                <div class="bg-slate-200 w-28 h-28 flex items-center justify-center rounded-md">
                                    <i class="pi pi-image" style="font-size: 3.5rem;"></i>
                                </div>
                                <div>
                                    <p class="text-3xl">sender</p>
                                    <small>1402/3/3</small>
                                </div>
                            </div>
                            <p class="text-xl p-10">
                                به میزیتو خوش آمدید؛
                                میزیتو یک محیط مناسب و حرفه‌ای جهت برقراری ارتباطات سریع، آسان و امن در راستای پاسخ به
                                نیازهای
                                سازمانی تیم شماست.

                                میزیتو در حال توسعه و پیشرفت می‌باشد و مطمئناً با مشارکت و اعتماد شما به اهداف خود نزدیک‌تر
                                خواهد شد.

                                در صورتیکه از عملکرد میزیتو راضی هستید، می‌توانید آن را به سایر دوستان خود نیز پیشنهاد کنید.

                                منتظر نظرات و پیشنهادات سازنده شما هستیم.


                                با تشکر
                            </p>
                        </div>
                        <Button label="بازگشت" icon="pi pi-arrow-right"
                            class="p-button-help rounded-lg justify-self-end w-fit mr-10"
                            @click="notificationDetails = false" />
                    </div>
                </template>
            </transition>
            <transition name="scaleLeft" appear>
                <div v-if="!notificationDetails">
                    <div v-for="i in 5" :key="i"
                        class="shadow-md h-14 w-5/6 flex items-center justify-between rounded-md px-4  border-t-2 border-pink-400 self-center my-2 cursor-pointer mx-auto"
                        @click="notificationDetails = true">
                        <div class="flex items-center gap-2">
                            <Avatar icon="pi pi-image" shape="circle" class="cursor-pointer bg-inherit" />
                            <p>sender</p>
                        </div>
                        <div class="flex gap-2">
                            <p>title</p>
                            <small>textttttttttttttttttttttttttttttttttttttttttttt</small>
                        </div>
                        <div>
                            <small>1402/3/3</small>
                        </div>
                    </div>

                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';

export default {
    name: 'UserNotes',

    components: {
        Button,
        Avatar,
    },

    setup() {
        const router = useRouter()
        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const logOutPopup = ref(false)
        const notificationPupop = ref(false)
        const notificationDetails = ref(false)

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        return {
            logOut,
            sideBar,
            logOutPopup,
            notificationPupop,
            notificationDetails,
            router
        }
    },
}
</script>

<style lang="scss">
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

.notification-popup {
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

.p-button .p-button-icon-left {
    margin-left: .5rem;
    margin-right: 0;
}

.custom::-webkit-scrollbar {
    display: none;
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

.home-icon {
    color: #D45044
}

.divider-line {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
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
</style>