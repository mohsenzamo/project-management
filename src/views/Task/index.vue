<template>
    <transition name="error">
        <errorMassege v-if="errorHandling" @close="errorHandling = false">
            <p class="m-2">
                مشکلی به وجود آمده لطفا دوباره تلاش کنید
            </p>
        </errorMassege>
    </transition>

    <nav class="bg-yellow-500 flex justify-between py-1 absolute top-0 left-0 z-40 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white flex items-center">
                <RouterLink :to="{ path: '/desk/' + currentDesk._id }">
                    <span class="cursor-pointer">{{ currentDesk.title }}</span>
                </RouterLink>
                <i class="pi pi-angle-left" style="font-size: 1.3rem;"></i>
                <RouterLink :to="{ path: '/project/' + currentProject._id }">
                    <span class="cursor-pointer">{{ currentProject.title }}</span>
                </RouterLink>
                <i class="pi pi-angle-left" style="font-size: 1.3rem;"></i>
                <span class="cursor-default">{{ currentTask.title }}</span>
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
                <i class="text-yellow-500 pi pi-arrow-right text-lg"></i>
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
        </div>
        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white z-20 h-screen pt-14 sm:pt-28 overflow-y-scroll custom px-0 sm:px-12">
            <Card
                class="w-full shadow-none sm:shadow-md relative rounded-2xl border-t-0 sm:border-t-4 border-orange-300 mb-0 sm:mb-10">
                <template #header>
                    <div class="bg-gray-100 w-14 h-14 absolute top-5 left-5 rounded-full flex items-center justify-center shadow-lg"
                        @click="openStatus = !openStatus">
                        <i class="pi pi-user" style="font-size: 1.2rem"></i>
                        <i v-if="currentTask.status === 'done'"
                            class="pi pi-check absolute top-0 right-0 text-green-500"></i>
                        <i v-else-if="currentTask.status === 'pending'"
                            class="pi pi-clock absolute top-0 right-0 text-blue-500"></i>
                        <i v-else-if="currentTask.status === 'undone'"
                            class="pi pi-times-circle absolute top-0 right-0 text-red-500"></i>
                    </div>
                    <div class="absolute top-5 left-24 flex flex-col items-center justify-center">
                        <Knob v-model="deadlineTask" :valueTemplate="strdeadline" :max="100" :size="62"
                            valueColor="SlateGray" class="font-iransans" readonly />
                        <p v-if="currentTask.deadline.unit === 'day'">روز</p>
                        <p v-else-if="currentTask.deadline.unit === 'hour'">ساعت</p>
                        <p v-else-if="currentTask.deadline.unit === 'month'">ماه</p>
                    </div>
                    <div v-if="currentTask.type === 'suggestion'"
                        class="cursor-pointer bg-gray-100 absolute top-7 left-44 rounded-full flex items-center justify-center shadow-lg"
                        @click="openStatus = !openStatus">
                        <Button label="پیشنهاد در انتظار تایید" icon="pi pi-question" :loading="taskLoading"
                            class="p-button-sm p-button-warning text-md rounded-lg" @click="setSuggestionToTask"
                            :disabled="userPosition !== 'manager'" />
                    </div>
                    <template v-if="currentTask.type === 'task'">
                        <div v-if="currentTask.status === 'undone' && currentTask.responsible.username === userName"
                            class="cursor-pointer bg-gray-100 absolute top-7 left-44 rounded-full flex items-center justify-center shadow-lg"
                            @click="openStatus = !openStatus">
                            <Button label="تسک در حال انجام" icon="pi pi-times-circle" :loading="taskLoading"
                                class="p-button-sm p-button-danger text-md rounded-lg" @click="taskStatus('pending')" />
                        </div>
                        <template v-if="currentTask.status === 'pending'">
                            <div v-if="userPosition === 'manager'"
                                class="cursor-pointer bg-gray-100 absolute top-7 left-44 rounded-full flex items-center justify-center shadow-lg"
                                @click="openStatus = !openStatus">
                                <SelectButton dir="ltr" v-model="value" :options="options" optionLabel="name"
                                    aria-labelledby="basic" class="rounded-xl" />
                            </div>
                            <div v-if="userPosition !== 'manager' && currentTask.responsible.username === userName"
                                class="cursor-pointer bg-gray-100 absolute top-7 left-44 rounded-full flex items-center justify-center shadow-lg"
                                @click="openStatus = !openStatus">
                                <Button label="تسک در انتضار تایید" icon="pi pi-clock" :loading="taskLoading"
                                    class="p-button-sm p-button-warning text-md rounded-lg" disabled />
                            </div>
                        </template>
                        <div v-if="currentTask.status === 'done'"
                            class="cursor-pointer bg-gray-100 absolute top-7 left-44 rounded-full flex items-center justify-center shadow-lg"
                            @click="openStatus = !openStatus">
                            <Button v-if="currentTask.status === 'done'" label="تسک تایید شد" icon="pi pi-check"
                                :loading="taskLoading" class="p-button-sm p-button-success text-md rounded-lg" />
                        </div>
                    </template>
                    <div class="ribbon">
                        <span class="font-iransans shadow-md bg-light-blue">{{ currentTask.point }}</span>
                    </div>
                </template>
                <template #title>
                    <p class="mt-10 mr-12 text-3xl">
                        {{ currentTask.title }}
                    </p>
                </template>
                <template #content>
                    <div class="px-10">
                        <p class="text-lg mb-3">
                            <span class="ml-2 font-bold">پروژه:</span>
                            <span>{{ currentProject.title }}</span>
                        </p>
                        <p class="text-lg mb-3">
                            <span class="ml-2 font-bold">میزکار:</span>
                            <span>{{ currentDesk.title }}</span>
                        </p>
                        <p v-if="currentTask.dependentTaskId && currentTask.dependentTaskId.length > 0"
                            class="text-lg mb-3">
                            <span class="ml-2 font-bold">تسک مربوط:</span>
                            <span>{{ taskFound(currentTask.dependentTaskId) }}</span>
                        </p>
                        <div class="text-lg mb-5">
                            <p class="ml-2 font-bold">توضیحات:</p>
                            <p v-if="currentTask.description.length > 0" dir="ltr" v-html="currentTask.description"
                                class="w-full" />
                            <p v-else>----</p>
                        </div>
                        <div v-if="!taskLoading && isSlider" class="splide splide_project mx-auto px-4" role="group"
                            style="width: 99%;">
                            <div class="splide__track">
                                <ul class="splide__list">
                                    <template v-if="currentTask.type === 'task'">
                                        <li v-if="userPosition === 'manager'" class="splide__slide">
                                            <label
                                                class="h-full w-100 flex flex-col justify-center items-center px-4 py-8 bg-gray-100 rounded-xl tracking-wide border cursor-pointer hover:text-light-blue">
                                                <i class="pi pi-image text-xl"></i>
                                                <span class="mt-2 text-lg leading-normal">انتخاب عکس</span>
                                                <input type='file' class="hidden" @change="taskFile" />
                                            </label>
                                        </li>
                                    </template>
                                    <template v-if="currentTask.type === 'suggestion'">
                                        <li v-if="userPosition === 'employer'" class="splide__slide">
                                            <label
                                                class="h-full w-100 flex flex-col justify-center items-center px-4 py-8 bg-gray-100 rounded-xl tracking-wide border cursor-pointer hover:text-light-blue">
                                                <i class="pi pi-image text-xl"></i>
                                                <span class="mt-2 text-lg leading-normal">انتخاب عکس</span>
                                                <input type='file' class="hidden" @change="taskFile" />
                                            </label>
                                        </li>
                                    </template>
                                    <template v-if="currentTask.attached">
                                        <li class="splide__slide cursor-pointer relative rounded-xl overflow-hidden border border-gray-200"
                                            v-for="image in currentTask.attached" :key="image" @click="modalImage = image"
                                            @mouseenter="shadowBack = image" @mouseleave="shadowBack = -1">
                                            <div class="h-full w-full flex items-center justify-center">
                                                <img :src="image" class="w-full h-36" />
                                                <div v-if="shadowBack === image"
                                                    class="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                                    <i class="pi pi-eye text-white cursor-pointer"
                                                        style="font-size: 1.8rem;"></i>
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                        <template v-if="currentTask.type === 'task'">
                            <div class="w-full flex flex-col justify-center items-center gap-3 mt-5">
                                <Dropdown v-model="selectedDropComment" :options="commentSubjectDrop" optionLabel="name"
                                    placeholder="موضوع کامنت"
                                    class="drop-down w-full sm:w-9/12 md:w-1/2 border rounded-lg" />
                                <div class="w-full sm:w-9/12 md:w-1/2 flex items-center justify-center">
                                    <Textarea v-model="comment" :autoResize="true" rows="5" cols="500" class="rounded-lg"
                                        placeholder="متن کامنت" />
                                </div>
                                <Button label="ثبت" class="p-button-sm p-button-success w-24 sm:w-1/6 text-xl rounded-lg"
                                    :disabled="comment.length === 0 || !selectedDropComment" @click="addTaskComment" />
                            </div>

                            <div v-if="currentTask.comments.length > 0">
                                <Card v-for="comment in currentTask.comments" :key="comment._id" class="mt-5">
                                    <template #header>
                                        <div class="pr-5 text-white font-semibold text-lg"
                                            :class="{ 'bg-yellow-500': comment.title === 'warning', 'bg-red-500': comment.title === 'error', 'bg-green-500': comment.title === 'successful', 'bg-blue-500': comment.title === 'guide' }">
                                            <p v-if="comment.title === 'warning'">اخطار</p>
                                            <p v-else-if="comment.title === 'error'">ارور</p>
                                            <p v-else-if="comment.title === 'successful'">موفق</p>
                                            <p v-else-if="comment.title === 'guide'">راهنما</p>
                                        </div>
                                    </template>
                                    <template #content>
                                        <p>
                                            {{ comment.description }}
                                        </p>
                                    </template>
                                    <template #footer>
                                        <Chip icon="pi pi-user" :label="comment.user.username"
                                            class="h-fit rounded-lg overflow-hidden py-1 px-2" />
                                    </template>
                                </Card>
                            </div>
                        </template>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <transition name="modal">
        <div v-if="modalImage" class="fixed inset-0 flex items-center justify-center z-50 lg:z-40">
            <div class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70" @click="modalImage = null" />
            <div class="w-10/12 bg-gray-300 rounded-md shadow-2xl relative animate-open p-2 h-auto lg:w-6/12">
                <img :src="modalImage" class="w-100 h-auto" />
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProfileStore } from '@/store/profileStore';
import { useDeskStore } from '@/store/deskStore';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { useSuggestionStore } from '@/store/suggestionStore';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Knob from 'primevue/knob';
import Chip from 'primevue/chip';
import errorMassege from '@/components/errorMassege.vue';
import SelectButton from 'primevue/selectbutton';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default {
    name: 'UserPanel',

    components: {
        errorMassege,
        Chip,
        Knob,
        Dropdown,
        Avatar,
        Card,
        Textarea,
        Button,
        SelectButton
    },

    props: ["id"],

    beforeRouteEnter(to: any, from: any, next: any) {
        const taskStore = useTaskStore()
        const deskStore = useDeskStore()
        if (Object.values(deskStore.allDesk).length === 0) {
            next({ path: '/panel' })
        } else {
            taskStore.changeLoading(true)
            taskStore.setCurrentTask(to.params.id).then(() => {
                taskStore.changeLoading(false)
                next()
            })
        }
    },

    setup(props: any) {
        onMounted(() => {
            if (isSlider.value) {
                createSlider()
            }

            const collection = document.getElementsByClassName("ql-direction-rtl");
            if (Object.values(collection).length > 0) {
                Object.values(collection).forEach((elmnt: any) => {
                    elmnt.dir = "rtl"
                })
            }
        })

        const router = useRouter()
        const profileStore = useProfileStore()
        const deskStore = useDeskStore()
        const projectStore = useProjectStore()
        const taskStore = useTaskStore()
        const suggestionStore = useSuggestionStore()

        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const comment = ref('')
        const logOutPopup = ref(false)
        const modalImage = ref<any>(null)
        const errorHandling = ref(false)
        const shadowBack = ref(-1)
        const selectedDropComment = ref<any>(null)
        const openStatus = ref<boolean>(false)
        const value = ref<any>(null);
        const options = ref([
            { name: 'تایید تسک', value: 'done' },
            { name: 'رد تسک', value: 'undone' },
        ]);
        const commentSubjectDrop = ref([
            { name: 'اخطار', code: 'warning' },
            { name: 'ارور', code: 'error' },
            { name: 'موفق', code: 'successful' },
            { name: 'راهنما', code: 'guide' }
        ])

        const currentDesk: any = computed(() => deskStore.currentDesk)
        const currentProject: any = computed(() => projectStore.currentProject)
        const currentTask: any = computed(() => taskStore.currentTask)
        const strdeadline = computed(() => `${currentTask.value.deadline.n}/{value}`)
        const userPosition = computed(() => profileStore.userProfile.position)
        const userName = computed(() => profileStore.userProfile.username)
        const taskLoading = computed(() => taskStore.taskLoading)
        const deadlineTask = computed(() => {
            const timeNow = new Date().getTime();
            const mines = timeNow - new Date(currentDesk.value.createdAt).getTime();
            let deadline = 0;
            if (currentTask.value.deadline.unit === 'day') {
                deadline = currentTask.value.deadline.n * 24 * 60 * 60 * 1000
            } else if (currentTask.value.deadline.unit === 'month') {
                deadline = currentTask.value.deadline.n * 30 * 24 * 60 * 60 * 1000
            } else if (currentTask.value.deadline.unit === 'hour') {
                deadline = currentTask.value.deadline.n * 60 * 60 * 1000
            }
            return Math.floor((mines * 100) / deadline)
        })
        const isSlider = computed(() => {
            if (currentTask.value.type === 'task') {
                if (userPosition.value === 'manager') {
                    return true
                } else {
                    return currentTask.value.attached.length > 0 ? true : false
                }
            } else {
                if (userPosition.value === 'employer') {
                    return true
                } else {
                    return currentTask.value.attached.length > 0 ? true : false
                }
            }
        })

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function taskStatus(status: any) {
            taskStore.changeLoading(true)
            errorHandling.value = false
            taskStore.changeStatus(props.id, status).then(() => {
                taskStore.setCurrentTask(props.id).then(() => {
                    taskStore.changeLoading(false)
                })
            }).catch(() => {
                taskStore.changeLoading(false)
                errorHandling.value = true
            })
        }

        function addTaskComment() {
            taskStore.changeLoading(true)
            errorHandling.value = false
            taskStore.addComment(props.id, selectedDropComment.value.code, comment.value).then(() => {
                taskStore.setCurrentTask(props.id).then(() => {
                    taskStore.changeLoading(false)
                })
            }).catch(() => {
                taskStore.changeLoading(false)
                errorHandling.value = true
            })
        }

        function taskFile(e: any) {
            const file = e.target.files[0];

            const reader: any = new FileReader();
            reader.onloadend = () => {
                taskStore.changeLoading(true)
                errorHandling.value = false
                if (currentTask.value.type === 'task') {
                    taskStore.attachFile(props.id, reader.result).then(() => {
                        taskStore.setCurrentTask(props.id).then(() => {
                            taskStore.changeLoading(false)
                            setTimeout(createSlider, 1000)
                        }).catch(() => {
                            taskStore.changeLoading(false)
                            errorHandling.value = true
                            setTimeout(createSlider, 1000)
                        })
                    }).catch(() => {
                        taskStore.changeLoading(false)
                        errorHandling.value = true
                        setTimeout(createSlider, 1000)
                    })
                } else {
                    suggestionStore.attachFile(props.id, reader.result).then(() => {
                        taskStore.setCurrentTask(props.id).then(() => {
                            taskStore.changeLoading(false)
                            setTimeout(createSlider, 1000)
                        }).catch(() => {
                            taskStore.changeLoading(false)
                            errorHandling.value = true
                            setTimeout(createSlider, 1000)
                        })
                    }).catch(() => {
                        taskStore.changeLoading(false)
                        errorHandling.value = true
                        setTimeout(createSlider, 1000)
                    })
                }
            };
            reader.readAsDataURL(file);
        }

        watch(value, (newValue) => {
            taskStatus(newValue.value)
        })

        function setSuggestionToTask() {
            taskStore.changeLoading(true)
            errorHandling.value = false
            suggestionStore.setSuggestionToTask(props.id).then(() => {
                taskStore.setCurrentTask(props.id).then(() => {
                    taskStore.changeLoading(false)
                })
            }).catch(() => {
                taskStore.changeLoading(false)
                errorHandling.value = true
            })
        }

        // let timer = ref<any>(0)

        // const currentTaskDeadline = computed(() => {
        //     if (currentTask.value.deadline.period === 'ساعت') {
        //         return currentTask.value.deadline.unit * 60
        //     } else if (currentTask.value.deadline.period === 'روز') {
        //         return currentTask.value.deadline.unit * 60 * 24
        //     } else if (currentTask.value.deadline.period === 'هفته') {
        //         return currentTask.value.deadline.unit * 60 * 24 * 7
        //     } else {
        //         return 0
        //     }
        // })

        function taskFound(taskId: string) {
            let found: any = null
            currentProject.value.tasks.forEach((task: any) => {
                if (task._id === taskId) {
                    found = task.title
                }
            })
            return found
        }

        function createSlider() {
            const splide = new Splide('.splide', {
                perPage: 3,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                gap: '1rem',
                autoplay: false,
                wheel: true,
                breakpoints: {
                    1024: {
                        perPage: 2
                    },
                    660: {
                        perPage: 1
                    }
                }
            });
            splide.mount();
        }

        return {
            taskStatus,
            addTaskComment,
            logOut,
            setSuggestionToTask,
            taskFound,
            taskFile,
            currentProject,
            sideBar,
            currentDesk,
            currentTask,
            selectedDropComment,
            isSlider,
            commentSubjectDrop,
            comment,
            openStatus,
            modalImage,
            logOutPopup,
            shadowBack,
            deadlineTask,
            strdeadline,
            userPosition,
            errorHandling,
            taskLoading,
            userName,
            value,
            options,
            router
            // currentTaskDeadline
        }
    },
}
</script>

<style lang="scss">
.status1-enter-active {
    transition: all 0.4s ease;
}

.status1-leave-active {
    transition: all 0.8s ease;
}

.status1-enter-from,
.status1-leave-to {
    opacity: 0;
    top: 0;
}

.status2-enter-active,
.status2-leave-active {
    transition: all 0.6s ease;
}

.status2-enter-from,
.status2-leave-to {
    opacity: 0;
    top: 0;
}

.status3-enter-active {
    transition: all 0.8s ease;
}

.status3-leave-active {
    transition: all 0.4s ease;
}

.status3-enter-from,
.status3-leave-to {
    opacity: 0;
    top: 0;
}

.ribbon {
    width: 110px;
    height: 110px;
    display: block;
    position: absolute;
    overflow: hidden;
}

.ribbon span {
    width: 150px;
    height: 34px;
    top: 20px;
    right: -40px;
    position: absolute;
    display: block;
    color: #333;
    font-family: arial;
    font-size: 18px;
    color: white;
    text-align: center;
    line-height: 34px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
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

