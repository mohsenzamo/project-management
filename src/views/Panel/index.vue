<template>
    <nav class="bg-yellow-500 flex justify-between py-1">
        <div class="flex items-center gap-4 justify-start px-4">
            <i class="pi pi-align-justify" style="font-size: 2rem"></i>
            <p>پنل کاربر</p>

            <Dropdown v-if="desksDrop.length > 1" v-model="selectedDesk" :options="desksDrop" optionLabel="name"
                placeholder="میزکار" class="drop-down" @change="newDeskCall" />


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
    <div v-if="Object.keys(alldesks).length > 0" class="pt-3 px-2">
        <p class="">
            میزکارشما :
            <span class="pr-1 font-semibold">{{ selectedDesk!.name }}</span>
        </p>

        <div class="my-2">
            <p class="mb-2">پروژه ها:</p>
            <sliderProject></sliderProject>
        </div>

        <div class="my-2">
            <p class="mb-2">همکاران:</p>
            <sliderTeammate></sliderTeammate>
        </div>

        <div class="flex gap-2 my-3">
            <Card class="w-full">
                <template #header>
                    <div class="bg-green-500 rounded-t-sm p-2">
                        کارهای من
                    </div>
                </template>
                <template #content>
                    <div class="w-full mx-0 custom h-56 overflow-y-scroll">
                        <p v-for="i in 20" :key="i" class="bg-gray-300 flex items-center rounded-sm mb-1 p-2">
                            <Checkbox v-model="checked" />
                            <span class="mx-2">کار من</span>
                            <small>توضیحات</small>
                        </p>
                    </div>
                </template>
            </Card>
            <Card class="w-full">
                <template #header>
                    <div class="bg-blue-500 rounded-t-sm p-2">
                        کارهای دیگران
                    </div>
                </template>
                <template #content>
                    <div class="w-full mx-0 custom h-56 overflow-y-scroll">
                        <div v-for="i in 20" :key="i"
                            class="bg-gray-300 flex items-center rounded-sm mb-1 p-2 justify-between">
                            <p>
                                <Checkbox v-model="checked" />
                                <span class="mx-2">کار دیگران</span>
                                <small>توضیحات</small>
                            </p>
                            <Avatar icon="pi pi-user" shape="circle" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="my-2">
            <Card class="w-full cursor-pointer">
                <template #header>
                    <div class="bg-purple-500 rounded-t-sm p-2">
                        وضعیت پیشرفت پروژه ها
                    </div>
                </template>
                <template #content>
                    <div class="w-full mx-0 custom h-56 overflow-y-scroll">
                        <div v-for="i in 20" :key="i" class="bg-gray-300 mb-1 text-sm p-2 rounded-sm">
                            <p class="mb-1">
                                پروژه: تستی
                            </p>
                            <ProgressBar :value="100" />
                            <div class="flex flex-row-reverse gap-2 mt-1">
                                <p>
                                    <span>کارهای انجام شده:</span>
                                    <span>0</span>
                                </p>
                                <p>
                                    <span>کارهای باقی مانده:</span>
                                    <span>0</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <div v-else class="pt-3 px-2">
        <div class="flex items-center gap-2">
            <p>
                شما میزِکار فعالی ندارید. لطفاً جهت ادامه یک میزِکار جدید برای خود بسازید:
            </p>
            <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm" @click="createNewDesk = true" />
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
import Button from 'primevue/button';
import { ref, computed, watch, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import popUp from '@/components/popUp.vue';
import { useStore } from '@/store/index';
import Card from 'primevue/card';
import sliderProject from '@/components/sliderProject.vue';
import sliderTeammate from '@/components/sliderTeammate.vue';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';

export default {
    name: 'UserPanel',

    components: {
        Dropdown,
        InputText,
        Avatar,
        Button,
        popUp,
        Card,
        sliderProject,
        sliderTeammate,
        Checkbox,
        ProgressBar
    },

    props: ["id"],

    setup() {
        const store = useStore();

        const deskName = ref('')

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

        let desksDrop = computed(() => {
            let items: object[] = Object.values(store.allDesk).map((item: any, index: number) => {
                return { name: item.name, code: item.name }
            })
            items.push({ name: 'میزکار جدید', code: 0 })
            return items
        })

        const selectedDesk = ref<any>(desksDrop.value.length > 1 ? desksDrop.value[0] : null)

        const createNewDesk = ref(false)

        function createDesk() {
            let teammates: any = []
            if (deskTeammates.value[0].fullName.length > 0) {
                teammates = deskTeammates.value.map(item => {
                    return item
                })
            }
            const deskNameValue = deskName.value
            let objDesk: any = {}
            objDesk[deskNameValue] = {
                name: deskName.value,
                teammates: teammates
            }
            store.increment(objDesk)
            createNewDesk.value = false
            selectedDesk.value = { name: deskName.value, code: deskName.value }
            // new Splide('.splide').mount();
        }

        watch(createNewDesk, () => {
            deskTeammates.value = [{
                fullName: '',
                phoneNumber: null
            }]
            deskName.value = ''
        })

        function newDeskCall(code: any) {
            if (code.value.code === 0) {
                createNewDesk.value = true
            }
        }

        const checked = ref(true)

        return {
            checked,
            newDeskCall,
            selectedDesk,
            desksDrop,
            createNewDesk,
            deskName,
            deskTeammates,
            addTeammate,
            removeTeammate,
            createDesk,
            alldesks: store.allDesk
        }
    },
}
</script>

<style lang="scss" scoped>
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

