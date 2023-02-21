<template>
    <nav class="bg-green-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
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
                <span class="cursor-default">{{ currentProject.name }}</span>
            </p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <Avatar icon="pi pi-user" class="" shape="circle" />
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
            <p class="flex items-center p-2 gap-3 rounded-sm mt-4 cursor-default"
                :class="{ 'cursor-not-allowed text-gray-500': Object.values(selectedDesk.projects[id].tasks).length === 0 }">
                <i v-if="Object.values(selectedDesk.projects[id].tasks).length > 0" class="pi pi-angle-down text-yellow-600"
                    style="font-size: 1rem;"></i>
                <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                <span>وضایف</span>
            </p>
            <template v-if="Object.values(selectedDesk.projects[id].tasks).length > 0">
                <p v-for="task in selectedDesk.projects[id].tasks" :key="task.name" @click="taskRoutePush(task)"
                    class="hover:bg-gray-400 hover:text-white hover:font-bold cursor-pointer flex items-center p-2 gap-3 rounded-sm w-10/12 mx-auto">
                    <i class="pi pi-check-circle text-yellow-600" style="font-size: 1rem;"></i>
                    <span>{{ task.name }}</span>
                </p>
            </template>
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <userTask @callPopupTask="createNewTask = true" />
        </div>
    </div>

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
                    <p>{{ currentProject.name }}</p>
                </div>
                <div>
                    <template v-if="projectTeammateDrop.length > 0">
                        <p class="mb-2">فرد مسئول:</p>
                        <Dropdown v-model="selectedDropTeammate" :options="projectTeammateDrop" optionLabel="name"
                            placeholder="همکار" class="drop-down" />
                    </template>
                    <p v-else class="mt-5">همکاری برای این پروژه ثبت نشده است</p>
                </div>
                <div>
                    <template v-if="selectedDropTeammate && Object.values(selectedDropTeammate).length > 0">
                        <p class="mb-2">امتیاز تسک:</p>
                        <Dropdown v-model="selectedDropPoint" :options="taskPointDrop" optionLabel="name"
                            placeholder="امتیاز" class="drop-down" />
                    </template>
                </div>
            </div>
            <div>
                <p class="mb-2">توضیحات:</p>
                <Textarea v-model="taskDescription" :autoResize="true" rows="5" cols="81" />
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger" @click="createNewTask = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success"
                    :disabled="!(taskName.length > 0 && selectedDropPoint && selectedDropTeammate)" @click="addTask" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useRouter } from 'vue-router';
import userTask from '@/components/userTask.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';

export default {
    name: 'UserPanel',

    components: {
        userTask,
        Button,
        Avatar,
        popUp,
        InputText,
        Dropdown,
        Textarea
    },

    props: ["id"],

    setup() {
        const deskStore = useDeskStore();
        const sideBar = ref(true)
        const createNewTask = ref(false)
        const taskName = ref('')
        const selectedDropProject = ref<any>(null)
        const selectedDropTeammate = ref<any>(null)
        const selectedDropPoint = ref<any>(null)
        const taskDescription = ref('')
        const router = useRouter()

        const currentProject: any = computed(() => deskStore.currentProject)
        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        watch(createNewTask, () => {
            taskName.value = ''
            taskDescription.value = ''
            selectedDropProject.value = null
            selectedDropTeammate.value = null
        })

        function addTask() {
            deskStore.changeTaskLoading(true)
            deskStore.setTask(deskStore.currentDesk, currentProject.value.name, taskName.value, taskDescription.value, selectedDropTeammate.value.code,selectedDropPoint.value.code)
            createNewTask.value = false
            setInterval(() => {
                deskStore.changeTaskLoading(false)
            }, 1000);
        }

        const currentProjects = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.projects).length > 0) {
                return selectedDesk.value.projects
            } else {
                return []
            }
        })

        const taskPointDrop = ref([
            { name: 1, code: 1 },
            { name: 3, code: 3 },
            { name: 5, code: 5 }
        ])


        const projectTeammateDrop = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.projects).length > 0 && currentProject.value) {
                const drops = Object.values(currentProject.value.teammates).map((item: any) => {
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

        function taskRoutePush(task: any) {
            deskStore.setCurrentTask(task)
            router.push({
                name: "UserTask",
                params: { id: task.name },
            });
        }

        return {
            addTask,
            taskRoutePush,
            selectedDropProject,
            selectedDropTeammate,
            taskDescription,
            taskName,
            currentProject,
            projectsDrop,
            projectTeammateDrop,
            sideBar,
            selectedDesk,
            createNewTask,
            currentDesk,
            taskPointDrop,
            selectedDropPoint
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

