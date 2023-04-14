<template>
    <nav class="bg-green-400 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
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
                <i class="text-green-500 pi pi-arrow-right text-lg"></i>
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
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-green-400 pi pi-book text-lg"></i>
                <span>یادداشت ها</span>
            </p>
            <RouterLink :to="{ name: 'UserNotification' }">
                <p
                    class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                    <i class="text-pink-400 pi pi-bell text-lg"></i>
                    <span>اعلان ها</span>
                </p>
            </RouterLink>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white z-20 h-screen pt-14 overflow-y-scroll custom">
            <div class="flex justify-between items-center p-3 ">
                <p class="text-3xl">یادداشت های من:</p>
                <Button v-if="notesEvent" label="بازگشت" icon="pi pi-arrow-left"
                    class="p-button-sm w-fit p-button-help rounded-lg float-right" @click="notesEvent = null" />
            </div>
            <transition name="scaleLeft" appear>
                <template v-if="!notesEvent">
                    <TabView class="p-3 w-full">
                        <TabPanel header="همه یادداشت ها">
                            <calendar class="mx-auto" @customChange="mohsen" />
                        </TabPanel>
                        <TabPanel header="یادداشت های حذف شده">
                            <div class="w-full flex gap-4 flex-wrap">
                                <Card v-for="i in 3" :key="i" class="w-60 rounded-xl shadow-md border-t-2 border-red-400">
                                    <template #title>
                                        <p>کارهای اولیه</p>
                                    </template>
                                    <template #content>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                            incididunt
                                            ut labore et dolore magna aliqua.</p>
                                    </template>
                                    <template #footer>
                                        <p class="float-left font-iransans">1402/3/3</p>
                                    </template>
                                </Card>
                            </div>
                        </TabPanel>
                    </TabView>
                </template>
            </transition>
            <transition name="scaleRight" appear>
                <template v-if="notesEvent">
                    <div class="flex flex-col">
                        <div class="w-full flex gap-5 flex-wrap px-5">
                            <Card v-for="i in 3" :key="i" class="w-60 rounded-xl shadow-md border-t-2 border-green-400">
                                <template #title>
                                    <p>کارهای اولیه</p>
                                </template>
                                <template #content>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt
                                        ut labore et dolore magna aliqua.</p>
                                </template>
                                <template #footer>
                                    <p class="float-left font-iransans">{{ notesEvent }}</p>
                                </template>
                            </Card>
                        </div>
                    </div>
                </template>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import calendar from '@/components/notesCalendar.vue';
import Card from 'primevue/card';

export default {
    name: 'UserNotes',

    components: {
        Button,
        Avatar,
        TabPanel,
        TabView,
        calendar,
        Card
    },

    setup() {
        const router = useRouter()
        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const logOutPopup = ref(false)
        const notesEvent = ref<any>(null)
        const chats = ref<any>([])
        const chatText = ref('')
        const chatUser = ref(0)

        function pushChat() {
            console.log(chatText.value)
            if (chatText.value.length > 10) {
                chats.value = [{ set: 0, msg: chatText.value }].concat(chats.value)
            } else {
                chats.value = [{ set: 1, msg: chatText.value }].concat(chats.value)
            }
            chatText.value = ''
        }

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function mohsen(x: any) {
            notesEvent.value = x
        }

        watch(chatUser, () => {
            chatText.value = ''
            chats.value = []
        })

        return {
            logOut,
            pushChat,
            mohsen,
            notesEvent,
            chatUser,
            chats,
            chatText,
            sideBar,
            logOutPopup,
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

.p-button .p-button-icon-left {
    margin-left: .5rem;
    margin-right: 0;
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

textarea {
    width: 100%;
    padding: 8px 10px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    font-size: 16px;
    resize: none;
}

textarea::-webkit-scrollbar {
    display: none;
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

.talk-bubble-right {
    display: inline-block;
    position: relative;
    background-color: #62CDFF;
    border: 1px solid #62CDFF;
}

.talk-bubble-left {
    display: inline-block;
    position: relative;
    background-color: #E9F8F9;
    border: 1px solid #E9F8F9;
}

.round {
    border-radius: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;

}

.tri-right.right-top:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: auto;
    right: -17px;
    top: -1px;
    bottom: auto;
    border: 20px solid;
    border-color: #62CDFF transparent transparent transparent;
}

.tri-left.right-top:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    right: auto;
    left: -20px;
    top: 0px;
    bottom: auto;
    border: 20px solid;
    border-color: #E9F8F9 transparent transparent transparent;
}

/* talk bubble contents */
.talktext {
    padding: 1em;
    line-height: 1.5em;
}

.talktext p {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
}
</style>