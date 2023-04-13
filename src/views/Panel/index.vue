<template>
    <transition name="error">
        <errorMassege v-if="errorHandling" @close="errorHandling = false">
            <p class="m-2">
                مشکلی به وجود آمده لطفا دوباره تلاش کنید
            </p>
        </errorMassege>
    </transition>

    <nav class="bg-light-pink flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">پنل کاربر</p>
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
            <RouterLink :to="{ name: 'UserDetails' }">
                <Avatar icon="pi pi-user" class="" shape="circle" />
            </RouterLink>
        </div>
    </nav>

    <div class="flex relative gap-1">
        <div :class="{ 'block absolute top-0 right-0 lg:static p-2.5 translate-x-0': sideBar, 'hidden p-0 translate-x-full': !sideBar }"
            class="sidebar w-56 lg:w-1/5 bg-white transition-all z-30 h-screen pt-16"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <p @click="router.go(-1)"
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="text-red-500 pi pi-arrow-right text-lg"></i>
                <span>بازگشت</span>
            </p>
            <p
                class="hover:bg-slate-200 flex items-center hover:font-bold py-1.5 px-5 gap-3.5 rounded-sm hover:shadow-sm mt-1 cursor-pointer">
                <i class="home-icon pi pi-home text-lg"></i>
                <span>داشبورد</span>
            </p>
            <div class="divider-line mt-2.5"></div>
            <div class="h-96 flex flex-col justify-start items-end overflow-y-scroll custom">
                <p class="w-full flex items-center py-1.5 px-5 gap-3.5 rounded-sm cursor-default"
                    :class="{ 'cursor-not-allowed': Object.keys(alldesks).length === 0 }">
                    <i v-if="Object.values(alldesks).length > 0" class="pi pi-angle-down text-blue-600"
                        style="font-size: 1rem;"></i>
                    <i v-else class="pi pi-angle-left" style="font-size: 1rem;"></i>
                    <span>میزکارها</span>
                </p>
                <template v-if="Object.values(alldesks).length > 0">
                    <p v-for="desk in alldesks" :key="desk._id"
                        class="flex items-center py-1.5 px-4 gap-3 rounded-sm w-11/12"
                        :class="{ 'dashboard-item-hover cursor-pointer': desk.isActive, 'cursor-not-allowed': !desk.isActive }"
                        @click="desk.isActive ? deskRoutePush(desk) : null">
                        <i class="pi pi-desktop"
                            :class="{ 'text-gray-500': !desk.isActive, 'text-blue-600': desk.isActive }"
                            style="font-size: 1rem;"></i>
                        <span :class="{ 'text-gray-500': !desk.isActive }">{{ desk.title }}</span>
                    </p>
                </template>
            </div>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white z-20 h-screen pt-14 overflow-y-scroll custom">
            <div class="pt-3 px-2" v-if="Object.values(alldesks).length === 0 && userPosition === 'manager'">
                <div
                    class="flex flex-col sm:flex-row justify-center sm:justify-start items-center text-center sm:text-right gap-2">
                    <p>
                        شما میزِکار فعالی ندارید. لطفاً جهت ادامه یک میزِکار جدید برای خود بسازید:
                    </p>
                    <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm text-sm rounded-md"
                        @click="createNewDesk = true" />
                </div>
            </div>
            <div v-else>
                <div v-if="deskLoading" class="w-fit mx-auto h-24">
                    <ProgressSpinner />
                </div>
                <template v-else>
                    <Button v-if="userPosition === 'manager'" label="ایجاد میزکار جدید" icon="pi pi-plus"
                        class="p-button-sm text-sm rounded-md mt-4 mr-4" @click="createNewDesk = true" />
                    <div :class="{ 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2': sideBar, ' grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': !sideBar }"
                        class="grid items-center gap-x-5 md:gap-x-10 gap-y-5 p-4 flex-wrap xl:grid-cols-3">
                        <Card v-for="desk in alldesks" :key="desk._id"
                            class="w-full h-full shadow-md relative border-t-2 border-pink-400 rounded-xl cursor-default">
                            <template #header>
                                <div class="flex absolute items-center left-3 gap-2 top-1">
                                    <InputSwitch v-model="desk.isActive" @input="deskStatus(desk)" class="text-sm"
                                        :disabled="userPosition !== 'manager'" style="height: 22px;" />
                                    <i @click="desk.isActive ? deskRoutePush(desk) : null" class="pi pi-eye text-lg"
                                        :class="{ 'hover:text-blue-400 cursor-pointer': desk.isActive, 'cursor-not-allowed': !desk.isActive }"></i>
                                    <i v-if="userPosition === 'manager'"
                                        @click="desk.isActive ? currentEditDesk(desk) : null" class="pi pi-pencil"
                                        :class="{ 'hover:text-yellow-400 cursor-pointer': desk.isActive, 'cursor-not-allowed': !desk.isActive }"></i>
                                </div>
                            </template>
                            <template #title>
                                <span @click="desk.isActive ? deskRoutePush(desk) : null"
                                    class="font-iransans relative bottom-2"
                                    :class="{ 'cursor-pointer': desk.isActive, 'cursor-not-allowed': !desk.isActive }">
                                    {{ desk.title }}
                                </span>
                            </template>
                            <template #content>
                                <div v-if="deskStatusLoading === desk._id"
                                    class="w-full h-full absolute bg-gray-900 bg-opacity-70 top-0 left-0 rounded-xl flex items-center justify-center">
                                    <ProgressSpinner />
                                </div>
                                <div class="flex justify-center w-72 h-52 mx-auto">
                                    <template v-if="chartData[desk._id].show">
                                        <Chart type="doughnut" :data="chartData[desk._id].data"
                                            class="w-40 sm:w-52 h-40 sm:h-52 mt-6 sm:mt-0" />
                                    </template>
                                    <p v-else class="mt-20">تسک ثبت شده ای موجود نیست</p>
                                </div>
                                <div class="flex justify-around items-center mt-4">
                                    <p>
                                        <span class="ml-1">تعداد پروژه:</span>
                                        <span class="font-iransans">{{ desk.number_of_projects }}</span>
                                    </p>
                                    <p>
                                        <span class="ml-1">تعداد تسک:</span>
                                        <span class="font-iransans">{{ desk.number_of_tasks.done_tasks +
                                            desk.number_of_tasks.undone_tasks }}</span>
                                    </p>
                                    <p>
                                        <span class="ml-1">تعداد همکار:</span>
                                        <span class="font-iransans">{{ desk.teammates.length }}</span>
                                    </p>
                                </div>
                            </template>
                        </Card>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewDesk" @close="createNewDesk = false">
            <p class="font-bold my-3">میزکار جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">جهت دسترسی به امکانات پنل، یک میزِکار جدید برای خود ایجاد کنید:</p>
                <InputText v-model="deskName" type="text" placeholder="نام شرکت یا تیم..."
                    class="w-full sm:w-3/5 h-10 rounded-lg" />
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button :loading="deskLoading" label="ایجاد" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                    :disabled="!(deskName.length > 0)" @click="createDesk" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="createNewDesk = false" />
            </div>
        </popUp>
    </transition>

    <transition name="modal">
        <popUp v-if="modalEditDesk" @close="modalEditDesk = false">
            <p class="font-bold my-3">ویرایش میزکار:</p>
            <div class="mb-3">
                <p class="mb-2">اسم میزکار:</p>
                <InputText v-model="editDeskValue.title" type="text" placeholder="نام شرکت یا تیم..."
                    class="w-full sm:w-3/5 h-10 rounded-lg" />
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button :loading="deskLoading" label="ثبت" class="p-button-sm p-button-info w-20 h-10 rounded-lg"
                    :disabled="!(editDeskValue.title.length > 0)" @click="editDesk" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="modalEditDesk = false" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'vue-router';
import popUp from '@/components/popUp.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import InputSwitch from 'primevue/inputswitch';
import ProgressSpinner from 'primevue/progressspinner';
import errorMassege from '@/components/errorMassege.vue';

export default {
    name: 'UserPanel',

    components: {
        Chart,
        Button,
        Avatar,
        popUp,
        InputText,
        ProgressSpinner,
        Card,
        InputSwitch,
        errorMassege
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
        const router = useRouter()
        const deskStore = useDeskStore();
        const profileStore = useProfileStore()
        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const createNewDesk = ref(false)
        const deskName = ref('')
        const modalEditDesk = ref(false)
        const logOutPopup = ref(false)
        const errorHandling = ref(false)
        const editDeskValue = ref<any>(null)
        let editDeskTeammate = ref<any>([])
        const deskStatusLoading = ref<any>('')
        const deskLoading = computed(() => deskStore.deskLoading)
        const userPosition = computed(() => profileStore.userProfile.position)
        const alldesks = computed(() => deskStore.allDesk)

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function deskStatus(desk: any) {
            deskStatusLoading.value = desk._id
            errorHandling.value = false
            deskStore.deskStatus(desk).then(() => {
                deskStatusLoading.value = ''
            }).catch(() => {
                errorHandling.value = true
            })
        }

        function currentEditDesk(desk: any) {
            editDeskValue.value = Object.assign({}, desk)
            modalEditDesk.value = true
        }

        function editDesk() {
            deskStore.changeLoading(true)
            errorHandling.value = false
            deskStore.editDesk(editDeskValue.value).then(() => {
                deskStore.fetchDesks().then(() => {
                    modalEditDesk.value = false
                    deskStore.changeLoading(false)
                })
            }).catch(() => {
                errorHandling.value = true
            })
        }


        const chartData = computed(() => {
            let optionChart: any = {}
            Object.values(deskStore.allDesk).forEach((desk: any) => {
                optionChart[desk._id] = {
                    show: desk.number_of_tasks.done_tasks + desk.number_of_tasks.undone_tasks === 0 ? false : true,
                    data: {
                        labels: ['تسک های انجام شده', 'تسک های در حال انجام'],
                        datasets: [
                            {
                                data: [desk.number_of_tasks.done_tasks, desk.number_of_tasks.undone_tasks],
                                backgroundColor: ["#FF6384", "#36A2EB"],
                                hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                            }
                        ]
                    }
                }
            })
            return optionChart
        })

        function createDesk() {
            deskStore.changeLoading(true)
            errorHandling.value = false
            deskStore.createDesk(deskName.value).then(() => {
                deskStore.fetchDesks().then(() => {
                    createNewDesk.value = false
                    deskStore.changeLoading(false)
                })
            }).catch(() => {
                errorHandling.value = true
            })
        }

        watch(createNewDesk, () => {
            deskName.value = ''
        })

        function deskRoutePush(desk: any) {
            router.push({
                name: "UserDesk",
                params: { id: desk._id },
            });
        }

        return {
            deskStatus,
            editDesk,
            deskRoutePush,
            createDesk,
            currentEditDesk,
            logOut,
            userPosition,
            logOutPopup,
            alldesks,
            deskLoading,
            router,
            deskName,
            sideBar,
            createNewDesk,
            chartData,
            modalEditDesk,
            editDeskValue,
            editDeskTeammate,
            deskStatusLoading,
            errorHandling
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

.sidebar {
    font-size: 16px;
    color: #616161;

    .dashboard-item-hover:hover {
        background-color: #e8e8e8;
        font-weight: 500;
        color: #212121;
    }
}

.home-icon {
    color: #D45044
}

.divider-line {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.p-button .p-button-icon-left {
    margin-left: .5rem;
    margin-right: 0;
}

.p-progressbar .p-progressbar-value {
    @apply bg-blue-400;
}

.p-chip .p-chip-icon {
    margin-left: .5rem;
}

.p-card-content {
    padding: 0 !important;
}

.custom::-webkit-scrollbar {
    display: none;
}
</style>

