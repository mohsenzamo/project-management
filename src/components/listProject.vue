<template>
    <div class="splide splide_project mx-auto px-4" role="group" style="width: 99%;">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentProjects && Object.values(currentProjects).length > 0">
                    <li v-for="project in currentProjects" :key="project.name"
                        class="splide__slide items-center flex justify-center py-4">
                        <Card class="w-60 h-72 shadow-md hover:-translate-y-2 transition-all">
                            <template #header>
                                <div class="flex mb-1 gap-2 justify-between p-3">
                                    <InputSwitch v-model="project.active" />
                                    <i class="pi pi-pencil cursor-pointer hover:text-yellow-400" style="font-size: 1.5rem"
                                        @click="currentEditProject(project)"></i>
                                </div>
                            </template>
                            <template #title>
                                <p @click="project.active ? projectRoutePush(project) : null" class="mb-2 text-center"
                                    :class="{ 'cursor-pointer': project.active, 'cursor-not-allowed': !project.active }">{{
                                        project.name }}</p>
                            </template>
                            <template #content>
                                <div class="mb-4">
                                    <p class="mb-1 text-lg">وضعیت پروژه:</p>
                                    <ProgressBar
                                        :value="Math.floor((project.isDoneTask * 100) / (project.isDoneTask + project.isNotDoneTask))" />
                                </div>
                                <div>
                                    <p class="mb-1 text-lg">افراد ثبت شده:</p>
                                    <div class="flex flex-wrap gap-1 mt-2">
                                        <p v-if="Object.values(project.teammates).length === 0">-----</p>
                                        <template v-else>
                                            <Avatar v-for="teammate in project.teammates" :key="teammate.name"
                                                :label="teammate.fullName[0]" shape="circle" />
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </li>
                    <li class="splide__slide items-center flex justify-center py-4">
                        <Card class="w-60 h-72 shadow-md hover:-translate-y-2 transition-all">
                            <template #content>
                                <div class="h-full w-full text-center mt-16">
                                    <p class="mb-4 text-xl">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')" class="h-10" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide items-center flex justify-center py-4">
                        <Card class="w-60 h-72 hover:-translate-y-2 transition-all shadow-md">
                            <template #content>
                                <div class="h-full w-full text-center mt-16">
                                    <p class="mb-4">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')" class="h-10" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
            </ul>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="modalEditProject" @close="modalEditProject = false">
            <p class="font-bold my-3">پروژه خود را ویرایش کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="editProjectValue.name" type="text" placeholder="نام پروژه..." class="w-3/5 h-10" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <template v-if="Object.values(currentTeammate).length > 0">
                    <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                    <div v-for="teammate in currentTeammate" :key="teammate.fullName" class="flex items-center gap-2">
                        <Checkbox name="teammate" :value="teammate" v-model="editTeammates" />
                        <p>{{ teammate.fullName }}</p>
                    </div>
                </template>
                <p v-else>همکاری برای این میزکار ثبت نشده است</p>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="modalEditProject = false" />
                <Button label="ثبت" class="p-button-sm p-button-info w-16 h-10"
                    :disabled="!(editProjectValue.name.length > 0)" @click="editProject" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { ref, computed, watch, onMounted } from 'vue'
import { useProjectStore } from '@/store/projectStore';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import InputSwitch from 'primevue/inputswitch';
import { useDeskStore } from '@/store/deskStore';
import Avatar from 'primevue/avatar';
import popUp from '@/components/popUp.vue';
import Checkbox from 'primevue/checkbox';
import { useRouter } from 'vue-router';

export default {
    name: "ListProject",

    components: {
        Checkbox,
        Avatar,
        Card,
        Button,
        ProgressBar,
        InputSwitch,
        popUp,
        InputText
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide', {
                perPage: 3,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
            });

            splide.mount();
        })
        const modalEditProject = ref(false)
        const deskStore = useDeskStore();
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const editProjectValue = ref<any>(null)
        const projectBeforeChange = ref('')
        const projectStore = useProjectStore();
        const editTeammates = ref<any>([])
        const router = useRouter()

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        const currentProjects: any = computed(() => {
            if (Object.values(selectedDesk.value.projects).length > 0) {
                let projectObj: any = {}
                Object.values(selectedDesk.value.projects).forEach((project: any) => {
                    let isDoneTask = 0
                    let isNotDoneTask = 0
                    if (Object.values(project.tasks).length > 0) {
                        Object.values(project.tasks).forEach((task: any) => {
                            task.isDone ? isDoneTask++ : isNotDoneTask++
                        })
                    }
                    const projectNameValue = project.name
                    projectObj[projectNameValue] = Object.assign(project, { isDoneTask: isDoneTask, isNotDoneTask: isNotDoneTask })
                })
                return projectObj
            } else {
                return {}
            }
        })

        const currentTeammate = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.teammates).length > 0) {
                return selectedDesk.value.teammates
            } else {
                return []
            }
        })

        function currentEditProject(project: any) {
            modalEditProject.value = true
            editProjectValue.value = Object.assign({}, project)
            editTeammates.value = []
            Object.values(project.teammates).forEach((teammate: any) => {
                editTeammates.value.push({ fullName: teammate.fullName, phoneNumber: teammate.phoneNumber })
            })
            projectBeforeChange.value = project.name
        }

        function editProject() {
            projectStore.changeLoading(true)
            let objProject: any = {}
            let teammatesObj: any = {}
            if (editTeammates.value.length > 0) {
                editTeammates.value.forEach((item: any) => {
                    teammatesObj[item.fullName] = item
                })
            }

            objProject = {
                name: editProjectValue.value.name,
                tasks: editProjectValue.value.tasks,
                teammates: teammatesObj,
                deskId: editProjectValue.value.deskId,
                active: true,
                isDoneTask: editProjectValue.value.isDoneTask,
                isNotDoneTask: editProjectValue.value.isNotDoneTask
            };
            deskStore.editProject(objProject, projectBeforeChange.value)
            modalEditProject.value = false
            setInterval(() => {
                projectStore.changeLoading(false)
            }, 1000);
        }

        function projectRoutePush(project: any) {
            deskStore.setCurrentProject(project)
            router.push({
                name: "UserProject",
                params: { id: project.name },
            });
        }

        return {
            projectRoutePush,
            editProject,
            currentEditProject,
            modalEditProject,
            currentProjects,
            editProjectValue,
            currentTeammate,
            editTeammates
        }
    },
}
</script>

<style lang="scss">
.p-progressbar {
    @apply font-iransans;
}

.splide__arrow {
    background-color: #ccc;
    border-radius: .2rem;
    height: 3.5em;
    width: .7em;
}

.splide__arrows--rtl .splide__arrow--prev {
    right: -.5em;
}

.splide__arrows--rtl .splide__arrow--next {
    left: -.5em;
}
</style>