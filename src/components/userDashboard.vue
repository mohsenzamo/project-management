<template>
    <div v-if="Object.keys(alldesks).length > 0" class="pt-3 px-2">
        <p>
            میزکارشما :
            <Dropdown v-if="desksDrop.length > 1" v-model="selectedDropDesk" :options="desksDrop" optionLabel="name"
                placeholder="میزکار" class="drop-down" @change="newDeskCall" />
        </p>

        <div v-if="deskLoading" class="w-fit mx-auto mt-40">
            <ProgressSpinner />
        </div>
        <template v-else>

            <div class="my-2 px-3">
                <p class="mb-2">پروژه ها:</p>
                <div v-if="projectLoading" class="w-fit mx-auto">
                    <ProgressSpinner />
                </div>
                <sliderProject v-else @callPopupProject="$emit('callPopupProject')"></sliderProject>
            </div>

            <div class="my-2 px-3">
                <p class="mb-2">همکاران:</p>
                <sliderTeammate></sliderTeammate>
            </div>

            <div class="flex gap-2 mt-5 px-3">
                <Card class="w-full shadow-md">
                    <template #header>
                        <div class="bg-green-400 rounded-t-sm p-2 text-white">
                            کارهای من
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full mx-0">
                            <template v-if="isMyTask">
                                <template v-for="task in currentTask" :key="task.name">
                                    <p v-if="task.responsible === 'خودم'"
                                        class="bg-slate-300 flex items-center rounded-sm mb-1 p-2 shadow">
                                        <ToggleButton v-model="task.isDone" onLabel="" offLabel="" onIcon="pi pi-check"
                                            offIcon="pi pi-times" class="p-button-sm h-8 w-8" />
                                        <span class="mx-2">{{ task.name }}</span>
                                        <small class="text-ellipsis whitespace-nowrap overflow-hidden w-80">{{
                                            task.description
                                        }}</small>
                                    </p>
                                </template>
                            </template>
                            <p v-else class="text-center">تسکی برای انجام ندارم</p>
                        </div>
                    </template>
                </Card>
                <Card class="w-full shadow-md">
                    <template #header>
                        <div class="bg-blue-400 rounded-t-sm p-2 text-white">
                            کارهای دیگران
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full mx-0">
                            <template v-if="isTeammateTask">
                                <template v-for="task in currentTask" :key="task.name">
                                    <div v-if="task.responsible !== 'خودم'"
                                        class="bg-slate-300 flex items-center rounded-sm mb-1 p-2 justify-between shadow">
                                        <p class="flex items-center">
                                            <ToggleButton v-model="task.isDone" onLabel="" offLabel="" onIcon="pi pi-check"
                                                offIcon="pi pi-times" class="p-button-sm h-8 w-8" />
                                            <span class="mx-2">{{ task.name }}</span>
                                            <small class="text-ellipsis whitespace-nowrap overflow-hidden w-80">{{
                                                task.description }}</small>
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
                <Card class="w-full cursor-pointer shadow-md">
                    <template #header>
                        <div class="bg-purple-400 rounded-t-sm p-2 text-white">
                            وضعیت پیشرفت پروژه ها
                        </div>
                    </template>
                    <template #content>
                        <div class="w-full mx-0">
                            <template v-if="Object.values(currentProject).length > 0">
                                <div v-for="project in currentProject" :key="project.name"
                                    class="bg-slate-300 mb-1 text-sm p-2 rounded-sm shadow">
                                    <p class="mb-1">
                                        <span class="ml-1">پروژه:</span>
                                        <span>{{ project.name }}</span>
                                    </p>
                                    <ProgressBar
                                        :value="Math.floor((project.isDoneTask * 100) / (project.isDoneTask + project.isNotDoneTask))" />
                                    <div class="flex flex-row-reverse gap-2 mt-1">
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
            </div>
        </template>
    </div>
    <div v-else class="pt-3 px-2">
        <div class="flex items-center gap-2">
            <p>
                شما میزِکار فعالی ندارید. لطفاً جهت ادامه یک میزِکار جدید برای خود بسازید:
            </p>
            <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm" @click="$emit('callPopup')" />
        </div>
    </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { ref, computed, watch, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import Card from 'primevue/card';
import sliderProject from '@/components/sliderProject.vue';
import sliderTeammate from '@/components/sliderTeammate.vue';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import ToggleButton from 'primevue/togglebutton';

export default {
    name: 'UserDashboard',

    components: {
        Dropdown,
        Avatar,
        Button,
        Card,
        sliderProject,
        sliderTeammate,
        ProgressBar,
        ProgressSpinner,
        ToggleButton
    },

    setup(props: any, context: any) {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();

        const deskLoading = computed(() => {
            return deskStore.deskLoading
        })

        const projectLoading = computed(() => {
            return projectStore.projectLoading
        })

        function newDeskCall(code: any) {
            if (code.value.code === 0) {
                context.emit('callCreate')
            } else {
                deskStore.changeLoading(true)
                deskStore.setCurrentDesk(code.value.name)
                deskStore.setSelectedDropDesk({ name: code.value.name, code: code.value.name })
                setInterval(() => {
                    deskStore.changeLoading(false)
                }, 3000);
            }
        }

        const checked = ref(true)
        const sideBar = ref(true)

        const desksDrop = computed(() => {
            return deskStore.desksDrop
        })

        const selectedDropDesk = computed(() => {
            return deskStore.selectedDropDesk
        })

        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        const currentTask: any = computed(() => {
            let taskObj: any = {}
            if (Object.values(selectedDesk.value.projects).length > 0) {
                Object.values(selectedDesk.value.projects).forEach((project: any) => {
                    Object.values(project.tasks).forEach((task: any) => {
                        // task.isDone ? tasksChecked.value.push(task) : null
                        taskObj[task.name] = task
                    })
                })
                return taskObj
            } else {
                return taskObj
            }
        })

        const isTeammateTask: any = computed(() => {
            let isThere = false
            Object.values(currentTask.value).forEach((task: any) => {
                task.responsible !== 'خودم' ? isThere = true : null
            })
            return isThere
        })

        const isMyTask: any = computed(() => {
            let isThere = false
            Object.values(currentTask.value).forEach((task: any) => {
                task.responsible === 'خودم' ? isThere = true : null
            })
            return isThere
        })

        const currentProject: any = computed(() => {
            if (Object.values(selectedDesk.value.projects).length > 0) {
                console.log(selectedDesk.value.projects)
                let newProjectObj: any = {}
                Object.values(selectedDesk.value.projects).forEach((project: any) => {
                    let isDoneTask = 0
                    let isNotDoneTask = 0
                    Object.values(project.tasks).forEach((task: any) => {
                        task.isDone ? isDoneTask++ : isNotDoneTask++
                    })
                    const pjn = project.name
                    newProjectObj[pjn] = Object.assign(project, { isDoneTask: isDoneTask, isNotDoneTask: isNotDoneTask })
                })
                console.log(newProjectObj)
                return newProjectObj
            } else {
                return {}
            }
        })

        return {
            newDeskCall,
            isTeammateTask,
            currentProject,
            isMyTask,
            currentTask,
            selectedDropDesk,
            sideBar,
            checked,
            desksDrop,
            alldesks: deskStore.allDesk,
            deskLoading,
            projectLoading
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

