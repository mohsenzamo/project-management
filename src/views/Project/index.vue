<template>
    <transition name="error">
        <errorMassege v-if="errorHandling" @close="errorHandling = false">
            <p class="m-2">
                مشکلی به وجود آمده لطفا دوباره تلاش کنید
            </p>
        </errorMassege>
    </transition>

    <nav class="bg-green-500 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white flex items-center">
                <RouterLink :to="{ path: '/desk/' + currentDesk._id }">
                    <span class="cursor-pointer">{{ currentDesk.title }}</span>
                </RouterLink>
                <i class="pi pi-angle-left" style="font-size: 1.3rem;"></i>
                <span class="cursor-default">{{ currentProject.title }}</span>
            </p>
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
                class="selected-sidebar flex items-center font-bold py-1.5 px-5 gap-3.5 rounded-sm shadow-sm mt-1 cursor-pointer">
                <i class="text-green-500 pi pi-arrow-right text-lg"></i>
                <span>بازگشت</span>
            </p>
            <RouterLink :to="{ name: 'UserPanel' }">
                <p
                    class="selected-sidebar flex items-center font-bold py-1.5 px-5 gap-3.5 rounded-sm shadow-sm mt-1 cursor-pointer">
                    <i class="home-icon pi pi-home text-lg"></i>
                    <span>داشبورد</span>
                </p>
            </RouterLink>
            <div class="divider-line mt-2.5"></div>
            <div class="h-72 flex flex-col justify-start items-end overflow-y-scroll custom">
                <p class="w-full flex items-center py-1.5 px-5 gap-3.5 rounded-sm cursor-default"
                    :class="{ 'cursor-not-allowed': currentProject.tasks.length === 0 }">
                    <i v-if="currentProject.tasks.length > 0" class="pi pi-angle-down text-yellow-600"
                        style="font-size: 1rem;"></i>
                    <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                    <span>وظایف</span>
                </p>
                <template v-if="currentProject.tasks.length > 0">
                    <p v-for="task in currentProject.tasks" :key="task.name" @click="taskRoutePush(task._id)"
                        class="dashboard-item-hover cursor-pointer flex items-center py-1.5 px-4 gap-3 rounded-sm w-11/12">
                        <i class="pi pi-check-circle text-yellow-600" style="font-size: 1rem;"></i>
                        <span>{{ task.title }}</span>
                    </p>
                </template>
            </div>
            <div v-if="currentDesk.teammates.length > 0 && !projectLoading">
                <Card class="w-full shadow-md">
                    <template #header>
                        <div class="bg-green-500 rounded-t-sm p-2 text-white">
                            همکاران پروژه
                        </div>
                    </template>
                    <template #content>
                        <div class="h-32 overflow-y-scroll project-temmate-box pl-1">
                            <div v-if="userPosition === 'manager'" class="flex items-center gap-2 my-1 cursor-pointer"
                                @click="callProjectTeammate">
                                <Avatar icon="pi pi-plus" shape="circle" class="hover:bg-blue-500 hover:text-white" />
                                <p>اضافه کردن همکار</p>
                            </div>
                            <div v-for="teammate in currentProject.teammates" :key="teammate.username"
                                class="flex items-center gap-2 my-1 justify-between">
                                <p>{{ teammate.username }}</p>
                                <div v-if="userPosition === 'manager' && currentUsername !== teammate.username"
                                    class="relative">
                                    <Avatar icon="pi pi-star" shape="circle"
                                        class="ml-1 cursor-pointer hover:bg-yellow-500 hover:text-white"
                                        @click="teammatePoint = teammate.username" />
                                    <transition name="modal">
                                        <div v-if="teammateDelete === teammate.username"
                                            class="task-popup-delete flex flex-col items-center justify-center gap-2 absolute top-12 left-0 bg-gray-300 w-44 px-2 py-4 rounded-lg shadow-lg z-20">
                                            کاربر حذف شود؟
                                            <div class="flex gap-2">
                                                <Button label="انصراف"
                                                    class="p-button-sm p-button-secondary w-16 h-8 rounded-md"
                                                    @click="teammateDelete = null" />
                                                <Button label="حذف" class="p-button-sm p-button-danger w-16 h-8 rounded-md"
                                                    @click="removeProjectTeammate(teammateDelete)" />
                                            </div>
                                        </div>
                                    </transition>
                                    <Avatar icon="pi pi-times" shape="circle"
                                        class="cursor-pointer hover:bg-red-500 hover:text-white"
                                        @click="setTeammteDelete(teammate)" />
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
            <div v-else class="w-fit mx-auto h-24">
                <ProgressSpinner />
            </div>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white z-20 h-screen pt-14 overflow-y-scroll custom">
            <div v-if="taskLoading && projectLoading" class="w-fit mx-auto h-24">
                <ProgressSpinner />
            </div>
            <template v-else>
                <userTask @callPopupTask="(createNewTask = true) && (isTask = true)"
                    @callPopupSuggestion="(createNewTask = true) && (isSuggestion = true)" @goTask="taskRoutePush" />
            </template>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewTask" @close="createNewTask = false">
            <p v-if="isTask" class="font-bold my-2">تسک جدید ایجاد کنید:</p>
            <p v-if="isSuggestion" class="font-bold my-2">پیشنهاد جدید ایجاد کنید:</p>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3">
                <div class="w-full sm:w-1/3">
                    <p v-if="isTask" class="mb-2">نام تسک:</p>
                    <p v-if="isSuggestion" class="mb-2">نام پیشنهاد:</p>
                    <InputText v-if="isTask" v-model="taskName" type="text" placeholder="نام تسک..."
                        class="w-full rounded-lg py-1.5 px-3" />
                    <InputText v-if="isSuggestion" v-model="taskName" type="text" placeholder="نام پیشنهاد..."
                        class="w-full rounded-lg py-1.5 px-3" />
                </div>
                <div class="w-full sm:w-1/3 text-center">
                    <p class="mb-2">پروژه مربوط:</p>
                    <p class="mt-3">{{ currentProject.title }}</p>
                </div>
                <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <p class="mb-2">تسک مربوط:</p>
                    <Dropdown v-model="selectedDropTask" :options="taskDrop" optionLabel="name" placeholder="تسک" filter
                        class="drop-down" />
                </div>
            </div>
            <div class="flex items-center flex-shrink flex-wrap mb-4">
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <p class="mb-2">فرد مسئول:</p>
                    <Dropdown v-model="selectedDropTeammate" :options="teammatesDrop" optionLabel="name" placeholder="همکار"
                        class="drop-down" />
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template v-if="selectedDropTeammate && Object.values(selectedDropTeammate).length > 0">
                        <p class="mb-2">امتیاز تسک:</p>
                        <InputNumber v-model="selectedPoint" showButtons dir="ltr" inputClass="w-16" :min="0"
                            class="rounded-lg overflow-hidden" />
                    </template>
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template v-if="selectedPoint !== 0">
                        <p class="mb-2">دوره ددلاین:</p>
                        <Dropdown v-model="selectedDropDeadlinePeriod" :options="deadlinePeriodDrop" optionLabel="name"
                            placeholder="دوره" class="drop-down" />
                    </template>
                </div>
                <div class="w-2/4 sm:w-1/4 flex flex-col justify-center items-center mb-2 sm:mb-0">
                    <template
                        v-if="selectedDropDeadlinePeriod && Object.values(selectedDropDeadlinePeriod).length > 0 && selectedPoint !== 0">
                        <p class="mb-2">واحد دوره:</p>
                        <InputNumber v-model="selectedUnit" showButtons dir="ltr" inputClass="w-16" :min="0"
                            class="rounded-lg overflow-hidden" />
                    </template>
                </div>
            </div>
            <div class="flex">
                <div class="w-2/3">
                    <p>توضیحات:</p>
                    <Editor v-model="taskDescription" editorStyle="height: 150px" dir="ltr"
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
                <div class="w-1/3 flex flex-col justify-center items-center gap-2 pt-5">
                    <Button v-if="isTask" label="ایجاد" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                        :disabled="!(taskName.length > 0 && selectedPoint !== 0 && selectedDropTeammate && selectedDropDeadlinePeriod && selectedUnit !== 0 && taskDescription)"
                        :loading="taskLoading" @click="addTask" />
                    <Button v-if="isSuggestion" label="ایجاد" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                        :disabled="!(taskName.length > 0 && selectedPoint !== 0 && selectedDropTeammate && selectedDropDeadlinePeriod && selectedUnit !== 0 && taskDescription)"
                        :loading="taskLoading" @click="addSuggestion" />
                    <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                        @click="createNewTask = false" />
                </div>
            </div>
        </popUp>
    </transition>

    <transition name="modal">
        <popUp v-if="addProjectTeammate" @close="addProjectTeammate = false">
            <p class="font-bold my-3">همکار به پروژه خود دعوت کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="currentProject.title" type="text" placeholder="نام پروژه..."
                    class="w-full sm:w-3/5 h-10 rounded-lg" disabled />
            </div>
            <div class="mb-3">

                <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                <MultiSelect v-model="selectedProjectTeammates" :options="currentDeskTeammate" optionLabel="username"
                    placeholder="همکاران" class="w-full sm:w-2/5 rounded-lg" />
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button :loading="projectLoading" label="ثبت" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                    @click="addTeammate" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="addProjectTeammate = false" />
            </div>
        </popUp>
    </transition>

    <transition name="modal">
        <popUp v-if="teammatePoint" @close="teammatePoint = ''">
            <p class="font-bold my-3">اضافه کردن امتیاز به همکار:</p>
            <div class="mb-3">
                <p class="mb-2">نام کاربری همکار:</p>
                <p>{{ teammatePoint }}</p>
            </div>
            <div class="mb-3 flex w-full">
                <div class="w-1/3">
                    <p class="mb-2">مقدار امتیاز:</p>
                    <InputNumber v-model="extraPoint" showButtons dir="ltr" inputClass="w-16" :min="0"
                        class="rounded-lg overflow-hidden" />
                </div>
                <div class="w-2/3">
                    <p class="mb-2">دلیل امتیاز:</p>
                    <div class="w-full flex items-center justify-center">
                        <Textarea v-model="reasonPoint" :autoResize="true" rows="5" cols="500" class="rounded-lg"
                            placeholder="متن کامنت" />
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button :loading="projectLoading" label="ثبت" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                    @click="increaseTeammatePoint" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="teammatePoint = ''" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import { useProfileStore } from '@/store/profileStore';
import { useSuggestionStore } from '@/store/suggestionStore'
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import userTask from '@/components/userTask.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Editor from 'primevue/editor';
import Card from 'primevue/card';
import { useTaskStore } from '@/store/taskStore';
import ProgressSpinner from 'primevue/progressspinner';
import MultiSelect from 'primevue/multiselect';
import errorMassege from '@/components/errorMassege.vue';

export default {
    name: 'UserPanel',

    components: {
        errorMassege,
        Textarea,
        Editor,
        userTask,
        Card,
        Button,
        Avatar,
        popUp,
        InputText,
        Dropdown,
        InputNumber,
        ProgressSpinner,
        MultiSelect
    },

    props: ["id"],

    beforeRouteEnter(to: any, from: any, next: any) {
        const projectStore = useProjectStore()
        const deskStore = useDeskStore()
        if (Object.values(deskStore.allDesk).length === 0) {
            next({ path: '/panel' })
        } else {
            projectStore.changeLoading(true)
            projectStore.setCurrentProject(to.params.id).then(() => {
                projectStore.changeLoading(false)
                next()
            })
        }
    },

    setup() {
        const deskStore = useDeskStore()
        const projectStore = useProjectStore()
        const taskStore = useTaskStore()
        const profileStore = useProfileStore()
        const suggestionStore = useSuggestionStore()
        const router = useRouter()
        const selectedProjectTeammates = ref<any>([])

        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const createNewTask = ref(false)
        const logOutPopup = ref(false)
        const addProjectTeammate = ref(false)
        const errorHandling = ref(false)
        const isSuggestion = ref(false)
        const isTask = ref(false)
        const teammatePoint = ref('')
        const taskName = ref('')
        const reasonPoint = ref('')
        const selectedDropTeammate = ref<any>(null)
        const selectedDropTask = ref<any>(null)
        const selectedDropDeadlinePeriod = ref<any>(null)
        const selectedPoint = ref<number>(0)
        const extraPoint = ref<number>(0)
        const selectedUnit = ref<number>(0)
        const taskDescription = ref<any>(null)
        const deadlinePeriodDrop = ref([
            { name: 'ساعت', code: 'hour' },
            { name: 'روز', code: 'day' },
            { name: 'ماه', code: 'month' }
        ])
        const teammateDelete = ref<any>(null)

        const projectLoading = computed(() => projectStore.projectLoading)
        const userPosition = computed(() => profileStore.userProfile.position)
        const currentUsername = computed(() => profileStore.userProfile.username)
        const taskLoading = computed(() => taskStore.taskLoading)
        const currentProject: any = computed(() => projectStore.currentProject)
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const teammatesDrop: any = computed(() => {
            let teammateArray: any = []
            currentProject.value.teammates.forEach((teammate: any) => {
                teammateArray.push({ name: teammate.username, code: teammate.username })
            })
            return teammateArray
        })

        const taskDrop: any = computed(() => {
            let arr: any = []
            currentProject.value.tasks.forEach((task: any) => {
                if (task.type === 'task') {
                    arr.push({ name: task.title, code: task._id })
                }
            })
            arr.push({ name: 'هیچ کدام', code: 0 })
            return arr
        })

        const currentDeskTeammate = computed(() => {
            let teamArray: any = []
            if (currentDesk.value && currentDesk.value.teammates.length > 0) {
                currentDesk.value.teammates.forEach((teammateDesk: any) => {
                    let teammateIsThere = false
                    currentProject.value.teammates.forEach((teammateProject: any) => {
                        if (teammateDesk.username === teammateProject.username) {
                            teammateIsThere = true
                        }
                    })
                    if (!teammateIsThere) {
                        teamArray.push({ username: teammateDesk.username })
                    }
                })
                return teamArray
            } else {
                return teamArray
            }
        })

        watch(createNewTask, (newValue: any) => {
            taskName.value = ''
            taskDescription.value = ''
            selectedDropTeammate.value = null
            selectedDropDeadlinePeriod.value = null
            selectedPoint.value = 0
            selectedUnit.value = 0
            if (!newValue) {
                isTask.value = false
                isSuggestion.value = false
            }
        })

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function setTeammteDelete(teammate: any) {
            teammateDelete.value = teammate.username
        }

        function callProjectTeammate() {
            addProjectTeammate.value = true
            // currentProject.value.teammates.forEach((teammate: any) => {
            //     selectedProjectTeammates.value.push({
            //         username: teammate.username
            //     })
            // })
        }

        function addTask() {
            taskStore.changeLoading(true)
            errorHandling.value = false
            taskStore.setTask(currentProject.value._id, taskName.value, taskDescription.value, selectedDropTeammate.value.code, selectedPoint.value, selectedDropDeadlinePeriod.value.code, selectedUnit.value, selectedDropTask.value.code).then(() => {
                taskStore.changeLoading(false)
                createNewTask.value = false
            }).catch(() => {
                taskStore.changeLoading(false)
                createNewTask.value = false
                errorHandling.value = true
            })
        }

        function addSuggestion() {
            taskStore.changeLoading(true)
            errorHandling.value = false
            suggestionStore.postSuggestion(currentProject.value._id, taskName.value, taskDescription.value, selectedDropTeammate.value.code, selectedPoint.value, selectedDropDeadlinePeriod.value.code, selectedUnit.value).then(() => {
                projectStore.setCurrentProject(currentProject.value._id).then(() => {
                    taskStore.changeLoading(false)
                    createNewTask.value = false
                })
            }).catch(() => {
                taskStore.changeLoading(false)
                createNewTask.value = false
                errorHandling.value = true
            })
        }

        function taskRoutePush(taskId: any) {
            router.push({
                name: "UserTask",
                params: { id: taskId },
            });
        }

        function addTeammate() {
            projectStore.changeLoading(true)
            errorHandling.value = false
            projectStore.addTeammates(currentProject.value._id, selectedProjectTeammates.value).then(() => {
                setTimeout(() => {
                    projectStore.setCurrentProject(currentProject.value._id).then(() => {
                        projectStore.changeLoading(false)
                        addProjectTeammate.value = false
                    })
                }, 1000);
            }).catch(() => {
                projectStore.changeLoading(false)
                addProjectTeammate.value = false
                errorHandling.value = true
            })
        }

        function removeProjectTeammate(username: string) {
            projectStore.changeLoading(true)
            teammateDelete.value = null
            errorHandling.value = false
            projectStore.removeTeammate(currentProject.value._id, username).then(() => {
                projectStore.setCurrentProject(currentProject.value._id).then(() => {
                    projectStore.changeLoading(false)
                })
            }).catch(() => {
                projectStore.changeLoading(false)
                errorHandling.value = true
            })
        }

        function increaseTeammatePoint() {
            projectStore.changeLoading(true)
            errorHandling.value = false
            projectStore.increasePoint(teammatePoint.value, extraPoint.value, reasonPoint.value).then(() => {
                projectStore.setCurrentProject(currentProject.value._id).then(() => {
                    projectStore.changeLoading(false)
                    teammatePoint.value = ''
                })
            }).catch(() => {
                projectStore.changeLoading(false)
                teammatePoint.value = ''
                errorHandling.value = true
            })
        }

        return {
            removeProjectTeammate,
            increaseTeammatePoint,
            addTask,
            taskRoutePush,
            addTeammate,
            callProjectTeammate,
            logOut,
            addSuggestion,
            setTeammteDelete,
            isSuggestion,
            selectedDropTask,
            isTask,
            logOutPopup,
            errorHandling,
            userPosition,
            currentDeskTeammate,
            selectedDropTeammate,
            selectedProjectTeammates,
            currentUsername,
            teammateDelete,
            teammatePoint,
            taskDescription,
            taskName,
            currentProject,
            deadlinePeriodDrop,
            teammatesDrop,
            taskDrop,
            reasonPoint,
            sideBar,
            createNewTask,
            currentDesk,
            selectedPoint,
            selectedUnit,
            selectedDropDeadlinePeriod,
            taskLoading,
            addProjectTeammate,
            projectLoading,
            extraPoint,
            router
        }
    },
}
</script>

<style lang="scss">
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

.p-dropdown-panel .p-dropdown-header .p-dropdown-filter {
    margin-right: 0 !important;
}

.project-temmate-box::-webkit-scrollbar {
    width: 5px;
}

.project-temmate-box::-webkit-scrollbar-track {
    background: #f1f1f1;
    @apply rounded;
}

.project-temmate-box::-webkit-scrollbar-thumb {
    background: #888;
    @apply rounded;
}

.p-inputnumber-button-group {
    @apply h-11 my-auto;
}

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

