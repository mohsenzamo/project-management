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
                <sliderTeammate></sliderTeammate>
            </div>

            <div class="flex flex-col md:flex-row gap-3 mt-5 px-3">
                <Card class="w-full shadow-md rounded-lg overflow-hidden">
                    <template #header>
                        <div class="bg-green-600 rounded-t-sm p-2 text-white">
                            کارهای من
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                            <template v-if="isMyTask">
                                <template v-for="task in currentDesk.tasks" :key="task._id">
                                    <div v-if="task.responsible.username === currentUsername"
                                        class="bg-gray-100 flex items-center rounded-md mb-1 p-2 justify-between shadow-md">
                                        <p class="flex items-center">
                                            <Avatar v-if="task.status === 'done'" icon="pi pi-check" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <Avatar v-else-if="task.status === 'undone'" icon="pi pi-times" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <Avatar v-else-if="task.status === 'pending'" icon="pi pi-clock" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <span class="mx-2">{{ task.title }}</span>
                                        </p>
                                        <Avatar :label="task.responsible.username[0]" shape="circle" />
                                    </div>
                                </template>
                            </template>
                            <p v-else class="text-center">تسکی برای انجام ندارم</p>
                        </div>
                    </template>
                </Card>
                <Card class="w-full shadow-md rounded-lg">
                    <template #header>
                        <div class="bg-blue-400 rounded-t-sm p-2 text-white">
                            کارهای دیگران
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                            <template v-if="isTeammateTask">
                                <template v-for="task in currentDesk.tasks" :key="task._id">
                                    <div v-if="task.responsible.username !== currentUsername"
                                        class="bg-gray-100 flex items-center rounded-md mb-1 p-2 justify-between shadow-md">
                                        <p class="flex items-center">
                                            <Avatar v-if="task.status === 'done'" icon="pi pi-check" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <Avatar v-else-if="task.status === 'undone'" icon="pi pi-times" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <Avatar v-else-if="task.status === 'pending'" icon="pi pi-clock" shape="circle"
                                                class="cursor-pointer bg-inherit" />
                                            <span class="mx-2">{{ task.title }}</span>
                                        </p>
                                        <Avatar :label="task.responsible.username[0]" shape="circle" />
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
                        <div class="w-full flex flex-col gap-4 mx-0 overflow-y-scroll h-96 custom">
                            <template v-if="currentDesk.projects.length > 0">
                                <div v-for="project in currentDesk.projects" :key="project._id"
                                    class="bg-gray-100 text-sm py-2 px-4 rounded-md shadow-md">
                                    <p class="text-xl font-medium mb-2">
                                        <span class="ml-1">پروژه:</span>
                                        <span>{{ project.title }}</span>
                                    </p>
                                    <ProgressBar
                                        :value="Math.floor((project.number_of_tasks.done_tasks * 100) / (project.number_of_tasks.done_tasks + project.number_of_tasks.undone_tasks))" />
                                    <div class="flex flex-row-reverse gap-2 mt-2">
                                        <p>
                                            <span class="ml-1">کارهای انجام شده:</span>
                                            <span>{{ project.number_of_tasks.done_tasks }}</span>
                                        </p>
                                        <p>
                                            <span class="ml-1">کارهای باقی مانده:</span>
                                            <span>{{ project.number_of_tasks.undone_tasks }}</span>
                                        </p>
                                    </div>
                                </div>
                            </template>
                            <p v-else class="text-center">پروژه ای موجود نیست</p>
                        </div>
                    </template>
                </Card>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import { useProfileStore } from '@/store/profileStore';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import sliderTeammate from '@/components/sliderTeammate.vue';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import listProject from './listProject.vue';

export default {
    name: 'UserDashboard',

    components: {
        Avatar,
        Card,
        listProject,
        sliderTeammate,
        ProgressBar,
        ProgressSpinner
    },

    setup() {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const profileStore = useProfileStore()

        const checked = ref(true)
        const sideBar = ref(true)

        const deskLoading = computed(() => deskStore.deskLoading)
        const projectLoading = computed(() => projectStore.projectLoading)
        const currentUsername = computed(() => profileStore.userProfile.username)
        const currentDesk = computed(() => deskStore.currentDesk)
        const isMyTask = computed(() => {
            let isIt = false
            currentDesk.value.tasks.forEach((task: any) => {
                if (task.responsible.username === currentUsername.value) {
                    isIt = true
                }
            })
            return isIt
        })

        const isTeammateTask = computed(() => {
            let isIt = false
            currentDesk.value.tasks.forEach((task: any) => {
                if (task.responsible.username !== currentUsername.value) {
                    isIt = true
                }
            })
            return isIt
        })

        return {
            isMyTask,
            isTeammateTask,
            sideBar,
            checked,
            deskLoading,
            projectLoading,
            currentDesk,
            currentUsername
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

