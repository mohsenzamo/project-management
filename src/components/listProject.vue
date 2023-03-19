<template>
    <div id="splide1" class="splide splide_project mx-auto px-4" role="group" style="width: 99%;">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentProjects && currentProjects.length > 0">
                    <li v-for="project in currentProjects" :key="project._id"
                        class="splide__slide items-center flex justify-center py-4">
                        <Card
                            class="w-full h-72 shadow-md border-t-2 border-blue-400 rounded-xl hover:-translate-y-2 transition-all relative">
                            <template #header>
                                <div class="flex mb-1 gap-2 justify-between p-3">
                                    <InputSwitch v-model="project.isActive" @input="projectStatus(project)"
                                        :disabled="userPosition !== 'manager'" />
                                    <i v-if="userPosition === 'manager'" class="pi pi-pencil cursor-pointer"
                                        style="font-size: 1rem"
                                        :class="{ 'hover:text-blue-400 cursor-pointer': project.isActive, 'cursor-not-allowed': !project.isActive }"
                                        @click="project.isActive ? currentEditProject(project) : null"></i>
                                </div>
                            </template>
                            <template #title>
                                <p @click="project.isActive ? projectRoutePush(project._id) : null" class="mb-2 text-center"
                                    :class="{ 'cursor-pointer': project.isActive, 'cursor-not-allowed': !project.isActive }">
                                    {{
                                        project.title }}</p>
                            </template>
                            <template #content>
                                <div v-if="projectStatusLoading === project._id"
                                    class="w-full h-full absolute bg-gray-900 bg-opacity-70 top-0 left-0 rounded-xl flex items-center justify-center z-20">
                                    <ProgressSpinner />
                                </div>
                                <div class="mb-4 z-10">
                                    <p class="mb-1 text-lg">وضعیت پروژه:</p>
                                    <ProgressBar
                                        :value="Math.floor((project.number_of_tasks.done_tasks * 100) / (project.number_of_tasks.done_tasks + project.number_of_tasks.undone_tasks))" />
                                </div>
                                <div>
                                    <p class="mb-1 text-lg">افراد ثبت شده:</p>
                                    <div class="mt-2 w-full">
                                        <p v-if="project.teammates.length === 0">-----</p>
                                        <template v-else>
                                            <div id="splide2" class="splide splide_project w-full" role="group">
                                                <div class="splide__track">
                                                    <ul class="splide__list">
                                                        <li v-for="teammate in project.teammates" :key="teammate.username"
                                                            class="splide__slide items-center flex justify-center py-4">
                                                            <Chip icon="pi pi-user" :label="teammate.username"
                                                                class="h-fit rounded-lg overflow-hidden py-1 px-2" />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </li>
                    <li v-if="userPosition === 'manager'" class="splide__slide items-center flex justify-center py-4">
                        <Card
                            class="w-60 h-72 flex justify-center items-center border-t-2 border-blue-400 rounded-xl shadow-md hover:-translate-y-2 transition-all">
                            <template #content>
                                <div class="h-full w-full text-center">
                                    <p class="mb-4 text-xl">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')"
                                        class="w-10 h-10 rounded-full" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else-if="userPosition === 'manager'">
                    <li class="splide__slide items-center flex justify-center py-4">
                        <Card
                            class="w-60 h-72 flex justify-center items-center border-t-2 border-blue-400 rounded-xl hover:-translate-y-2 transition-all shadow-md">
                            <template #content>
                                <div class="h-full w-full text-center">
                                    <p class="mb-4">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')"
                                        class="w-10 h-10 rounded-full" />
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
                <InputText v-model="editProjectValue.title" type="text" placeholder="نام پروژه..." class="w-3/5 h-10" />
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="modalEditProject = false" />
                <Button label="ثبت" class="p-button-sm p-button-info w-16 h-10"
                    :disabled="!(editProjectValue.title.length > 0)" @click="editProject" />
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
// import Avatar from 'primevue/avatar';
import popUp from '@/components/popUp.vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/store/profileStore';
import MultiSelect from 'primevue/multiselect';
import axios from 'axios';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: "ListProject",

    components: {
        Chip,
        Card,
        Button,
        ProgressBar,
        InputSwitch,
        ProgressSpinner,
        popUp,
        InputText,
        // MultiSelect
    },

    setup() {
        onMounted(() => {
            const splide1 = new Splide('#splide1', {
                perPage: 4,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                gap: "1rem",
                padding: "0 20px",
                breakpoints: {
                    1024: {
                        perPage: 3,
                    },
                    730: {
                        perPage: 2
                    },
                    500: {
                        perPage: 1
                    }
                }
            });

            const splide2 = new Splide('#splide2', {
                autoWidth: true,
                gap: '.2rem',
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                arrows: false,
                wheel: true
            });

            splide1.mount();
            splide2.mount();
        })

        const profileStore = useProfileStore()
        const modalEditProject = ref(false)
        const deskStore = useDeskStore();
        const currentProjects: any = computed(() => deskStore.currentDesk.projects)
        const editProjectValue = ref<any>(null)
        const projectStatusLoading = ref('')
        const projectStore = useProjectStore();
        const router = useRouter()
        const selectedTeammates = ref<any>([])
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const userPosition = computed(() => profileStore.userProfile.position)

        function projectStatus(project: any) {
            projectStatusLoading.value = project._id
            const config = {
                method: 'patch',
                url: process.env.VUE_APP_BASE_API_URL + '/projects/status/' + project._id,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    isActive: project.isActive,
                    permision: !project.isActive
                }
            };
            axios(config)
                .then((res) => {
                    console.log(res)
                    projectStatusLoading.value = ''
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }

        function currentEditProject(project: any) {
            modalEditProject.value = true
            editProjectValue.value = Object.assign({}, project)
        }

        function editProject() {
            projectStore.changeLoading(true)
            const config = {
                method: 'patch',
                url: process.env.VUE_APP_BASE_API_URL + '/projects/one/' + editProjectValue.value._id,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    title: editProjectValue.value.title
                }
            };
            axios(config)
                .then(async () => {
                    await axios.get(process.env.VUE_APP_BASE_API_URL + '/workdesks/one/' + currentDesk.value._id, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`
                        }
                    })
                        .then(async (resdesk) => {
                            deskStore.setCurrentDesk(resdesk.data[0])
                            projectStore.changeLoading(false)
                            modalEditProject.value = false
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                });
            // let objProject: any = {}
            // let teammatesObj: any = {}
            // if (selectedTeammates.value.length > 0) {
            //     selectedTeammates.value.forEach((item: any) => {
            //         teammatesObj[item.fullName] = item
            //     })
            // }

            // objProject = {
            //     name: editProjectValue.value.name,
            //     tasks: editProjectValue.value.tasks,
            //     teammates: teammatesObj,
            //     deskId: editProjectValue.value.deskId,
            //     active: true,
            //     isDoneTask: editProjectValue.value.isDoneTask,
            //     isNotDoneTask: editProjectValue.value.isNotDoneTask
            // };
            // deskStore.editProject(objProject, projectBeforeChange.value)
        }

        function projectRoutePush(id: any) {
            router.push({
                name: "UserProject",
                params: { id: id },
            });
        }

        return {
            projectRoutePush,
            editProject,
            currentEditProject,
            projectStatus,
            modalEditProject,
            currentProjects,
            editProjectValue,
            // currentTeammate,
            projectStatusLoading,
            selectedTeammates,
            userPosition
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