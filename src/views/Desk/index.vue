<template>
    <nav class="bg-blue-500 flex justify-between py-1 absolute top-0 left-0 z-20 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white cursor-default">{{ currentDesk }}</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <RouterLink :to="{ name: 'UserProfile' }">
                <Avatar icon="pi pi-user" class="" shape="circle" />
            </RouterLink>
        </div>
    </nav>

    <div class="flex relative gap-1">
        <div :class="{ 'block absolute top-0 right-0 lg:static p-2.5 translate-x-0': sideBar, 'hidden p-0 translate-x-full': !sideBar }"
            class="sidebar w-56 lg:w-1/5 bg-white transition-all z-10 h-screen pt-16"
            style="box-shadow: .3em 0 .3em .4em #ccc">
            <div>
                <RouterLink :to="{ name: 'UserPanel' }">
                    <p
                        class="selected-sidebar flex items-center font-bold py-1.5 px-5 gap-3.5 rounded-sm shadow-sm mt-1 cursor-pointer">
                        <i class="home-icon pi pi-home text-lg"></i>
                        <span>داشبورد</span>
                    </p>
                </RouterLink>
                <div class="divider-line mt-2.5"></div>
                <div class="h-96 flex flex-col justify-start items-end overflow-y-scroll custom">
                    <p class="w-full flex items-center py-1.5 px-5 gap-3.5 rounded-sm cursor-default"
                        :class="{ 'cursor-not-allowed text-gray-500': Object.values(selectedDesk.projects).length === 0 }">
                        <i v-if="Object.values(selectedDesk.projects).length > 0" class="pi pi-angle-down text-green-600"
                            style="font-size: 1rem;"></i>
                        <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                        <span>پروژه ها</span>
                    </p>
                    <template v-if="Object.values(selectedDesk.projects).length > 0">
                        <p v-for="project in selectedDesk.projects" :key="project.name"
                            @click="project.active ? projectRoutePush(project) : null"
                            class="flex items-center py-1.5 px-4 gap-3 rounded-sm w-11/12"
                            :class="{ 'dashboard-item-hover cursor-pointer': project.active, 'cursor-not-allowed': !project.active }">
                            <i class="pi pi-folder" style="font-size: 1rem;"
                                :class="{ 'text-gray-500': !project.active, 'text-green-600': project.active }"></i>
                            <span :class="{ 'text-gray-500': !project.active }">{{ project.name }}</span>
                        </p>
                    </template>
                </div>
            </div>
            <div v-if="Object.values(selectedDesk.teammates).length > 0">
                <Card class="w-full shadow-md">
                    <template #header>
                        <div class="bg-blue-500 rounded-t-sm p-2 text-white">
                            همکاران من
                        </div>
                    </template>
                    <template #content>
                        <div class="h-32 overflow-y-scroll custom">
                            <div class="flex items-center gap-2 my-1">
                                <Avatar label="خ" shape="circle" />
                                <p>خودم</p>
                            </div>
                            <div v-for="teammate in selectedDesk.teammates" :key="teammate.fullName"
                                class="flex items-center gap-2 my-1">
                                <Avatar :label="teammate.fullName[0]" shape="circle" />
                                <p>{{ teammate.fullName }}</p>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white h-screen pt-14 overflow-y-scroll custom">
            <userDashboard @callPopupProject="createNewProject = true" />
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewProject" @close="createNewProject = false">
            <p class="font-bold my-3">پروژه جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="projectName" type="text" placeholder="نام پروژه..." class="w-full sm:w-3/5 h-10 rounded-lg" />
            </div>
            <div class="mb-3">
                <template v-if="Object.values(currentTeammate).length > 0">
                    <p class="mb-2">همکاران خود را به پروژه خود دعوت نمایید:</p>
                    <MultiSelect v-model="selectedTeammates" :options="currentTeammate" optionLabel="fullName"
                        placeholder="همکاران" class="w-full sm:w-2/5 rounded-lg" />
                </template>
                <p v-else>همکاری برای این میزکار ثبت نشده است</p>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="ایجاد" class="p-button-sm p-button-success w-20 h-10 rounded-lg" :disabled="!(projectName.length > 0)"
                    @click="addProject" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg" @click="createNewProject = false" />
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
import Card from 'primevue/card';
import MultiSelect from 'primevue/multiselect';

// detect if width of body smaller that 1024px then close the sidebar
let sidebarDisplay = true;
window.addEventListener("load", () => {
    const body = document.querySelector("body") as HTMLBodyElement;
    const bodyRect = body.getBoundingClientRect();
    if (bodyRect.width <= 1024) {
        sidebarDisplay = false;
    }
})

export default {
    name: 'UserPanel',

    components: {
        Card,
        MultiSelect,
        Button,
        Avatar,
        userDashboard,
        popUp,
        InputText,
    },

    props: ["id"],

    setup() {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const sideBar = ref(sidebarDisplay)
        const selectedTeammates = ref<any>([])
        const createNewProject = ref(false)
        const projectName = ref('')
        const router = useRouter()


        const currentDesk: any = computed(() => deskStore.currentDesk)

        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))

        const currentTeammate = computed(() => {
            let teamArray: any = []
            if (selectedDesk.value && Object.values(selectedDesk.value.teammates).length > 0) {
                Object.values(selectedDesk.value.teammates).forEach((teammate: any) => {
                    teamArray.push({ fullName: teammate.fullName, phoneNumber: teammate.phoneNumber })
                })
                return teamArray
            } else {
                return teamArray
            }
        })

        watch(createNewProject, () => {
            selectedTeammates.value = []
            projectName.value = ''
        })


        function addProject() {
            projectStore.changeLoading(true)

            let teammatesObj: any = {}
            if (selectedTeammates.value.length > 0) {
                selectedTeammates.value.forEach((item: any) => {
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
            currentTeammate,
            currentDesk,
            projectName,
            selectedTeammates
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

