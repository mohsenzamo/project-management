<template>
    <div class="w-full h-screen p-4">
        <div class="mb-4">
            <Button icon="pi pi-plus" label="تسک جدید" class="p-button-info p-button-sm w-28 h-10"
                @click="$emit('callPopupTask')" />
        </div>
        <div class="flex gap-4">
            <div v-if="taskLoading || deskLoading" class="w-4/5 flex mt-40">
                <ProgressSpinner />
            </div>
            <div v-else class="w-4/5">
                <div v-if="notFoundedTask">
                    <InlineMessage severity="warn"> تسکی با این فیلتر پیدا نشد
                    </InlineMessage>
                </div>
                <template v-else>
                    <template v-if="Object.values(currentTask).length === 0">
                        شما تسک تعریف شده ای ندارید لطفا یکی تعریف کنید.
                    </template>
                    <template v-else>
                        <div v-for="task in Object.values(foundedTask).length === 0 ? currentTask : foundedTask"
                            :key="task.name"
                            class="w-full mx-auto mb-4 bg-white rounded-sm flex justify-between items-center p-3 shadow-md">
                            <div class="flex gap-2 items-center">
                                <ToggleButton v-model="task.isDone" onLabel="" offLabel="" onIcon="pi pi-check"
                                    offIcon="pi pi-times" class="p-button-sm w-8 h-8" />
                                <p @click="$emit('goTask', task)" class="cursor-pointer">{{ task.name }}</p>
                            </div>
                            <div class="flex gap-2 items-center relative">
                                <Chip :label="task.deadline.unit + task.deadline.period" icon="pi pi-clock" />
                                <Chip :label="task.responsible" icon="pi pi-user" />
                                <Chip :label="task.point + 'امتیاز'" icon="pi pi-star" />
                                <Avatar icon="pi pi-pencil" shape="circle" class="cursor-pointer hover:bg-yellow-400" />
                                <Avatar icon="pi pi-trash" shape="circle" class="cursor-pointer hover:bg-red-400"
                                    :class="{ 'bg-red-400': taskDelete === task }" @click="taskDelete = task" />
                                <transition name="modal">
                                    <div v-if="taskDelete === task"
                                        class="task-popup flex flex-col items-center justify-center gap-2 absolute top-12 left-0 bg-slate-200 w-44 p-2 rounded shadow-lg z-20">
                                        <i class="pi pi-exclamation-circle" style="font-size: 1.8rem;"></i>
                                        <p>تسک {{ taskDelete.name }} حذف شود؟</p>
                                        <div class="flex gap-2">
                                            <Button label="انصراف" class="p-button-sm p-button-secondary w-16 h-8"
                                                @click="taskDelete = null" />
                                            <Button label="حذف" class="p-button-sm p-button-danger w-16 h-8"
                                                @click="deleteTask" />
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
            <div class="w-1/5 sticky top-4 flex flex-col gap-5">
                <div class="bg-white h-full rounded-sm flex flex-col p-2 gap-3 shadow-md">
                    <InputText type="text" placeholder="جستجو تسک" v-model="taskSearch"
                        :disabled="Object.values(currentTask).length === 0" class="h-10" />
                    <hr class="bg-light-blue border-none" style="height: .1rem;" />
                    <div class="flex items-center gap-2">
                        <TriStateCheckbox v-model="isDoneTask" :disabled="Object.values(currentTask).length === 0" />
                        <p v-if="isDoneTask === true">تسک های
                            انجام شده</p>
                        <p v-else-if="isDoneTask === false">تسک های در حال انجام</p>
                        <p v-else-if="isDoneTask === null"
                            :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">همه تسک ها</p>
                    </div>
                    <div>
                        <p :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">افراد:</p>
                        <Dropdown v-model="selectedDropTeammate" :options="teammatesDrop" optionLabel="name"
                            placeholder="همکار" class="drop-down w-full"
                            :disabled="Object.values(currentTask).length === 0" />
                    </div>
                    <div>
                        <p :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">مرتب سازی:</p>
                        <p class="flex items-center gap-2"
                            :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">
                            <RadioButton name="sort" value="point" v-model="selectedSort"
                                :disabled="Object.values(currentTask).length === 0" />
                            <span>امتیاز</span>
                        </p>
                        <p class="flex items-center gap-2"
                            :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">
                            <RadioButton name="sort" value="deadline" v-model="selectedSort"
                                :disabled="Object.values(currentTask).length === 0" />
                            <span>ددلاین</span>
                        </p>
                        <p class="flex items-center gap-2"
                            :class="{ 'text-gray-400': Object.values(currentTask).length === 0 }">
                            <RadioButton name="sort" value="not" v-model="selectedSort"
                                :disabled="Object.values(currentTask).length === 0" />
                            <span>غیرفعال</span>
                        </p>
                    </div>
                </div>
                <div class="bg-white h-full rounded-sm p-2 shadow-md">
                    <div class="flex justify-center w-full h-28 mx-auto">
                        <Chart v-if="chartData.show" type="doughnut" :data="chartData.data" />
                        <p v-else class="mt-10">تسک ثبت شده ای نیست</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Dropdown from 'primevue/dropdown';
import { useDeskStore } from '@/store/deskStore';
import { ref, computed, watch } from 'vue'
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';
import ToggleButton from 'primevue/togglebutton';
import Avatar from 'primevue/avatar';
import RadioButton from 'primevue/radiobutton';
import Chart from 'primevue/chart';

export default {
    name: "UserTask",

    props: ['refresh'],

    components: {
        Chart,
        RadioButton,
        Dropdown,
        Avatar,
        InlineMessage,
        InputText,
        Button,
        Chip,
        ProgressSpinner,
        TriStateCheckbox,
        ToggleButton
    },

    setup() {
        const taskSearch = ref('')
        const foundedTask = ref<any>({})
        const notFoundedTask = ref(false)
        const deleteTaskPopup = ref(false)
        const isDoneTask = ref(null)
        const taskDelete = ref<any>(null)
        const deskStore = useDeskStore()
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))
        const taskLoading = computed(() => deskStore.taskLoading)
        const selectedDropDesk = computed(() => deskStore.selectedDropDesk)
        const selectedDropTeammate = ref({ name: 'همه', code: 'همه' })
        const deskLoading = computed(() => deskStore.deskLoading)
        const selectedSort = ref('not')

        const desksDrop = computed(() => {
            let result = deskStore.desksDrop.filter(item => item.code !== 0);
            result = result.filter(item => {
                return Object.values(deskStore.allDesk[item.code].projects).length > 0
            })
            return result
        })

        const currentProject: any = computed(() => deskStore.currentProject)

        const projectsDrop: any = computed(() => {
            let projectArray: any = []
            if (Object.values(selectedDesk.value.projects).length > 0) {
                projectArray.push({ name: 'همه پروژ ها', code: 0 })
                Object.keys(selectedDesk.value.projects).forEach((project: any) => {
                    projectArray.push({ name: project, code: project })
                })
                return projectArray
            } else {
                return projectArray
            }
        })

        const teammatesDrop: any = computed(() => {
            let teammateArray: any = []
            teammateArray.push({ name: 'همه', code: 'همه' })
            teammateArray.push({ name: 'خودم', code: 'خودم' })
            Object.values(selectedDesk.value.projects).forEach((project: any) => {
                Object.values(project.teammates).forEach((teammate: any) => {
                    teammateArray.push({ name: teammate.fullName, code: teammate.fullName })
                })
            })
            return teammateArray
        })

        const currentTask: any = computed(() => {
            let taskObj: any = {}
            if (Object.values(selectedDesk.value.projects).length > 0) {
                Object.values(selectedDesk.value.projects).forEach((project: any) => {
                    Object.values(project.tasks).forEach((task: any) => {
                        if (task.projectId === currentProject.value.name) {
                            taskObj[task.name] = task
                        }
                    })
                })
                return taskObj
            } else {
                return taskObj
            }
        })

        const chartData = computed(() => {
            let optionChart: any = {}
            let taskIsDone = 0
            let taskIsNotDone = 0
            Object.values(currentProject.value.tasks).forEach((task: any) => {
                task.isDone ? taskIsDone++ : taskIsNotDone++
            })
            optionChart = {
                show: taskIsDone + taskIsNotDone === 0 ? false : true,
                data: {
                    labels: ['انجام شده', 'در حال انجام'],
                    datasets: [
                        {
                            data: [taskIsDone, taskIsNotDone],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                        }
                    ]
                }
            }
            return optionChart
        })

        function deleteTask() {
            deskStore.changeTaskLoading(true)
            deskStore.deleteTask(taskDelete.value)
            taskDelete.value = null
            setInterval(() => {
                deskStore.changeTaskLoading(false)
            }, 1000);
        }

        watch(currentTask, () => {
            foundedTask.value = {}
            notFoundedTask.value = false
            taskSearch.value = ''
            isDoneTask.value = null
            selectedDropTeammate.value = { name: 'همه', code: 'همه' }
            selectedSort.value = 'not'
        })

        watch([taskSearch, isDoneTask, selectedDropTeammate, selectedSort], ([text, isDone, selectedTeammate, selectedSort]) => {
            foundedTask.value = {}
            notFoundedTask.value = false
            let textArray: any = []
            let isDoneArray: any = []
            let selectedTeammateArray: any = []
            let selectedSortArray: any = []
            let data: any = []
            let result: any = []
            if (text && text.length > 0) {
                Object.values(currentTask.value).forEach((task: any) => {
                    task.name.startsWith(text) ? textArray.push(task) : null
                })
                data.push(textArray)
                result = textArray
            }

            if (isDone !== null) {
                Object.values(currentTask.value).forEach((task: any) => {
                    task.isDone === isDone ? isDoneArray.push(task) : null
                })
                data.push(isDoneArray)
                result = isDoneArray
            }

            if (selectedTeammate.code !== 'همه') {
                Object.values(currentTask.value).forEach((task: any) => {
                    task.responsible === selectedTeammate.code ? selectedTeammateArray.push(task) : null
                })
                data.push(selectedTeammateArray)
                result = selectedTeammateArray
            }

            if (selectedSort !== 'not') {
                if (selectedSort === 'point') {
                    selectedSortArray = Object.values(currentTask.value).sort((r1: any, r2: any) => (r1.point > r2.point) ? 1 : (r1.point < r2.point) ? -1 : 0);
                } else {
                    selectedSortArray = Object.values(currentTask.value).sort((r1: any, r2: any) => (r1.deadline.second > r2.deadline.second) ? 1 : (r1.deadline.second < r2.deadline.second) ? -1 : 0);
                }
                data = [selectedSortArray].concat(data)
                result = selectedSortArray
            }

            if (data.length > 1) {
                result = data.reduce((a: any, b: any) => a.filter((c: any) => b.includes(c)));
            }

            if (!text && isDone === null && selectedTeammate.code === 'همه' && selectedSort === 'not') {
                notFoundedTask.value = false
                foundedTask.value = {}
            } else {
                if (result.length === 0) {
                    notFoundedTask.value = true
                    foundedTask.value = {}
                } else {
                    notFoundedTask.value = false
                    result.forEach((item: any) => {
                        foundedTask.value[item.name] = item
                    })
                }
            }
        })
        return {
            chartData,
            projectsDrop,
            taskDelete,
            currentTask,
            foundedTask,
            selectedSort,
            notFoundedTask,
            taskSearch,
            deleteTask,
            // tasksChecked,
            taskLoading,
            desksDrop,
            selectedDropDesk,
            deskLoading,
            isDoneTask,
            teammatesDrop,
            selectedDropTeammate,
            deleteTaskPopup
        }
    },
}
</script>

<style lang="scss" scoped>
.p-chip {
    @apply bg-slate-100 cursor-pointer rounded-sm shadow-none;

    &:hover {
        @apply bg-slate-200 translate-y-0;
    }

}

.p-chip .p-chip-icon {
    margin-left: .5rem;
    margin-right: 0;
}

.task-popup {
    &::before {
        content: "\A";
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 13px solid;
        position: absolute;
        top: -12px;
        left: 8px;
        @apply border-b-slate-200
    }
}
</style>