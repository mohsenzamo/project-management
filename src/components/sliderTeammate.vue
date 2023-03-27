<template>
    <div class="splide splide_teammate w-full px-2" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentTeammates.length > 0">
                    <li v-for="teammate in currentTeammates" :key="teammate.username"
                        class="splide__slide py-2 flex justify-center items-center">
                        <Chip :label="teammate.username" icon="pi pi-user"
                            class="h-fit max-w-full border-t-2 border-blue-400 rounded-lg overflow-hidden py-1 px-5" />
                    </li>
                    <li v-if="userPosition === 'manager' && members.length > 0" class="splide__slide py-2 flex justify-center items-center">
                        <Chip label="افزودن" icon="pi pi-plus" @click="currentEditDesk"
                            class="h-fit border-t-2 border-blue-400 rounded-lg py-1 px-5" />
                    </li>
                </template>
                <template v-else-if="userPosition === 'manager' && members.length > 0">
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
                    <Message v-if="notFoundedUser" severity="error" dir="ltr" icon="pi-user">همکاری با این نام کاربری ثبت
                        نشده است</Message>
                    <MultiSelect v-model="selectedMembers" :options="members" filter optionLabel="name"
                        placeholder="انتخاب همکار" class="w-full md:w-20rem" />
                    <!-- <InputText v-model="teammateUsername" type="text" placeholder="نام کاربری"
                        class="w-full sm:w-1/2 rounded-lg" /> -->
                </div>
            </div>
            <div class="w-full flex justify-center items-center gap-2">
                <Button label="ثبت" class="p-button-sm p-button-info w-20 h-10 rounded-lg" @click="editDesk" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="modalEditDesk = false" />
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
                <Button label="ثبت" class="p-button-sm p-button-success w-20 h-10 rounded-lg"
                    @click="increaseTeammatePoint" />
                <Button label="انصراف" class="p-button-sm p-button-danger w-20 h-10 rounded-lg"
                    @click="teammatePoint = ''" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import { useProfileStore } from '@/store/profileStore';
import { useMemberStore } from '@/store/memberStore';
import Chip from 'primevue/chip';
import popUp from '@/components/popUp.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default {
    name: 'sliderTeammate',

    components: {
        Chip,
        popUp,
        Button,
        InputText,
        Message,
        MultiSelect
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

        const deskStore = useDeskStore()
        const profileStore = useProfileStore()
        const memberStore = useMemberStore()

        const modalEditDesk = ref(false)
        const notFoundedUser = ref(false)
        const teammateUsername = ref('')
        const teammatePoint = ref('')
        const reasonPoint = ref('')
        const extraPoint = ref<number>(0)
        const selectedMembers = ref<any>()

        const currentDesk = computed(() => deskStore.currentDesk)
        const currentTeammates = computed(() => deskStore.currentDesk.teammates)
        const userPosition = computed(() => profileStore.userProfile.position)
        const members = computed(() => {
            let arr: any = []
            Object.values(memberStore.allMember).forEach((member: any) => {
                member.forEach((index: any) => {
                    let isThere = false
                    currentDesk.value.teammates.forEach((item: any) => {
                        if (item.username === index.username) {
                            isThere = true
                        }
                    })
                    if (!isThere) {
                        arr.push({ name: index.username, code: index.username })
                    }
                })
            })
            return arr
        })

        function currentEditDesk() {
            teammateUsername.value = ''
            notFoundedUser.value = false
            modalEditDesk.value = true
        }

        function increaseTeammatePoint() {
            deskStore.changeLoading(true)
            deskStore.increasePoint(teammatePoint.value, extraPoint.value, reasonPoint.value).then(() => {
                // projectStore.setCurrentProject(currentProject.value._id).then(() => {
                //     deskStore.changeLoading(false)
                //     teammatePoint.value = ''
                // })
            })
        }

        function editDesk() {
            deskStore.changeLoading(true)
            deskStore.addTeammate(currentDesk.value._id, selectedMembers.value).then(() => {
                setTimeout(() => {
                    deskStore.setCurrentDesk(currentDesk.value._id).then(() => {
                        deskStore.changeLoading(false)
                    })
                }, 1000);
            })
        }

        return {
            currentEditDesk,
            editDesk,
            increaseTeammatePoint,
            userPosition,
            extraPoint,
            modalEditDesk,
            currentDesk,
            currentTeammates,
            teammateUsername,
            notFoundedUser,
            reasonPoint,
            teammatePoint,
            members,
            selectedMembers
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

