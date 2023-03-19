<template>
    <div class="pt-3 px-2">
        <div v-if="deskLoading" class="w-fit mx-auto mt-40">
            <ProgressSpinner />
        </div>
        <template v-else>
            <div class="my-2 px-3">
                <p class="text-2xl font-bold mb-2">پروژه ها:</p>
                <div v-if="projectLoading" class="w-fit mx-auto h-80 pt-24">
                    <ProgressSpinner />
                </div>
                <listProject v-else @callPopupProject="$emit('callPopupProject')" />
            </div>

            <div class="my-2 px-3">
                <p class="text-2xl font-bold mb-2">همکاران:</p>
                <div v-if="teammateLoading" class="w-fit mx-auto h-24">
                    <ProgressSpinner />
                </div>
                <sliderTeammate v-else></sliderTeammate>
            </div>

            <!-- <div class="flex flex-col md:flex-row gap-3 mt-5 px-3">
                <Card class="w-full shadow-md rounded-lg overflow-hidden">
                    <template #header>
                        <div class="bg-green-600 rounded-t-sm p-2 text-white">
                            کارهای من
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full flex flex-col gap-4 mx-0">
                            <template v-if="isMyTask">
                                <template v-for="task in currentTask" :key="task.name">
                                    <p v-if="task.responsible === 'خودم'"
                                        class="bg-gray-100 flex items-center rounded-md mb-1 p-2  shadow-md">
                                        <ToggleButton v-model="task.isDone" onLabel="" offLabel="" onIcon="pi pi-check"
                                            offIcon="pi pi-times" class="p-button-sm h-8 w-8" />
                                        <span class="mx-2">{{ task.name }}</span>
                                    </p>
                                </template>
                            </template>
                            <p v-else class="text-center">تسکی برای انجام ندارم</p>
                        </div>
                    </template>
                </Card>
                <Card class="w-full shadow-md rounded-lg overflow-hidden">
                    <template #header>
                        <div class="bg-blue-400 rounded-t-sm p-2 text-white">
                            کارهای دیگران
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full flex flex-col gap-4 mx-0">
                            <template v-if="isTeammateTask">
                                <template v-for="task in currentTask" :key="task.name">
                                    <div v-if="task.responsible !== 'خودم'"
                                        class="bg-gray-100 flex items-center rounded-md mb-1 p-2 justify-between shadow-md">
                                        <p class="flex items-center">
                                            <ToggleButton v-model="task.isDone" onLabel="" offLabel="" onIcon="pi pi-check"
                                                offIcon="pi pi-times" class="p-button-sm h-8 w-8" />
                                            <span class="mx-2">{{ task.name }}</span>
                                        </p>
                                        <Avatar :label="task.responsible[0]" shape="circle" />
                                    </div>
                                </template>
                            </template>
                            <p v-else class="text-center">تسکی برای پیگیری نیست</p>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="my-3 px-3">
                <Card class="w-full shadow-md rounded-lg overflow-hidden">
                    <template #header>
                        <div class="bg-purple-400 rounded-t-sm p-2 text-white">
                            وضعیت پیشرفت پروژه ها
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full flex flex-col gap-4 mx-0">
                            <template v-if="Object.values(currentProjects).length > 0">
                                <div v-for="project in currentProjects" :key="project.name"
                                    class="bg-gray-100 text-sm py-2 px-4 rounded-md shadow-md">
                                    <p class="text-xl font-medium mb-2">
                                        <span class="ml-1">پروژه:</span>
                                        <span>{{ project.name }}</span>
                                    </p>
                                    <ProgressBar
                                        :value="Math.floor((project.isDoneTask * 100) / (project.isDoneTask + project.isNotDoneTask))" />
                                    <div class="flex flex-row-reverse gap-2 mt-2">
                                        <p>
                                            <span class="ml-1">کارهای انجام شده:</span>
                                            <span>{{ project.isDoneTask }}</span>
                                        </p>
                                        <p>
                                            <span class="ml-1">کارهای باقی مانده:</span>
                                            <span>{{ project.isNotDoneTask }}</span>
                                        </p>
                                    </div>
                                </div>
                            </template>
                            <p v-else class="text-center">پروژه ای موجود نیست</p>
                        </div>
                    </template>
                </Card>
            </div> -->
        </template>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import Card from 'primevue/card';
import sliderTeammate from '@/components/sliderTeammate.vue';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import ToggleButton from 'primevue/togglebutton';
import listProject from './listProject.vue';

export default {
    name: 'UserDashboard',

    components: {
        // Avatar,
        // Card,
        listProject,
        sliderTeammate,
        // ProgressBar,
        ProgressSpinner,
        // ToggleButton
    },

    setup() {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const deskLoading = computed(() => deskStore.deskLoading)
        const projectLoading = computed(() => projectStore.projectLoading)
        const teammateLoading = computed(() => deskStore.teammateLoading)
        // const currentProjects: any = computed(() => {
        //     if (Object.values(selectedDesk.value.projects).length > 0) {
        //         let projectObj: any = {}
        //         Object.values(selectedDesk.value.projects).forEach((project: any) => {
        //             let isDoneTask = 0
        //             let isNotDoneTask = 0
        //             if (Object.values(project.tasks).length > 0) {
        //                 Object.values(project.tasks).forEach((task: any) => {
        //                     task.isDone ? isDoneTask++ : isNotDoneTask++
        //                 })
        //             }
        //             const projectNameValue = project.name
        //             projectObj[projectNameValue] = Object.assign(project, { isDoneTask: isDoneTask, isNotDoneTask: isNotDoneTask })
        //         })
        //         return projectObj
        //     } else {
        //         return {}
        //     }
        // })

        const checked = ref(true)
        const sideBar = ref(true)

        const desksDrop = computed(() => deskStore.desksDrop)
        const selectedDropDesk = computed(() => deskStore.selectedDropDesk)
        const currentDesk: any = computed(() => deskStore.currentDesk)
        // const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        // const currentTask: any = computed(() => {
        //     let taskObj: any = {}
        //     if (Object.values(selectedDesk.value.projects).length > 0) {
        //         Object.values(selectedDesk.value.projects).forEach((project: any) => {
        //             Object.values(project.tasks).forEach((task: any) => {
        //                 taskObj[task.name] = task
        //             })
        //         })
        //         return taskObj
        //     } else {
        //         return taskObj
        //     }
        // })

        // const isTeammateTask: any = computed(() => {
        //     let isThere = false
        //     Object.values(currentTask.value).forEach((task: any) => {
        //         task.responsible !== 'خودم' ? isThere = true : null
        //     })
        //     return isThere
        // })

        // const isMyTask: any = computed(() => {
        //     let isThere = false
        //     Object.values(currentTask.value).forEach((task: any) => {
        //         task.responsible === 'خودم' ? isThere = true : null
        //     })
        //     return isThere
        // })

        return {
            // isTeammateTask,
            // currentProjects,
            // isMyTask,
            // currentTask,
            selectedDropDesk,
            sideBar,
            checked,
            desksDrop,
            alldesks: deskStore.allDesk,
            deskLoading,
            projectLoading,
            teammateLoading
        }
    },
}
</script>

<style lang="scss">
.p-component {
    @apply font-yekan
}

.p-dropdown {
    @apply bg-transparent border-0 border-b-2 rounded-none border-light-blue
}

.p-dropdown:not(.p-disabled):hover {
    @apply border-dark-purple
}

.p-dropdown:not(.p-disabled).p-focus {
    @apply shadow-none border-light-blue
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    @apply py-1 px-2
}

.p-dropdown-panel .p-dropdown-items {
    @apply p-0
}

.p-button::v-deep .p-button-icon-left {
    margin-left: .5rem;
    margin-right: 0;
}

.p-progressbar .p-progressbar-value {
    @apply bg-light-blue;
}

.p-chip .p-chip-icon {
    margin-left: .5rem;
}

.custom::-webkit-scrollbar {
    display: none;
}

@keyframes p-progress-spinner-color {

    100%,
    0% {
        stroke: #ffa700;
    }
}
</style>

