<template>
    <nav class="bg-blue-400 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
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
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-blue-400 pi pi-comments text-lg"></i>
                <span>گفتگو</span>
            </p>
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-purple-400 pi pi-wallet text-lg"></i>
                <span>برداشت ها</span>
            </p>
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
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-pink-400 pi pi-bell text-lg"></i>
                <span>اعلان ها</span>
            </p>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }" class="bg-white z-20 h-screen pt-14 flex">
            <div class="w-3/4 border h-full flex flex-col grow-0">
                <template v-if="chatUser !== 0">
                    <div class="border-b-2 flex p-2 gap-2 h-1/12">
                        <Avatar icon="pi pi-user" class="" shape="circle" />
                        <p>کاربر فعال{{ chatUser }}</p>
                    </div>
                    <div class="grow flex flex-col">
                        <div
                            class="grow h-12 border-b-2 p-7 flex flex-col-reverse gap-3 overflow-y-scroll custom overflow-x-hidden">
                            <template v-for="msg in chats" :key="msg">
                                <div v-if="msg.set === 0"
                                    class="talk-bubble-right tri-right round right-top w-fit h-auto self-start">
                                    <div class="talktext">
                                        <p class="whitespace-pre">{{ msg.msg }}</p>
                                    </div>
                                </div>
                                <div v-if="msg.set === 1"
                                    class="talk-bubble-left tri-left round right-top w-fit h-auto self-end">
                                    <div class="talktext">
                                        <p class="whitespace-pre">{{ msg.msg }}</p>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="grow-0 flex gap-2 p-2">
                            <Button label="ارسال" icon="pi pi-send" @click="pushChat" />
                            <textarea v-model="chatText" rows="1" cols="100" />
                        </div>
                    </div>
                </template>
                <div v-else class="bg-slate-100 flex items-center justify-center h-full">
                    یک صفحه چت انتخاب کنید
                </div>
            </div>
            <div class="w-1/4 flex flex-col h-full relative p-2 overflow-y-scroll custom">
                <InputText type="text" placeholder="جستجو..." />
                <div v-for="i in 10" :key="i" @click="chatUser = i"
                    class="flex gap-1 hover:bg-slate-100 items-center p-2 hover:rounded-md border-t-2 border-slate-100 cursor-pointer">
                    <Avatar icon="pi pi-user" class="w-12 h-12" shape="circle" />
                    <p class="flex flex-col">
                        <span>اسم کاربر{{ i }}</span>
                        <small class="mr-2">چتتتتتتتتتت</small>
                    </p>
                </div>
            </div>
        </div>
    </div>
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
import Textarea from 'primevue/textarea';

export default {
    name: 'UserChat',

    components: {
        Button,
        Avatar,
        InputText,
        // Textarea
    },

    setup() {
        const router = useRouter()
        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const logOutPopup = ref(false)
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

        watch(chatUser, () => {
            chatText.value = ''
            chats.value = []
        })

        return {
            logOut,
            pushChat,
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