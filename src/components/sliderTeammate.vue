<template>
    <div class="splide splide_teammate w-full px-2" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentTeammate.length > 0">
                    <li v-for="teammate in currentTeammate" :key="teammate.username"
                        class="splide__slide py-2 flex justify-center items-center">
                        <Chip :label="teammate.username" icon="pi pi-user"
                            class="h-fit max-w-full border-t-2 border-blue-400 rounded-lg overflow-hidden py-1 px-5" />
                    </li>
                    <li v-if="userPosition === 'manager'" class="splide__slide py-2 flex justify-center items-center">
                        <Chip label="افزودن" icon="pi pi-plus" @click="currentEditDesk"
                            class="h-fit border-t-2 border-blue-400 rounded-lg py-1 px-5" />
                    </li>
                </template>
                <template v-else-if="userPosition === 'manager'">
                    <li class="splide__slide py-2 flex justify-center items-center">
                        <Chip label="افزودن" icon="pi pi-plus" @click="currentEditDesk"
                            class="h-fit border-t-2 border-blue-400 rounded-lg py-1 px-5" />
                    </li>
                </template>
            </ul>
        </div>
    </div>

    <transition name="modal">
        <popUp v-if="modalEditDesk" @close="modalEditDesk = false" class="z-50">
            <p class="font-bold my-3">اضافه کردن همکار:</p>
            <div class="mb-3">
                <p class="mb-2">اسم میزکار:</p>
                <InputText v-model="currentDesk.title" type="text" placeholder="نام شرکت یا تیم..."
                    class="w-full sm:w-3/5 h-10 rounded-lg" disabled />
            </div>
            <div class="mb-3">
                <p class="mb-2">همکاران خود:</p>
                <div class="flex flex-col justify-center items-center gap-2 my-2">
                    <!-- v-for="(teammate, index) in editDeskTeammate" :key="index" -->
                    <Message v-if="notFoundedUser" severity="error" dir="ltr" icon="pi-user">همکاری با این نام کاربری ثبت
                        نشده است</Message>
                    <InputText v-model="teammateUsername" type="text" placeholder="نام کاربری"
                        class="w-full sm:w-1/2 rounded-lg" />
                </div>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="ثبت" class="p-button-sm p-button-info w-20 h-10 rounded-lg" @click="editDesk" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="modalEditDesk = false" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">

import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Chip from 'primevue/chip';
import { computed, onMounted, ref } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import { useProfileStore } from '@/store/profileStore';
import popUp from '@/components/popUp.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import axios from 'axios';
import Message from 'primevue/message';

export default {
    name: 'sliderTeammate',

    components: {
        Chip,
        popUp,
        Button,
        InputText,
        Message
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide_teammate', {
                perPage: 6,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
                breakpoints: {
                    960: {
                        perPage: 5
                    },
                    760: {
                        perPage: 4
                    },
                    630: {
                        perPage: 3
                    },
                    500: {
                        perPage: 2
                    },
                }
            });

            splide.mount();
        })
        const modalEditDesk = ref(false)
        const notFoundedUser = ref(false)
        const editDeskValue = ref<any>(null)
        let editDeskTeammate = ref<any>([])
        const deskBeforeChange = ref('')
        const teammateUsername = ref('')
        const deskStore = useDeskStore()
        const currentDesk: any = ref(deskStore.currentDesk)
        const currentTeammate: any = ref(deskStore.currentDesk.teammates)
        const selectedDesk: any = ref(deskStore.selectedDesk(currentDesk.value))
        const profileStore = useProfileStore()
        const userPosition = computed(() => profileStore.userProfile.position)

        function currentEditDesk() {
            teammateUsername.value = ''
            notFoundedUser.value = false
            modalEditDesk.value = true
        }
        function addEditTeammate() {
            editDeskTeammate.value.push({
                fullName: '',
                phoneNumber: null
            })
        }
        function removeEditTeammate(index: number) {
            editDeskTeammate.value.splice(index, 1)
            if (editDeskTeammate.value.length == 0) {
                addEditTeammate()
            }
        }

        function editDesk() {
            deskStore.changeTeammateLoading(true)
            const config = {
                method: 'post',
                url: process.env.VUE_APP_BASE_API_URL + '/teammates/workdesk/' + currentDesk.value._id,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    username: teammateUsername.value
                }
            };
            axios(config)
                .then((response: any) => {
                    axios.get(process.env.VUE_APP_BASE_API_URL + '/workdesks/one/' + currentDesk.value._id, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`
                        }
                    })
                        .then((resdesk) => {
                            deskStore.setCurrentDesk(resdesk.data[0])

                            deskStore.changeTeammateLoading(false)
                        })
                        .catch((error) => {
                            console.log(error);

                        })
                })
                .catch((error: any) => {
                    console.log(error)
                });
        }

        return {
            removeEditTeammate,
            addEditTeammate,
            currentEditDesk,
            editDesk,
            userPosition,
            editDeskTeammate,
            editDeskValue,
            modalEditDesk,
            currentDesk,
            selectedDesk,
            currentTeammate,
            teammateUsername,
            notFoundedUser
        }
    },
}
</script>

<style lang="scss">
.p-chip {
    @apply bg-white cursor-pointer transition-all shadow-md;

    &:hover {
        @apply bg-slate-100 -translate-y-2;
    }

}

.p-chip .p-chip-icon {
    margin-left: .5rem;
    margin-right: 0;
}
</style>

