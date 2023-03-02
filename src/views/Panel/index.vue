<template>
    <nav class="bg-light-pink flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">پنل کاربر</p>
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
            <p class="flex items-center bg-gray-400 text-white font-bold p-2 gap-3 rounded-sm shadow-sm">
                <i class="pi pi-home text-red-600" style="font-size: 1rem;"></i>
                <span>داشبورد</span>
            </p>
            <hr class="bg-light-blue border-none mt-4" style="height: .1rem;" />
            <div class="h-96 overflow-y-scroll custom">
                <p class="flex items-center p-2 gap-3 rounded-sm mt-4 cursor-default"
                    :class="{ 'cursor-not-allowed text-gray-500': Object.keys(alldesks).length === 0 }">
                    <i v-if="Object.values(alldesks).length > 0" class="pi pi-angle-down text-blue-600"
                        style="font-size: 1rem;"></i>
                    <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                    <span>میزکارها</span>
                </p>
                <template v-if="Object.values(alldesks).length > 0">
                    <p v-for="desk in alldesks" :key="desk.name" class="flex items-center p-2 gap-3 rounded-sm w-10/12 mx-auto"
                        :class="{ 'hover:bg-gray-400 hover:text-white hover:font-bold cursor-pointer': desk.active, 'cursor-not-allowed': !desk.active }"
                        @click="desk.active ? deskRoutePush(desk) : null">
                        <i class="pi pi-desktop" :class="{ 'text-gray-500': !desk.active, 'text-blue-600': desk.active }"
                            style="font-size: 1rem;"></i>
                        <span :class="{ 'text-gray-500': !desk.active }">{{ desk.name }}</span>
                    </p>
                </template>
            </div>
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <div class="pt-3 px-2" v-if="Object.values(alldesks).length === 0">
                <div class=" flex items-center gap-2">
                    <p>
                        شما میزِکار فعالی ندارید. لطفاً جهت ادامه یک میزِکار جدید برای خود بسازید:
                    </p>
                    <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm text-sm rounded-md" @click="createNewDesk = true" />
                </div>
            </div>
            <div v-else>
                <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm mt-4 mr-4"
                    @click="createNewDesk = true" />
                <div class="grid items-center gap-4 p-4 flex-wrap grid-cols-2">
                    <Card v-for="desk in alldesks" :key="desk.name" class="w-full h-full shadow-md relative cursor-default">
                        <template #header>
                            <i @click="currentEditDesk(desk)"
                                class="pi pi-pencil cursor-pointer hover:text-yellow-400 absolute left-3 top-3 text-xl"></i>
                            <i @click="desk.active ? deskRoutePush(desk) : null"
                                class="pi pi-eye absolute left-10 top-3 text-2xl"
                                :class="{ 'hover:text-blue-400 cursor-pointer': desk.active, 'cursor-not-allowed': !desk.active }"></i>
                            <InputSwitch v-model="desk.active" class="absolute top-3" style="left: 4.2rem;" />
                        </template>
                        <template #title>
                            <span @click="desk.active ? deskRoutePush(desk) : null" class="font-iransans"
                                :class="{ 'cursor-pointer': desk.active, 'cursor-not-allowed': !desk.active }">
                                {{ desk.name }}
                            </span>
                        </template>
                        <template #content>
                            <div class="flex justify-center w-72 h-52 mx-auto">
                                <template v-if="chartData[desk.name].show">
                                    <Chart type="doughnut" :data="chartData[desk.name].data" />
                                </template>
                                <p v-else class="mt-20">تسک ثبت شده ای موجود نیست</p>
                            </div>
                            <div class="flex justify-between items-center mt-4">
                                <p>
                                    <span class="ml-1">تعداد پروژه ها:</span>
                                    <span class="font-iransans">{{ Object.values(desk.projects).length }}</span>
                                </p>
                                <p>
                                    <span class="ml-1">تعداد همکار ها:</span>
                                    <span class="font-iransans">{{ Object.values(desk.teammates).length }}</span>
                                </p>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewDesk" @close="createNewDesk = false">
            <p class="font-bold my-3">میزکار جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">جهت دسترسی به امکانات پنل، یک میزِکار جدید برای خود ایجاد کنید:</p>
                <InputText v-model="deskName" type="text" placeholder="نام شرکت یا تیم..." class="w-3/5 h-10" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <p class="mb-2">همکاران خود را به میزکار جدید دعوت نمایید:</p>
                <div class="flex gap-2 my-2 h-10" v-for="(teammate, index) in deskTeammates" :key="index">
                    <InputText v-model="teammate.fullName" type="text" placeholder="نام همکار" class="w-1/2" />
                    <InputText v-model="teammate.phoneNumber" type="text" placeholder="شماره همراه" class="w-1/2" />
                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" class="p-button-sm p-button-danger my-px"
                            @click="removeTeammate(index)" />
                        <Button icon="pi pi-plus" class="p-button-sm p-button-success my-px" @click="addTeammate" />
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="createNewDesk = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success w-16 h-10" :disabled="!(deskName.length > 0)"
                    @click="createDesk" />
            </div>
        </popUp>
    </transition>
    <transition name="modal">
        <popUp v-if="modalEditDesk" @close="modalEditDesk = false">
            <p class="font-bold my-3">ویرایش میزکار:</p>
            <div class="mb-3">
                <p class="mb-2">اسم میزکار:</p>
                <InputText v-model="editDeskValue.name" type="text" placeholder="نام شرکت یا تیم..." class="w-3/5 h-10" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <p class="mb-2">همکاران خود:</p>
                <div class="flex gap-2 my-2 h-10" v-for="(teammate, index) in editDeskTeammate" :key="index">
                    <InputText v-model="teammate.fullName" type="text" placeholder="نام همکار" class="w-1/2" />
                    <InputText v-model="teammate.phoneNumber" type="text" placeholder="شماره همراه" class="w-1/2" />
                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" class="p-button-sm p-button-danger my-px"
                            @click="removeEditTeammate(index)" />
                        <Button icon="pi pi-plus" class="p-button-sm p-button-success my-px" @click="addEditTeammate" />
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="modalEditDesk = false" />
                <Button label="ثبت" class="p-button-sm p-button-info w-16 h-10" :disabled="!(editDeskValue.name.length > 0)"
                    @click="editDesk" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useRouter } from 'vue-router';
import popUp from '@/components/popUp.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import InputSwitch from 'primevue/inputswitch';

export default {
    name: 'UserPanel',

    components: {
        Chart,
        Button,
        Avatar,
        popUp,
        InputText,
        Card,
        InputSwitch
    },

    setup() {
        const router = useRouter()
        const deskStore = useDeskStore();
        const sideBar = ref(true)
        const createNewDesk = ref(false)
        const deskName = ref('')
        const modalEditDesk = ref(false)
        const editDeskValue = ref<any>(null)
        let editDeskTeammate = ref<any>([])
        const deskBeforeChange = ref('')


        function currentEditDesk(desk: any) {
            modalEditDesk.value = true
            editDeskValue.value = Object.assign({}, desk)
            deskBeforeChange.value = desk.name
            editDeskTeammate.value = []
            Object.values(editDeskValue.value.teammates).forEach((teammate: any) => {
                editDeskTeammate.value.push({
                    fullName: teammate.fullName,
                    phoneNumber: teammate.phoneNumber
                })
            })
            editDeskTeammate.value.push({
                fullName: '',
                phoneNumber: ''
            })
        }
        function addEditTeammate() {
            editDeskTeammate.value.push({
                fullName: '',
                phoneNumber: null
            })
        }
        function removeEditTeammate(index: number) {
            editDeskTeammate.value.splice(index, 1)
            if (editDeskTeammate.value.length == 0) {
                addEditTeammate()
            }
        }


        const chartData = computed(() => {
            let optionChart: any = {}
            Object.values(deskStore.allDesk).forEach((desk: any) => {
                let taskIsDone = 0
                let taskIsNotDone = 0
                Object.values(desk.projects).forEach((project: any) => {
                    Object.values(project.tasks).forEach((task: any) => {
                        task.isDone ? taskIsDone++ : taskIsNotDone++
                    })
                })
                const deskNameValue = desk.name
                optionChart[deskNameValue] = {
                    show: taskIsDone + taskIsNotDone === 0 ? false : true,
                    data: {
                        labels: ['تسک های انجام شده', 'تسک های در حال انجام'],
                        datasets: [
                            {
                                data: [taskIsDone, taskIsNotDone],
                                backgroundColor: ["#FF6384", "#36A2EB"],
                                hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                            }
                        ]
                    }
                }
            })
            return optionChart
        })



        let deskTeammates = ref([{
            fullName: '',
            phoneNumber: null
        }])
        function addTeammate() {
            deskTeammates.value.push({
                fullName: '',
                phoneNumber: null
            })
        }
        function removeTeammate(index: number) {
            deskTeammates.value.splice(index, 1)
            if (deskTeammates.value.length == 0) {
                addTeammate()
            }
        }
        function createDesk() {
            deskStore.changeLoading(true)
            let teammatesObj: any = {}
            if (deskTeammates.value[0].fullName.length > 0) {
                deskTeammates.value.forEach(item => {
                    if (item.fullName.length > 0) {
                        teammatesObj[item.fullName] = item
                    }
                })
            }

            let objDesk: any = {}

            const deskNameValue = deskName.value

            objDesk[deskNameValue] = {
                name: deskName.value,
                projects: {},
                teammates: teammatesObj,
                active: true
            }

            deskStore.increment(objDesk)

            createNewDesk.value = false
            setInterval(() => {
                deskStore.changeLoading(false)
            }, 1000);
        }

        function editDesk() {
            deskStore.changeLoading(true)
            let teammatesObj: any = {}
            if (editDeskTeammate.value[0].fullName.length > 0) {
                editDeskTeammate.value.forEach((item: any) => {
                    if (item.fullName.length > 0) {
                        teammatesObj[item.fullName] = item
                    }
                })
            }

            let objDesk: any = {}

            objDesk = {
                name: editDeskValue.value.name,
                projects: editDeskValue.value.projects,
                teammates: teammatesObj,
                active: true
            }

            deskStore.editDesk(objDesk, deskBeforeChange.value)

            modalEditDesk.value = false
            setInterval(() => {
                deskStore.changeLoading(false)
            }, 1000);
        }
        watch(createNewDesk, () => {
            deskTeammates.value = [{
                fullName: '',
                phoneNumber: null
            }]
            deskName.value = ''
        })

        function deskRoutePush(desk: any) {
            deskStore.setCurrentDesk(desk.name)
            deskStore.setSelectedDropDesk({ name: desk.name, code: desk.name })
            router.push({
                name: "UserDesk",
                params: { id: desk.name },
            });
        }

        return {
            editDesk,
            addEditTeammate,
            removeEditTeammate,
            deskRoutePush,
            removeTeammate,
            addTeammate,
            createDesk,
            alldesks: deskStore.allDesk,
            deskName,
            sideBar,
            createNewDesk,
            deskTeammates,
            chartData,
            currentEditDesk,
            modalEditDesk,
            editDeskValue,
            editDeskTeammate
        }
    },
}
</script>

<style lang="scss">
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

.custom::-webkit-scrollbar {
    display: none;
}
</style>

