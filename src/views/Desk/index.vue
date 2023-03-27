<template>
    <transition name="error">
        <errorMassege v-if="errorHandling" @close="errorHandling = false">
            <p class="m-2">
                مشکلی به وجود آمده لطفا دوباره تلاش کنید
            </p>
        </errorMassege>
    </transition>

    <nav class="bg-blue-500 flex justify-between py-1 absolute top-0 left-0 z-20 w-screen h-14">
        <div class="flex flex-row items-center gap-4 justify-center px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer text-white" style="font-size: 1.1rem"
                @click="sideBar = !sideBar"></i>
            <p class="text-xl font-bold text-white cursor-default">{{ currentDesk.title }}</p>
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
                        :class="{ 'cursor-not-allowed text-gray-500': currentProject.length === 0 }">
                        <i v-if="currentProject.length > 0" class="pi pi-angle-down text-green-600"
                            style="font-size: 1rem;"></i>
                        <i v-else class="pi pi-angle-left text-gray-500" style="font-size: 1rem;"></i>
                        <span>پروژه ها</span>
                    </p>
                    <template v-if="currentProject.length > 0">
                        <p v-for="project in currentProject" :key="project._id"
                            @click="project.isActive ? projectRoutePush(project._id) : null"
                            class="flex items-center py-1.5 px-4 gap-3 rounded-sm w-11/12"
                            :class="{ 'dashboard-item-hover cursor-pointer': project.isActive, 'cursor-not-allowed': !project.isActive }">
                            <i class="pi pi-folder" style="font-size: 1rem;"
                                :class="{ 'text-gray-500': !project.isActive, 'text-green-600': project.isActive }"></i>
                            <span :class="{ 'text-gray-500': !project.isActive }">{{ project.title }}</span>
                        </p>
                    </template>
                </div>
            </div>
        </div>

        <div :class="{ 'w-full lg:w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-white h-screen pt-14 overflow-y-scroll custom">
            <div v-if="deskLoading" class="w-fit mx-auto h-24">
                <ProgressSpinner />
            </div>
            <userDashboard v-else @callPopupProject="createNewProject = true" />
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewProject" @close="createNewProject = false">
            <p class="font-bold my-3">پروژه جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">نام پروژه:</p>
                <InputText v-model="projectName" type="text" placeholder="نام پروژه..."
                    class="w-full sm:w-3/5 h-10 rounded-lg" />
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button :loading="projectLoading" label="ایجاد" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                    :disabled="!(projectName.length > 0)" @click="addProject" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="createNewProject = false" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/store/memberStore';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import userDashboard from '@/components/userDashboard.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import errorMassege from '@/components/errorMassege.vue';
import { useProfileStore } from '@/store/profileStore';

export default {
    name: 'UserPanel',

    components: {
        errorMassege,
        Button,
        Avatar,
        userDashboard,
        popUp,
        InputText,
        ProgressSpinner
    },

    props: ["id"],

    beforeRouteEnter(to: any, from: any, next: any) {
        const deskStore = useDeskStore()
        const memberStore = useMemberStore()
        const profileStore = useProfileStore()
        const userPosition = profileStore.userProfile.position
        deskStore.changeLoading(true)
        if (Object.values(deskStore.allDesk).length === 0) {
            next({ path: '/panel' })
        } else {
            deskStore.setCurrentDesk(to.params.id).then(() => {
                if (userPosition === 'manager') {
                    memberStore.fetchMembers().then(() => {
                        deskStore.changeLoading(false)
                    })
                } else {
                    deskStore.changeLoading(false)
                }
                next()
            }).catch(() => {
                next({ path: '/panel' })
            })
        }
    },

    setup() {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();
        const router = useRouter()

        const sideBar = ref(window.innerWidth <= 1024 ? false : true)
        const createNewProject = ref(false)
        const errorHandling = ref(false)
        const projectName = ref('')
        const logOutPopup = ref(false)

        const currentDesk: any = computed(() => deskStore.currentDesk)
        const currentProject: any = computed(() => deskStore.currentDesk.projects)
        const deskLoading = computed(() => deskStore.deskLoading)
        const projectLoading = computed(() => projectStore.projectLoading)


        watch(createNewProject, () => {
            projectName.value = ''
        })

        function logOut() {
            localStorage.clear();
            router.push({
                name: "Login",
            });
        }

        function addProject() {
            projectStore.changeLoading(true)
            errorHandling.value = false
            projectStore.addProject(currentDesk.value._id, projectName.value).then(() => {
                deskStore.setCurrentDesk(currentDesk.value._id).then(() => {
                    projectStore.changeLoading(false)
                    createNewProject.value = false
                })
            }).catch(() => {
                projectStore.changeLoading(false)
                createNewProject.value = false
                errorHandling.value = true
            })
        }

        function projectRoutePush(id: any) {
            router.push({
                name: "UserProject",
                params: { id: id },
            });
        }

        return {
            addProject,
            projectRoutePush,
            logOut,
            sideBar,
            createNewProject,
            currentDesk,
            logOutPopup,
            projectName,
            deskLoading,
            currentProject,
            projectLoading,
            errorHandling
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