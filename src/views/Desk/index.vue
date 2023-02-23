<template>
    <nav class="bg-blue-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.5rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white cursor-default">{{ currentDesk }}</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <Avatar icon="pi pi-user" class="" shape="circle" />
        </div>
    </nav>

    <div class="flex gap-1">
        <div :class="{ 'w-1/5 p-4 translate-x-0': sideBar, 'w-0 p-0 translate-x-full': !sideBar }"
            class="w-1/5 bg-white transition-all z-20 h-screen pt-20 flex flex-col justify-between"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <div>
                <RouterLink :to="{ name: 'UserPanel' }">
                    <p
                        class="flex items-center hover:bg-gray-400 hover:text-white hover:font-bold p-2 gap-3 rounded-sm cursor-pointer hover:shadow-sm">
                        <i class="pi pi-home text-red-600" style="font-size: 1rem;"></i>
                        <span>داشبورد</span>
                    </p>
                </RouterLink>
                <hr class="bg-light-blue border-none mt-4" style="height: .1rem;" />
                <p class="flex items-center p-2 gap-3 rounded-sm mt-4 cursor-default"
                    :class="{ 'cursor-not-allowed text-gray-500': Object.values(selectedDesk.projects).length === 0 }">
                    <i v-if="Object.values(selectedDesk.projects).length > 0" class="pi pi-angle-down text-green-600"
                        style="font-size: 1rem;"></i>
                    <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                    <span>پروژه ها</span>
                </p>
                <template v-if="Object.values(selectedDesk.projects).length > 0">
                    <p v-for="project in selectedDesk.projects" :key="project.name"
                        @click="project.active ? projectRoutePush(project) : null"
                        class="flex items-center p-2 gap-3 rounded-sm w-10/12 mx-auto"
                        :class="{ 'hover:bg-gray-400 hover:text-white hover:font-bold cursor-pointer': project.active, 'cursor-not-allowed': !project.active }">
                        <i class="pi pi-folder" style="font-size: 1rem;"
                            :class="{ 'text-gray-500': !project.active, 'text-green-600': project.active }"></i>
                        <span :class="{ 'text-gray-500': !project.active }">{{ project.name }}</span>
                    </p>
                </template>
            </div>
            <div v-if="Object.values(selectedDesk.teammates).length > 0">
                <Card class="w-full shadow-md">
                    <template #header>
                        <div class="bg-blue-500 rounded-t-sm p-2 text-white">
                            همکاران من
                        </div>
                    </template>
                    <template #content>
                        <div class="flex items-center gap-2 my-2">
                            <Avatar label="خ" shape="circle" />
                            <p>خودم</p>
                        </div>
                        <div v-for="teammate in selectedDesk.teammates" :key="teammate.fullName"
                            class="flex items-center gap-2 my-2">
                            <Avatar :label="teammate.fullName[0]" shape="circle" />
                            <p>{{ teammate.fullName }}</p>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <userDashboard @callPopupProject="createNewProject = true" />
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewProject" @close="createNewProject = false">
            <p class="font-bold my-3">پروژه جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="projectName" type="text" placeholder="نام پروژه..." class="w-3/5 h-10" />
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <template v-if="Object.values(currentTeammate).length > 0">
                    <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                    <div v-for="teammate in currentTeammate" :key="teammate.fullName" class="flex items-center gap-2">
                        <Checkbox name="teammate" :value="teammate" v-model="teammates" />
                        <p>{{ teammate.fullName }}</p>
                    </div>
                </template>
                <p v-else>همکاری برای این میزکار ثبت نشده است</p>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="createNewProject = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success w-16 h-10" :disabled="!(projectName.length > 0)"
                    @click="addProject" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'vue-router';
import userDashboard from '@/components/userDashboard.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';

export default {
    name: 'UserPanel',

    components: {
        Card,
        Checkbox,
        Button,
        Avatar,
        userDashboard,
        popUp,
        InputText,
    },

    props: ["id"],

    setup() {
        const teammates = ref<any>([])
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const sideBar = ref(true)
        const createNewProject = ref(false)
        const projectName = ref('')
        const router = useRouter()


        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        const currentTeammate = computed(() => {
            if (selectedDesk.value && Object.values(selectedDesk.value.teammates).length > 0) {
                return selectedDesk.value.teammates
            } else {
                return []
            }
        })

        watch(createNewProject, () => {
            teammates.value = []
            projectName.value = ''
        })


        function addProject() {
            projectStore.changeLoading(true)

            let teammatesObj: any = {}
            if (teammates.value.length > 0) {
                teammates.value.forEach((item: any) => {
                    teammatesObj[item.fullName] = item
                })
            }

            deskStore.setProject(deskStore.currentDesk, projectName.value, teammatesObj)

            createNewProject.value = false
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
            addProject,
            projectRoutePush,
            sideBar,
            selectedDesk,
            createNewProject,
            teammates,
            currentTeammate,
            currentDesk,
            projectName
        }
    },
}
</script>

<style lang="scss">
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

