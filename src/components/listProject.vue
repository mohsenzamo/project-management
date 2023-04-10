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
                                        <div class="whitespace-nowrap overflow-x-scroll custom py-1">
                                            <Chip icon="pi pi-user" :label="project.teammates[0].username"
                                                class="h-fit rounded-lg overflow-hidden py-1 px-2" />
                                            <Chip v-if="project.teammates.length > 1" icon="pi pi-arrow-left"
                                                class="h-fit rounded-lg overflow-hidden py-1 px-2 mr-2"
                                                @click="teammateProjectModal = project" />
                                        </div>
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
                <template v-else-if="userPosition !== 'manager'">
                    <li class="splide__slide items-center flex justify-center py-4">
                        <div class="h-full w-full text-center">
                            <p>پروژه ثبت نشده است</p>
                        </div>
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

    <transition name="modal">
        <popUp v-if="teammateProjectModal" @close="teammateProjectModal = null">
            <p class="font-bold my-3">همکاران پروژه {{ teammateProjectModal.title }}:</p>
            <div class="flex gap-2">
                <Chip v-for="teammate in teammateProjectModal.teammates" :key="teammate.username" icon="pi pi-user"
                    :label="teammate.username" class="h-fit rounded-lg overflow-hidden py-1 px-2" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/store/profileStore';
import { useProjectStore } from '@/store/projectStore';
import { useDeskStore } from '@/store/deskStore';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import InputSwitch from 'primevue/inputswitch';
import popUp from '@/components/popUp.vue';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

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
    },

    setup() {
        onMounted(() => {
            if (currentProjects.value.length > 0) {
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
                splide1.mount();
            } else {
                const splide1 = new Splide('#splide1', {
                    perPage: 4,
                    perMove: 1,
                    direction: 'rtl',
                    pagination: false,
                    arrows: false,
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
                splide1.mount();
            }

        })

        const profileStore = useProfileStore()
        const projectStore = useProjectStore();
        const deskStore = useDeskStore();
        const router = useRouter()

        const modalEditProject = ref(false)
        const editProjectValue = ref<any>(null)
        const teammateProjectModal = ref<any>(null)
        const projectStatusLoading = ref('')

        const currentDesk: any = computed(() => deskStore.currentDesk)
        const currentProjects: any = computed(() => deskStore.currentDesk.projects)
        const userPosition = computed(() => profileStore.userProfile.position)

        function projectStatus(project: any) {
            projectStatusLoading.value = project._id
            projectStore.changeProjectStatus(project._id, project.isActive).then(() => {
                projectStatusLoading.value = ''
            })
        }
        function currentEditProject(project: any) {
            modalEditProject.value = true
            editProjectValue.value = Object.assign({}, project)
        }
        function editProject() {
            projectStore.changeLoading(true)
            projectStore.editProject(editProjectValue.value).then(() => {
                deskStore.setCurrentDesk(currentDesk.value._id).then(() => {
                    projectStore.changeLoading(false)
                    modalEditProject.value = false
                })
            })
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
            teammateProjectModal,
            modalEditProject,
            currentProjects,
            editProjectValue,
            projectStatusLoading,
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