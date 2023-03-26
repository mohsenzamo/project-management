<template>
    <div class="w-full h-screen p-4">
        <div v-if="userPosition === 'manager'" class="w-full flex mb-4">
            <Button icon="pi pi-plus" label="تسک جدید" class="p-button-info p-button-sm text-sm rounded-md"
                @click="$emit('callPopupTask')" />
        </div>
        <div class="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start gap-4">
            <div v-if="taskLoading || deskLoading" class="w-full md:w-4/5 flex mt-40">
                <ProgressSpinner />
            </div>
            <div v-else class="w-full md:w-4/5">
                <div v-if="notFoundedTask">
                    <InlineMessage severity="warn"> تسکی با این فیلتر پیدا نشد
                    </InlineMessage>
                </div>
                <template v-else>
                    <template v-if="currentTask.length === 0">
                        شما تسک تعریف شده ای ندارید لطفا یکی تعریف کنید.
                    </template>
                    <template v-else>
                        <div v-for="task in foundedTask.length === 0 ? currentTask : foundedTask" :key="task._id"
                            class="w-full mx-auto mb-3 bg-slate-100 rounded-xl flex justify-between items-center border-r-2 border-green-500 py-2 px-3 shadow-md">
                            <div class="flex gap-2 items-center">
                                <Avatar v-if="task.status === 'done'" icon="pi pi-check" shape="circle"
                                    class="cursor-pointer bg-inherit" />
                                <Avatar v-else-if="task.status === 'undone'" icon="pi pi-times" shape="circle"
                                    class="cursor-pointer bg-inherit" />
                                <Avatar v-else-if="task.status === 'pending'" icon="pi pi-clock" shape="circle"
                                    class="cursor-pointer bg-inherit" />
                                <p @click="$emit('goTask', task)" class="cursor-pointer">{{ task.title }}</p>
                            </div>
                            <div class="flex gap-2 items-center relative">
                                <Chip v-if="task.deadline.unit === 'month'" :label="task.deadline.n + 'ماه'"
                                    icon="pi pi-clock"
                                    class="hidden sm:flex bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                <Chip v-else-if="task.deadline.unit === 'hour'" :label="task.deadline.n + 'ساعت'"
                                    icon="pi pi-clock"
                                    class="hidden sm:flex bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                <Chip v-else-if="task.deadline.unit === 'day'" :label="task.deadline.n + 'روز'"
                                    icon="pi pi-clock"
                                    class="hidden sm:flex bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                <Chip :label="task.responsible.username" icon="pi pi-user"
                                    class="hidden sm:flex bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                <Chip :label="task.point + 'امتیاز'" icon="pi pi-star"
                                    class="hidden sm:flex bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                <Avatar icon="pi pi-bars" shape="circle"
                                    class="flex sm:hidden cursor-pointer bg-gray-300 hover:bg-inherit"
                                    :class="{ 'bg-gray-300': taskBars === task }"
                                    @click="(taskBars ? taskBars = null : taskBars = task) && (taskDelete = null)" />
                                <transition name="modal">
                                    <div v-if="taskBars === task"
                                        class="task-popup-bars flex flex-col items-center justify-center gap-2 absolute top-12 left-20 bg-gray-300 w-44 px-2 py-4 rounded-lg shadow-lg z-20">
                                        <Chip v-if="taskBars.deadline.unit === 'month'" :label="taskBars.deadline.n + 'ماه'"
                                            icon="pi pi-clock"
                                            class="bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                        <Chip v-else-if="taskBars.deadline.unit === 'hour'"
                                            :label="taskBars.deadline.n + 'ساعت'" icon="pi pi-clock"
                                            class="bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                        <Chip v-else-if="taskBars.deadline.unit === 'day'"
                                            :label="taskBars.deadline.n + 'روز'" icon="pi pi-clock"
                                            class="bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                        <Chip :label="taskBars.responsible.username" icon="pi pi-user"
                                            class="bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                        <Chip :label="taskBars.point + 'امتیاز'" icon="pi pi-star"
                                            class="bg-inherit hover:bg-gray-400 hover:text-white rounded-lg" />
                                        <Button label="بستن" class="p-button-sm p-button-secondary w-16 h-8 rounded-md"
                                            @click="taskBars = null" />
                                    </div>
                                </transition>
                                <Avatar v-if="userPosition === 'manager'" icon="pi pi-pencil" shape="circle"
                                    class="cursor-pointer bg-inherit hover:bg-yellow-400 hover:text-white"
                                    @click="setChangedTask(task)" />
                                <Avatar v-if="userPosition === 'manager'" icon="pi pi-trash" shape="circle"
                                    class="cursor-pointer bg-inherit hover:bg-red-400 hover:text-white"
                                    :class="{ 'bg-red-400': taskDelete === task }"
                                    @click="(taskDelete = task) && (taskBars = false)" />
                                <transition name="modal">
                                    <div v-if="taskDelete === task"
                                        class="task-popup-delete flex flex-col items-center justify-center gap-2 absolute top-12 left-0 bg-gray-300 w-44 px-2 py-4 rounded-lg shadow-lg z-20">
                                        <i class="pi pi-exclamation-circle" style="font-size: 1.8rem;"></i>
                                        <p>تسک {{ taskDelete.title }} حذف شود؟</p>
                                        <div class="flex gap-2">
                                            <Button label="انصراف"
                                                class="p-button-sm p-button-secondary w-16 h-8 rounded-md"
                                                @click="taskDelete = null" />
                                            <Button label="حذف" class="p-button-sm p-button-danger w-16 h-8 rounded-md"
                                                @click="deleteTask" />
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
            <div class="w-full sm:w-3/6 md:w-1/5 sticky top-4 flex flex-col gap-5">
                <div class="bg-white h-full rounded-xl flex flex-col p-3 gap-3 shadow-md border-t-2 border-green-500">
                    <InputText type="text" placeholder="جستجو تسک" v-model="taskSearch" :disabled="currentTask.length === 0"
                        class="h-10 rounded-lg" />
                    <div class="divider-line"></div>
                    <div class="flex items-center gap-2">
                        <TriStateCheckbox v-model="isDoneTask" :disabled="currentTask.length === 0" />
                        <p v-if="isDoneTask === true">تسک های
                            انجام شده</p>
                        <p v-else-if="isDoneTask === false">تسک های در حال انجام</p>
                        <p v-else-if="isDoneTask === null" :class="{ 'text-gray-400': currentTask.length === 0 }">همه تسک ها
                        </p>
                    </div>
                    <div>
                        <p :class="{ 'text-gray-400': currentTask.length === 0 }">افراد:</p>
                        <Dropdown v-model="selectedDropTeammate" :options="teammatesDrop" optionLabel="name"
                            placeholder="همکار" class="drop-down w-full text-md border border-slate-300 rounded-lg"
                            :disabled="currentTask.length === 0" />
                    </div>
                    <div>
                        <p :class="{ 'text-gray-400': currentTask.length === 0 }">مرتب سازی:</p>
                        <p class="flex items-center gap-2" :class="{ 'text-gray-400': currentTask.length === 0 }">
                            <RadioButton name="sort" value="point" v-model="selectedSort"
                                :disabled="currentTask.length === 0" />
                            <span>امتیاز</span>
                        </p>
                        <p class="flex items-center gap-2" :class="{ 'text-gray-400': currentTask.length === 0 }">
                            <RadioButton name="sort" value="deadline" v-model="selectedSort"
                                :disabled="currentTask.length === 0" />
                            <span>ددلاین</span>
                        </p>
                        <p class="flex items-center gap-2" :class="{ 'text-gray-400': currentTask.length === 0 }">
                            <RadioButton name="sort" value="not" v-model="selectedSort"
                                :disabled="currentTask.length === 0" />
                            <span>غیرفعال</span>
                        </p>
                    </div>
                </div>
                <div class="bg-white h-full rounded-xl p-2 shadow-md border-t-2 border-green-500 mb-4">
                    <div class="flex justify-center w-full h-28 mx-auto">
                        <Chart v-if="chartData.show" type="doughnut" :data="chartData.data" />
                        <p v-else class="mt-10">تسک ثبت شده ای نیست</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="taskChange" @close="taskChange = null">
            <p class="font-bold my-3">تسک خود را ویرایش کنید:</p>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3">
                <div class="w-full sm:w-1/2">
                    <p class="mb-2">نام تسک:</p>
                    <InputText v-model="taskChange.title" type="text" placeholder="نام تسک..."
                        class="w-full rounded-lg py-1.5 px-3" />
                </div>
                <div class="w-full sm:w-1/2">
                    <p class="mb-2">پروژه مربوط:</p>
                    <p class="mt-3">{{ currentProject.title }}</p>
                </div>
            </div>
            <div class="flex items-center flex-shrink flex-wrap mb-4">
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <p class="mb-2">فرد مسئول:</p>
                    <Dropdown v-model="selectedDropTeammateChange" :options="teammatesDropChange" optionLabel="name"
                        placeholder="همکار" class="drop-down" />
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template v-if="selectedDropTeammateChange && Object.values(selectedDropTeammateChange).length > 0">
                        <p class="mb-2">امتیاز تسک:</p>
                        <InputNumber v-model="taskChange.point" showButtons dir="ltr" inputClass="w-16" :min="0"
                            class="rounded-lg overflow-hidden" />
                    </template>
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template v-if="taskChange !== 0">
                        <p class="mb-2">دوره ددلاین:</p>
                        <Dropdown v-model="deadlinePeriod" :options="deadlinePeriodDrop" optionLabel="name"
                            placeholder="دوره" class="drop-down" />
                    </template>
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template v-if="taskChange && Object.values(taskChange).length > 0 && taskChange.point !== 0">
                        <p class="mb-2">واحد دوره:</p>
                        <InputNumber v-model="taskChange.deadline.n" showButtons dir="ltr" inputClass="w-16" :min="0"
                            class="rounded-lg overflow-hidden" />
                    </template>
                </div>
            </div>
            <div class="mb-5">
                <p class="mb-2">توضیحات:</p>
                <Editor v-model="taskChange.description" editorStyle="height: 150px" dir="ltr"
                    class="rounded-xl overflow-hidden">
                    <template #toolbar>
                        <span class="ql-formats">
                            <button class="ql-bold"></button>
                            <button class="ql-italic"></button>
                            <button class="ql-underline"></button>
                            <button class="ql-link"></button>
                            <select class="ql-size">
                                <option value="small"></option>
                                <option selected></option>
                                <option value="large"></option>
                                <option value="huge"></option>
                            </select>
                            <button class="ql-direction" value="rtl"></button>
                        </span>
                    </template>
                </Editor>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="ثبت" class="p-button-sm p-button-success w-20 h-10 rounded-lg" :loading="taskLoading"
                    :disabled="!(taskChange.title.length > 0 && taskChange.point !== 0 && selectedDropTeammateChange && deadlinePeriod && taskChange.deadline.n !== 0 && taskChange.description)"
                    @click="editTask" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="taskChange = null" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '@/store/taskStore';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import { useProfileStore } from '@/store/profileStore';
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';
import Avatar from 'primevue/avatar';
import RadioButton from 'primevue/radiobutton';
import Chart from 'primevue/chart';
import popUp from '@/components/popUp.vue';
import InputNumber from 'primevue/inputnumber';
import Editor from 'primevue/editor';
import ToggleButton from 'primevue/togglebutton';
import Checkbox from 'primevue/checkbox';

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
        popUp,
        InputNumber,
        Editor
    },

    setup() {
        const projectStore = useProjectStore()
        const taskStore = useTaskStore()
        const profileStore = useProfileStore()
        const deskStore = useDeskStore()

        const taskSearch = ref('')
        const foundedTask = ref<any>([])
        const notFoundedTask = ref(false)
        const isDoneTask = ref(null)
        const taskDelete = ref<any>(null)
        const selectedDropTeammate = ref({ name: 'همه', code: 'همه' })
        const selectedDropTeammateChange = ref<any>(null)
        const selectedSort = ref('not')
        const taskBars = ref<any>(null)
        const taskChange = ref<any>(null)
        const deadlinePeriod = ref<any>(null)
        const deadlinePeriodDrop = ref([
            { name: 'ساعت', code: 'hour' },
            { name: 'روز', code: 'day' },
            { name: 'ماه', code: 'month' }
        ])

        const deskLoading = computed(() => deskStore.deskLoading)
        const currentTask: any = computed(() => currentProject.value.tasks)
        const userPosition = computed(() => profileStore.userProfile.position)
        const taskLoading = computed(() => taskStore.taskLoading)
        const currentProject: any = computed(() => projectStore.currentProject)
        const teammatesDrop: any = computed(() => {
            let teammateArray: any = []
            teammateArray.push({ name: 'همه', code: 'همه' })
            currentProject.value.teammates.forEach((teammate: any) => {
                teammateArray.push({ name: teammate.username, code: teammate.username })
            })
            return teammateArray
        })
        const teammatesDropChange: any = computed(() => {
            let teammateArray: any = []
            currentProject.value.teammates.forEach((teammate: any) => {
                teammateArray.push({ name: teammate.username, code: teammate.username })
            })
            return teammateArray
        })
        const chartData = computed(() => {
            const optionChart = {
                show: currentProject.value.number_of_tasks.done_tasks + currentProject.value.number_of_tasks.undone_tasks === 0 ? false : true,
                data: {
                    labels: ['انجام شده', 'در حال انجام'],
                    datasets: [
                        {
                            data: [currentProject.value.number_of_tasks.done_tasks, currentProject.value.number_of_tasks.undone_tasks],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                        }
                    ]
                }
            }
            return optionChart
        })

        function deleteTask() {
            taskStore.changeLoading(true)
            taskStore.deleteTask(currentProject.value._id, taskDelete.value).then(() => {
                taskStore.changeLoading(true)
                taskDelete.value = null
            })
        }

        watch(currentTask, () => {
            foundedTask.value = []
            notFoundedTask.value = false
            taskSearch.value = ''
            isDoneTask.value = null
            selectedDropTeammate.value = { name: 'همه', code: 'همه' }
            selectedSort.value = 'not'
        })

        watch([taskSearch, isDoneTask, selectedDropTeammate, selectedSort], ([text, isDone, selectedTeammate, selectedSort]) => {
            foundedTask.value = []
            notFoundedTask.value = false
            let textArray: any = []
            let isDoneArray: any = []
            let selectedTeammateArray: any = []
            let selectedSortArray: any = []
            let data: any = []
            let result: any = []
            if (text && text.length > 0) {
                currentTask.value.forEach((task: any) => {
                    task.title.startsWith(text) ? textArray.push(task) : null
                })
                data.push(textArray)
                result = textArray
            }

            if (isDone !== null) {
                currentTask.value.forEach((task: any) => {
                    if (isDone) {
                        task.status === 'done' ? isDoneArray.push(task) : null
                    } else {
                        task.status === 'undone' ? isDoneArray.push(task) : null
                    }
                })
                data.push(isDoneArray)
                result = isDoneArray
            }

            if (selectedTeammate.code !== 'همه') {
                currentTask.value.forEach((task: any) => {
                    task.responsible.username === selectedTeammate.code ? selectedTeammateArray.push(task) : null
                })
                data.push(selectedTeammateArray)
                result = selectedTeammateArray
            }

            // if (selectedSort !== 'not') {
            //     if (selectedSort === 'point') {
            //         selectedSortArray = Object.values(currentTask.value).sort((r1: any, r2: any) => (r1.point > r2.point) ? 1 : (r1.point < r2.point) ? -1 : 0);
            //     } else {
            //         selectedSortArray = Object.values(currentTask.value).sort((r1: any, r2: any) => (r1.deadline.second > r2.deadline.second) ? 1 : (r1.deadline.second < r2.deadline.second) ? -1 : 0);
            //     }
            //     data = [selectedSortArray].concat(data)
            //     result = selectedSortArray
            // }

            if (data.length > 1) {
                result = data.reduce((a: any, b: any) => a.filter((c: any) => b.includes(c)));
            }

            if (!text && isDone === null && selectedTeammate.code === 'همه' && selectedSort === 'not') {
                notFoundedTask.value = false
                foundedTask.value = []
            } else {
                if (result.length === 0) {
                    notFoundedTask.value = true
                    foundedTask.value = []
                } else {
                    notFoundedTask.value = false
                    result.forEach((item: any) => {
                        foundedTask.value.push(item)
                    })
                }
            }
        })

        function setChangedTask(task: any) {
            taskChange.value = Object.assign({}, task)
            selectedDropTeammateChange.value = { name: task.responsible.username, code: task.responsible.username }
            if (task.deadline.unit === 'month') {
                deadlinePeriod.value = { name: 'ماه', code: 'month' }
            } else if (task.deadline.unit === 'day') {
                deadlinePeriod.value = { name: 'روز', code: 'day' }
            } else if (task.deadline.unit === 'hour') {
                deadlinePeriod.value = { name: 'ساعت', code: 'hour' }
            }
        }

        function editTask() {
            taskStore.changeLoading(true)
            taskStore.editTask(currentProject.value._id, taskChange.value, selectedDropTeammateChange.value.code, deadlinePeriod.value.code).then(() => {
                taskStore.changeLoading(false)
                taskChange.value = null
            })
        }
        return {
            editTask,
            setChangedTask,
            deleteTask,
            chartData,
            teammatesDropChange,
            taskDelete,
            currentTask,
            deadlinePeriod,
            foundedTask,
            taskLoading,
            selectedSort,
            notFoundedTask,
            taskSearch,
            taskChange,
            deskLoading,
            isDoneTask,
            teammatesDrop,
            selectedDropTeammate,
            selectedDropTeammateChange,
            taskBars,
            currentProject,
            deadlinePeriodDrop,
            userPosition
        }
    },
}
</script>

<style lang="scss" scoped>
.p-inputtext {
    padding: 4px 8px !important;
}

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

.task-popup-delete {
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

.task-popup-bars {
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
</style>