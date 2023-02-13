<template>
    <nav class="bg-yellow-500 flex justify-between py-1 absolute top-0 left-0 z-30 w-screen h-14">
        <div class="flex items-center gap-4 justify-start px-4">
            <i v-if="!sideBar" class="pi pi-align-justify cursor-pointer" style="font-size: 2rem"
                @click="sideBar = !sideBar"></i>
            <i v-else class="pi pi-align-right cursor-pointer" style="font-size: 2rem" @click="sideBar = !sideBar"></i>
            <p>پنل کاربر</p>
        </div>

        <div class="flex items-center gap-4 justify-end px-4">
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText type="text" placeholder="جستجو" />
            </span>
            <i class="pi pi-question-circle" style="font-size: 2rem"></i>

            <i class="pi pi-comments" style="font-size: 2rem"></i>

            <Avatar icon="pi pi-user" class="" size="large" shape="circle" />
        </div>
    </nav>

    <div class="flex">
        <div :class="{ 'w-1/5 p-4 translate-x-0': sideBar, 'w-0 p-0 translate-x-full': !sideBar }"
            class="w-1/5 bg-white transition-all z-10 h-screen pt-20">
            <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm cursor-pointer"
                :class="{ 'bg-gray-400 text-white': componentPage === 'dashboard' }"
                @click="componentPage = 'dashboard'">
                <i class="pi pi-home text-red-600" style="font-size: 1.5rem;"></i>
                <span>داشبورد</span>
            </p>
            <hr class="bg-gray-400 border-none mt-4" style="height: .1rem;" />

            <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm mt-4 cursor-pointer"
                @click="componentPage = 'project'"
                :class="{ 'cursor-not-allowed': Object.keys(alldesks).length === 0, 'bg-gray-400 text-white': componentPage === 'project' }">
                <i class="pi pi-qrcode text-blue-600" style="font-size: 1.5rem;"></i>
                <span>پروژه ها</span>
            </p>
            <!-- <Router-link :to="{ name: 'UserTask' }">
                <p class="flex items-center bg-gray-300 p-2 gap-3 rounded-sm mt-4">
                    <i class="pi pi-check-circle text-green-600" style="font-size: 1.5rem;"></i>
                    <span>وضایف</span>
                </p>
            </Router-link> -->
        </div>
        <div :class="{ 'w-4/5': sideBar, 'w-full': !sideBar }"
            class="bg-gray-200 transition-all z-20 h-screen pt-14 overflow-y-scroll custom">
            <userDashboard v-if="componentPage === 'dashboard'" @callPopup="createNewDesk = true"
                @callCreate="createNewDesk = true" />
            <userProject v-if="componentPage === 'project'"></userProject>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="createNewDesk" @close="createNewDesk = false">
            <p class="text-lg font-bold my-3">میزکار جدید ایجاد کنید:</p>
            <div class="mb-3">
                <p class="mb-2">جهت دسترسی به امکانات پنل، یک میزِکار جدید برای خود ایجاد کنید:</p>
                <InputText v-model="deskName" type="text" placeholder="نام شرکت یا تیم..." class="w-3/5" />
            </div>
            <div class="mb-3">
                <p class="mb-2">همکاران خود را به میزکار جدید دعوت نمایید:</p>
                <div class="flex gap-2 my-2" v-for="(teammate, index) in deskTeammates" :key="index">
                    <InputText v-model="teammate.fullName" type="text" placeholder="نام همکار" class="w-1/2" />
                    <InputText v-model="teammate.phoneNumber" type="text" placeholder="شماره همراه" class="w-1/2" />
                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" class="p-button-sm p-button-danger" @click="removeTeammate(index)" />
                        <Button icon="pi pi-plus" class="p-button-sm p-button-success" @click="addTeammate" />
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger" @click="createNewDesk = false" />
                <Button label="ایجاد" class="p-button-sm p-button-success" :disabled="!(deskName.length > 0)"
                    @click="createDesk" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import { useStore } from '@/store/index';
import { useRouter } from 'vue-router';
import userDashboard from '@/components/userDashboard.vue';
import userProject from '@/components/userProject.vue';
import popUp from '@/components/popUp.vue';
import Button from 'primevue/button';

export default {
    name: 'UserPanel',

    components: {
        Button,
        Avatar,
        userDashboard,
        userProject,
        popUp,
        InputText
    },

    props: ["id"],

    setup() {
        const store = useStore();

        const checked = ref(true)
        const sideBar = ref(true)

        const deskName = ref('')

        const router = useRouter()

        const componentPage = ref('dashboard')


        const createNewDesk = ref(false)

        const selectedDesk = ref<any>(store.desksDrop[0])

        let deskTeammates = ref([{
            fullName: '',
            phoneNumber: null
        }])

        function addTeammate() {
            deskTeammates.value.push({
                fullName: '',
                phoneNumber: null
            })
        }

        function removeTeammate(index: number) {
            deskTeammates.value.splice(index, 1)
            if (deskTeammates.value.length == 0) {
                addTeammate()
            }
        }

        function createDesk() {
            let teammates: any = []
            if (deskTeammates.value[0].fullName.length > 0) {
                teammates = deskTeammates.value.map(item => {
                    return item
                })
            }

            let objDesk: any = {}

            const deskNameValue = deskName.value

            objDesk[deskNameValue] = {
                name: deskName.value,
                teammates: teammates
            }
            store.increment(objDesk)
            store.setCurrentDesk(deskName.value)
            store.setSelectedDropDesk({ name: store.selectedDesk(deskNameValue).name, code: store.selectedDesk(deskNameValue).name })
            createNewDesk.value = false
        }

        watch(createNewDesk, () => {
            deskTeammates.value = [{
                fullName: '',
                phoneNumber: null
            }]
            deskName.value = ''
            if (store.selectedDesk(store.currentDesk)) {
                selectedDesk.value = { name: store.selectedDesk(store.currentDesk).name, code: store.selectedDesk(store.currentDesk).name }
            }
        })

        return {
            removeTeammate,
            deskName,
            sideBar,
            checked,
            alldesks: store.allDesk,
            componentPage,
            createNewDesk,
            deskTeammates,
            addTeammate,
            createDesk,
            selectedDesk
        }
    },
}
</script>

<style lang="scss" scoped>
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

