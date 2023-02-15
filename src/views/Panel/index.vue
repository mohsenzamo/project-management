<template>
    <nav class="bg-yellow-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer" style="font-size: 2rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer" style="font-size: 2rem" @click="sideBar = !sideBar"></i>
            <p>پنل کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText type="text" placeholder="جستجو" />
            </span>
            <i class="pi pi-question-circle" style="font-size: 2rem"></i>

            <i class="pi pi-comments" style="font-size: 2rem"></i>

            <Avatar icon="pi pi-user" class="" size="large" shape="circle" />
        </div>
    </nav>

    <div class="flex">
        <div :class="{ 'w-1/5 p-4 translate-x-0': sideBar, 'w-0 p-0 translate-x-full': !sideBar }"
            class="w-1/5 bg-white transition-all z-10 h-screen pt-20">
            <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm cursor-pointer"
                :class="{ 'bg-gray-400 text-white': componentPage === 'dashboard' }"
                @click="componentPage = 'dashboard'">
                <i class="pi pi-home text-red-600" style="font-size: 1.5rem;"></i>
                <span>داشبورد</span>
            </p>
            <hr class="bg-gray-400 border-none mt-4" style="height: .1rem;" />
            <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm mt-4 cursor-pointer"
                @click="Object.values(alldesks).length > 0 ? componentPage = 'project' : null"
                :class="{ 'cursor-not-allowed': Object.keys(alldesks).length === 0, 'bg-gray-400 text-white': componentPage === 'project' }">
                <i class="pi pi-qrcode text-blue-600" style="font-size: 1.5rem;"></i>
                <span>پروژه ها</span>
            </p>
            <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm mt-4 cursor-pointer"
                @click="(currentProject && currentProject.length > 0) ? componentPage = 'task' : null"
                :class="{ 'cursor-not-allowed': (currentProject === undefined || currentProject.length === 0), 'bg-gray-400 text-white': componentPage === 'task' }">
                <i class="pi pi-check-circle text-green-600" style="font-size: 1.5rem;"></i>
                <span>وضایف</span>
            </p>
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-gray-200 transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <userDashboard v-if="componentPage === 'dashboard'" @callPopup="createNewDesk = true"
                @callCreate="createNewDesk = true" @callPopupProject="createNewProject = true" />
            <userProject v-else-if="componentPage === 'project'" @callPopupProject="createNewProject = true"
                @callCreate="createNewDesk = true" />
            <userTask v-else-if="componentPage === 'task'" />
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewDesk" @close="createNewDesk = false">
            <p class="text-lg font-bold my-3">میزکار جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">جهت دسترسی به امکانات پنل، یک میزِکار جدید برای خود ایجاد کنید:</p>
                <InputText v-model="deskName" type="text" placeholder="نام شرکت یا تیم..." class="w-3/5" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <p class="mb-2">همکاران خود را به میزکار جدید دعوت نمایید:</p>
                <div class="flex gap-2 my-2" v-for="(teammate, index) in deskTeammates" :key="index">
                    <InputText v-model="teammate.fullName" type="text" placeholder="نام همکار" class="w-1/2" />
                    <InputText v-model="teammate.phoneNumber" type="text" placeholder="شماره همراه" class="w-1/2" />
                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" class="p-button-sm p-button-danger" @click="removeTeammate(index)" />
                        <Button icon="pi pi-plus" class="p-button-sm p-button-success" @click="addTeammate" />
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger" @click="createNewDesk = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success" :disabled="!(deskName.length > 0)"
                    @click="createDesk" />
            </div>
        </popUp>
    </transition>

    <transition name="modal">
        <popUp v-if="createNewProject" @close="createNewProject = false">
            <p class="text-lg font-bold my-3">پروژه جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="projectName" type="text" placeholder="نام پروژه..." class="w-3/5" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                <div v-for="teammate in currentTeammate" :key="teammate.fullName" class="flex items-center gap-2">
                    <Checkbox name="teammate" :value="teammate" v-model="teammates" />
                    <p>{{ teammate.fullName }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger" @click="createNewProject = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success" :disabled="!(projectName.length > 0)"
                    @click="addProject" />
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
        InputText
    },

    props: ["id"],

    setup() {
        const teammates = ref([])

        const selectedDeskEE: any = computed(() => {
            return deskStore.selectedDropDesk
        })

        const currentTeammate = computed(() => {
            if (selectedDeskEE.value.code !== 0) {
                return teammateStore.selectedTeammate(selectedDeskEE.value.name)
            } else {
                return []
            }
        })

        const deskStore = useDeskStore();
        const teammateStore = useTeammateStore();
        const projectStore = useProjectStore();

        const sideBar = ref(true)

        const deskName = ref('')
        const projectName = ref('')

        const router = useRouter()

        const componentPage = ref('dashboard')


        const createNewDesk = ref(false)

        const createNewProject = ref(false)

        const selectedDesk = ref<any>(deskStore.desksDrop[0])

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
            let teammates: any = []
            if (deskTeammates.value[0].fullName.length > 0) {
                teammates = deskTeammates.value.map(item => {
                    return item
                })
            }

            let objDesk: any = {}

            const deskNameValue = deskName.value

            objDesk[deskNameValue] = {
                name: deskName.value,
            }

            deskStore.increment(objDesk)
            deskStore.setCurrentDesk(deskName.value)
            deskStore.setSelectedDropDesk({ name: deskStore.selectedDesk(deskNameValue).name, code: deskStore.selectedDesk(deskNameValue).name })
            teammateStore.addTeammate(deskNameValue, teammates)

            createNewDesk.value = false
            setInterval(() => {
                deskStore.changeLoading(false)
            }, 2000);
        }

        watch(createNewDesk, () => {
            deskTeammates.value = [{
                fullName: '',
                phoneNumber: null
            }]
            deskName.value = ''
            if (deskStore.selectedDesk(deskStore.currentDesk)) {
                selectedDesk.value = { name: deskStore.selectedDesk(deskStore.currentDesk).name, code: deskStore.selectedDesk(deskStore.currentDesk).name }
            }
        })

        watch(createNewProject, () => {
            teammates.value = []
            projectName.value = ''
        })

        function addProject() {
            projectStore.changeLoading(true)
            // const projectNameValue = projectName.value
            projectStore.addProject(deskStore.currentDesk, {
                name: projectName.value,
                teammate: teammates.value
            })
            createNewProject.value = false
            // projectStore.setCurrentProject(projectName.value)
            // projectStore.setSelectedDropProject({ name: projectStore.selectedProject(projectNameValue).name, code: projectStore.selectedProject(projectNameValue).name })
            setInterval(() => {
                projectStore.changeLoading(false)
            }, 1000);
        }

        const currentProject = computed(() => {
            if (selectedDesk.value.code !== 0) {
                console.log(projectStore.selectedProject(selectedDesk.value.name))
                return projectStore.selectedProject(selectedDesk.value.name)
            } else {
                return []
            }
        })

        return {
            currentProject,
            addProject,
            removeTeammate,
            deskName,
            sideBar,
            alldesks: deskStore.allDesk,
            componentPage,
            createNewDesk,
            deskTeammates,
            addTeammate,
            createDesk,
            selectedDesk,
            createNewProject,
            teammates,
            currentTeammate,
            projectName
        }
    },
}
</script>

<style lang="scss" scoped>
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

