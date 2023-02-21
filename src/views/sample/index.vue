<template>
    <nav class="bg-light-pink flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white">{{ id }}</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <Avatar icon="pi pi-user" class="" shape="circle" />
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'w-1/5 p-4 translate-x-0': sideBar, 'w-0 p-0 translate-x-full': !sideBar }"
            class="w-1/5 bg-white transition-all z-20 h-screen pt-20" style="box-shadow: .3em 0 .3em .4em #ccc">
            <RouterLink :to="{ name: 'UserPanel' }">
                <p class="flex items-center hover:bg-gray-400 hover:text-white hover:font-bold p-2 gap-3 rounded-sm cursor-pointer hover:shadow-sm"
                    :class="{ 'bg-gray-400 shadow-sm font-bold text-white': componentPage === 'dashboard' }">
                    <i class="pi pi-home text-red-600" style="font-size: 1.3rem;"></i>
                    <span>داشبورد</span>
                </p>
            </RouterLink>
            <hr class="bg-light-blue border-none mt-4" style="height: .1rem;" />
            <p class="flex items-center hover:bg-gray-400 hover:text-white hover:font-bold p-2 gap-3 rounded-sm mt-4 cursor-pointer hover:shadow-sm"
                @click="Object.values(alldesks).length > 0 ? componentPage = 'project' : null"
                :class="{ 'cursor-not-allowed': Object.keys(alldesks).length === 0, 'bg-gray-400 text-white shadow-sm font-bold': componentPage === 'project' }">
                <i class="pi pi-folder text-blue-600" style="font-size: 1.3rem;"></i>
                <span>پروژه ها</span>
            </p>
            <p class="flex items-center hover:bg-gray-400 hover:text-white hover:font-bold p-2 gap-3 rounded-sm mt-4 cursor-pointer hover:shadow-sm"
                @click="(Object.values(currentProject).length > 0) ? componentPage = 'task' : null"
                :class="{ 'cursor-not-allowed': (currentProject === undefined || Object.values(currentProject).length === 0), 'bg-gray-400 text-white shadow-sm font-bold': componentPage === 'task' }">
                <i class="pi pi-check-circle text-green-600" style="font-size: 1.3rem;"></i>
                <span>وضایف</span>
            </p>
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <userDashboard v-if="componentPage === 'dashboard'" @callPopup="createNewDesk = true"
                @callCreate="createNewDesk = true" @callPopupProject="createNewProject = true" />
            <userProject v-else-if="componentPage === 'project'" @callPopupProject="createNewProject = true"
                @callCreate="createNewDesk = true" />
            <userTask v-else-if="componentPage === 'task'" @callPopupTask="createNewTask = true"
                @callCreate="componentPage = 'dashboard'" />
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
        <popUp v-if="createNewProject" @close="createNewProject = false">
            <p class="font-bold my-3">پروژه جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="projectName" type="text" placeholder="نام پروژه..." class="w-3/5 h-10" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <template v-if="Object.values(currentTeammate).length > 0">
                    <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                    <div v-for="teammate in currentTeammate" :key="teammate.fullName" class="flex items-center gap-2">
                        <Checkbox name="teammate" :value="teammate" v-model="teammates" />
                        <p>{{ teammate.fullName }}</p>
                    </div>
                </template>
                <p v-else>همکاری برای این میزکار ثبت نشده است</p>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="createNewProject = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success w-16 h-10" :disabled="!(projectName.length > 0)"
                    @click="addProject" />
            </div>
        </popUp>
    </transition>

    <transition name="modal">
        <popUp v-if="createNewTask" @close="createNewTask = false">
            <p class="font-bold my-3">تسک جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام تسک:</p>
                <InputText v-model="taskName" type="text" placeholder="نام تسک..." class="w-3/5" />
            </div>
            <div class="flex gap-12 items-center mb-4">
                <div>
                    <p class="mb-2">پروژه مربوط:</p>
                    <Dropdown v-model="selectedDropProject" :options="projectsDrop" optionLabel="name" placeholder="پروژه"
                        class="drop-down" />
                </div>
                <div v-if="selectedDropProject">
                    <template v-if="tasksDrop.length > 0">
                        <p class="mb-2">فرد مسئول:</p>
                        <Dropdown v-model="selectedDropTeammate" :options="tasksDrop" optionLabel="name" placeholder="همکار"
                            class="drop-down" />
                    </template>
                    <p v-else class="mt-5">همکاری برای این پروژه ثبت نشده است</p>
                </div>
            </div>
            <div>
                <p class="mb-2">توضیحات:</p>
                <Textarea v-model="taskDescription" :autoResize="true" rows="5" cols="81" />
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger" @click="createNewTask = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success"
                    :disabled="!(taskName.length > 0 && selectedDropProject && selectedDropTeammate)" @click="addTask" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useTeammateStore } from '@/store/teammateStore';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'vue-router';
import userDashboard from '@/components/userDashboard.vue';
import userProject from '@/components/userProject.vue';
import userTask from '@/components/userTask.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';

export default {
    name: 'UserPanel',

    components: {
        userTask,
        Checkbox,
        Button,
        Avatar,
        userDashboard,
        userProject,
        popUp,
        InputText,
        Dropdown,
        Textarea
    },

    props: ["id"],

    setup() {
        const teammates = ref<any>([])
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const sideBar = ref(true)
        const componentPage = ref('dashboard')
        const createNewDesk = ref(false)
        const createNewProject = ref(false)
        const createNewTask = ref(false)
        const deskName = ref('')
        const projectName = ref('')
        const taskName = ref('')
        const selectedDropProject = ref<any>(null)
        const selectedDropTeammate = ref<any>(null)
        const taskDescription = ref('')


        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        const currentTeammate = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.teammates).length > 0) {
                return selectedDesk.value.teammates
            } else {
                return []
            }
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

        // const selectedDesk = ref<any>(deskStore.desksDrop[0])


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
                teammates: teammatesObj
            }

            deskStore.increment(objDesk)
            deskStore.setCurrentDesk(deskName.value)
            deskStore.setSelectedDropDesk({ name: deskName.value, code: deskName.value })

            createNewDesk.value = false
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
            // if (deskStore.selectedDesk(deskStore.currentDesk)) {
            //     selectedDesk.value = { name: deskStore.selectedDesk(deskStore.currentDesk).name, code: deskStore.selectedDesk(deskStore.currentDesk).name }
            // }
        })

        watch(createNewProject, () => {
            teammates.value = []
            projectName.value = ''
        })

        watch(createNewTask, () => {
            taskName.value = ''
            taskDescription.value = ''
            selectedDropProject.value = null
            selectedDropTeammate.value = null
        })

        function addProject() {
            projectStore.changeLoading(true)

            let teammatesObj: any = {}
            if (teammates.value.length > 0) {
                teammates.value.forEach((item: any) => {
                    teammatesObj[item.fullName] = item
                })
            }

            deskStore.setProject(deskStore.currentDesk, projectName.value, teammatesObj)

            createNewProject.value = false
            setInterval(() => {
                projectStore.changeLoading(false)
            }, 1000);
        }

        function addTask() {
            deskStore.changeTaskLoading(true)
            deskStore.setTask(deskStore.currentDesk, selectedDropProject.value.code, taskName.value, taskDescription.value, selectedDropTeammate.value.code)
            createNewTask.value = false
            setInterval(() => {
                deskStore.changeTaskLoading(false)
            }, 1000);
        }

        const currentProject = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.projects).length > 0) {
                return selectedDesk.value.projects
            } else {
                return []
            }
        })


        const tasksDrop = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.projects).length > 0 && currentProject.value[selectedDropProject.value.code]) {
                const drops = Object.values(currentProject.value[selectedDropProject.value.code].teammates).map((item: any) => {
                    return { name: item.fullName, code: item.fullName };
                });
                drops.push({ name: 'خودم', code: 'خودم' })
                return drops
            } else {
                return []
            }
        })

        const projectsDrop = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.projects).length > 0) {
                const drops = Object.values(selectedDesk.value.projects).map((item: any) => {
                    return { name: item.name, code: item.name };
                });
                return drops
            } else {
                return []
            }
        })

        return {
            addTask,
            addProject,
            removeTeammate,
            addTeammate,
            createDesk,
            alldesks: deskStore.allDesk,
            selectedDropProject,
            selectedDropTeammate,
            taskDescription,
            taskName,
            currentProject,
            projectsDrop,
            tasksDrop,
            deskName,
            sideBar,
            componentPage,
            createNewDesk,
            deskTeammates,
            selectedDesk,
            createNewProject,
            createNewTask,
            teammates,
            currentTeammate,
            projectName
        }
    },
}
</script>

<style lang="scss">
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

