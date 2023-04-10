<template>
    <nav class="bg-purple-500 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">حساب کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4 relative">
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
                class="selected-sidebar flex items-center font-bold py-1.5 px-5 gap-3.5 rounded-sm shadow-sm mt-1 cursor-pointer">
                <i class="text-purple-500 pi pi-arrow-right text-lg"></i>
                <span>بازگشت</span>
            </p>
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
            <div v-if="profileLoading">
                <ProgressSpinner />
            </div>
            <template v-else>
                <transition name="scaleRight" appear>
                    <Card v-if="!isExchange"
                        class="w-full sm:w-9/12 md:w-2/5 border-t-0 sm:border-t-2 border-t-purple-400 p-5 mx-auto shadow-none sm:shadow-2xl rounded-xl mt-0 sm:mt-12 mb-5">
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
                            <InlineMessage v-if="profileError" severity="error" class="mb-2">تغییر مشخصات با مشکل مواجه شد
                                لطفا
                                دوباره تلاش کنید</InlineMessage>
                            <form class="flex flex-col justify-center items-center gap-2.5">
                                <p>
                                    {{ profile.position }}
                                </p>
                                <p class="self-start flex justify-between w-full px-5">
                                    <span>تغییر مشخصات:</span>
                                    <InputSwitch v-model="isEditProfile" />
                                </p>
                                <p class="self-start flex justify-between w-full px-5">
                                    <span>نام:</span>
                                    <span v-if="!isEditProfile">{{ profile.fname }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.fname" type="text"
                                    placeholder="نام" class=" text-sm rounded-lg w-full" />

                                <p class="self-start flex justify-between w-full px-5">
                                    <span>نام خانوادگی:</span>
                                    <span v-if="!isEditProfile">{{ profile.lname }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.lname" type="text"
                                    placeholder="نام خانوادگی" class=" text-sm rounded-lg w-full" />

                                <p class="self-start flex justify-between w-full px-5">
                                    <span>نام کاربری:</span>
                                    <span v-if="!isEditProfile">{{ profile.username }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.username" type="text"
                                    placeholder="نام کاربری" class=" text-sm rounded-lg w-full" />

                                <p class="self-start flex justify-between w-full px-5">
                                    <span>ایمیل:</span>
                                    <span v-if="!isEditProfile">{{ profile.email }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.email" type="text"
                                    placeholder="ایمیل" class=" text-sm rounded-lg w-full" disabled />

                                <p class="self-start flex justify-between w-full px-5">
                                    <span>شماره:</span>
                                    <span v-if="!isEditProfile">{{ profile.email }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.phone" type="text"
                                    placeholder="شماره" class=" text-sm rounded-lg w-full" disabled />

                                <p class="self-start flex justify-between w-full px-5">
                                    <span>سن:</span>
                                    <span v-if="!isEditProfile">{{ profile.age }}</span>
                                </p>
                                <InputText v-if="isEditProfile" v-model="changeableProfile.age" type="number"
                                    placeholder="سن" class=" text-sm rounded-lg w-full" />

                                <div class="flex justify-between w-full px-5">
                                    <span>مجموع امتیازها:</span>
                                    <div @click="isExchange = true"
                                        class="flex items-center cursor-pointer bg-gray-300 w-12 justify-center gap-2 rounded-md hover:bg-gray-400">
                                        <span>{{ profile.point }}</span>
                                        <i class="pi pi-sync"></i>
                                    </div>
                                </div>
                                <Button v-if="isEditProfile" @click="changeProfile" type="button" label="ثبت"
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
                </transition>
                <transition name="scaleLeft" appear>
                    <Card v-if="isExchange"
                        class="w-full sm:w-9/12 md:w-2/5 border-t-0 sm:border-t-2 border-t-purple-400 p-5 mx-auto shadow-none sm:shadow-2xl rounded-xl mt-0 sm:mt-12 mb-5">
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
                            <InlineMessage v-if="profileError" severity="error" class="mb-2">عملیات با مشکل مواجه شد
                                لطفا
                                دوباره تلاش کنید</InlineMessage>
                            <div class="flex flex-col">
                                <Button @click="(exchangeModal = true) && (exchangePoint = 0)" type="button"
                                    label="تبدیل امتیاز" icon="pi pi-sync"
                                    class="p-button-sm rounded-lg w-fit text-sm font-bold"
                                    :disabled="profile.point === 0" />
                                <div>
                                    <p v-if="exchangeHistory.length === 0" class="text-center text-lg">سابقه ای موجود نیست
                                    </p>
                                    <div v-else>
                                        <div v-for="exchange in exchangeHistory" :key="exchange.createdAt" class="my-3">
                                            <p class="flex items-center justify-around">
                                                <span>{{ exchange.point }}پوینت</span>
                                                <span><i class="pi pi-arrow-left"></i></span>
                                                <span>{{ exchange.point * exchange.one_point }}ریال</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between w-full px-5">
                                    <span>امتیاز باقی مانده:</span>
                                    <span>{{ profile.point }}</span>
                                </div>
                                <div class="flex justify-between w-full px-5">
                                    <span>جمع تبدیل امتیازها:</span>
                                    <span>{{ allExchange }}ریال</span>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <Button @click="isExchange = false" type="button" label="مشخصات" icon="pi pi-arrow-right"
                                class="p-button-sm p-button-primary rounded-lg w-full text-sm font-bold" />
                        </template>
                    </Card>
                </transition>
            </template>
        </div>
    </div>
    <transition name="modal">
        <popUp v-if="exchangeModal" @close="exchangeModal = false">
            <p class="font-bold my-3">میتوانید تا سقف {{ profile.point }} امتیاز تبدیل کنید:</p>
            <div class="flex justify-center">
                <InputNumber v-model="exchangePoint" inputId="horizontal-buttons" showButtons buttonLayout="horizontal"
                    :step="1" decrementButtonclass="p-button-danger" incrementButtonclass="p-button-success"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" dir="ltr" :min="0"
                    :max="profile.point" class="mb-5" />
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="ثبت" :disabled="exchangePoint === 0"
                    class="p-button-sm p-button-success w-20 h-10 rounded-lg" :loading="profileLoading" @click="exchange" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="exchangeModal = false" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
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

export default {
    name: 'UserProfile',

    components: {
        InputSwitch,
        Button,
        Avatar,
        InputText,
        Card,
        ProgressSpinner,
        InlineMessage,
        popUp,
        InputNumber
    },

    beforeRouteEnter(to: any, from: any, next: any) {
        const profileStore = useProfileStore()
        profileStore.changeLoading(true)
        const accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")
        if (accessToken && refreshToken) {
            profileStore.fetchProfile().then(() => {
                profileStore.fetchExchange().then(() => {
                    profileStore.changeLoading(false)
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
        const profileStore = useProfileStore()
        const router = useRouter()

        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const hoverImage = ref(false)
        const isEditProfile = ref(false)
        const profileError = ref(false)
        const isExchange = ref(false)
        const exchangeModal = ref(false)
        const logOutPopup = ref(false)
        const exchangePoint = ref(0)
        const changeableProfile = ref<any>({})

        const profile = computed(() => profileStore.userProfile)
        const profileLoading = computed(() => profileStore.loading)
        const exchangeHistory = computed(() => profileStore.exchangeHistory)
        const allExchange = computed(() => {
            let sum = 0
            exchangeHistory.value.forEach((exchange: any) => {
                sum += exchange.point * exchange.one_point
            })
            return sum
        })

        watch(isEditProfile, (newData) => {
            newData ? changeableProfile.value = Object.assign({}, profile.value) : changeableProfile.value = {}
        })

        function changeProfile() {
            profileStore.changeLoading(true)
            profileError.value = false
            profileStore.changeProfile(changeableProfile.value).then(() => {
                profileStore.fetchProfile().then(() => {
                    profileStore.changeLoading(false)
                })
            }).catch(() => {
                profileError.value = true
            })
        }

        function exchange() {
            profileStore.changeLoading(true)
            profileStore.exchangePoint(exchangePoint.value).then(() => {
                profileStore.fetchExchange().then(() => {
                    profileStore.fetchProfile().then(() => {
                        profileStore.changeLoading(false)
                        exchangeModal.value = false
                    })
                })
            }).catch(() => {
                profileError.value = true
                profileStore.changeLoading(false)
                exchangeModal.value = false
            })
        }

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        return {
            changeProfile,
            exchange,
            logOut,
            allExchange,
            exchangePoint,
            sideBar,
            hoverImage,
            profile,
            profileLoading,
            isEditProfile,
            changeableProfile,
            profileError,
            isExchange,
            exchangeModal,
            exchangeHistory,
            logOutPopup,
            router
        }
    },
}
</script>

<style lang="scss">
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

.selected-sidebar {
    color: #212121;
    font-weight: 500;
    background-color: #e8e8e8;
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
</style>

