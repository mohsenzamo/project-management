<template>
    <div class="splide splide_teammate w-full px-2" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="Object.values(currentTeammate).length > 0">
                    <li v-for="teammate in currentTeammate" :key="teammate.fullName"
                        class="splide__slide py-2 flex justify-center">
                        <Chip :label="teammate.fullName" icon="pi pi-user" />
                    </li>
                    <li class="splide__slide py-2 flex justify-center">
                        <Chip label="اضافه کردن همکار جدید" icon="pi pi-plus" @click="currentEditDesk" />
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide py-2 flex justify-center">
                        <Chip label="اضافه کردن همکار جدید" icon="pi pi-plus" @click="currentEditDesk" />
                    </li>
                </template>
            </ul>
        </div>
    </div>
    <transition name="modal">
        <popUp v-if="modalEditDesk" @close="modalEditDesk = false">
            <p class="font-bold my-3">ویرایش میزکار:</p>
            <div class="mb-3">
                <p class="mb-2">اسم میزکار:</p>
                <InputText v-model="editDeskValue.name" type="text" placeholder="نام شرکت یا تیم..." class="w-3/5 h-10" disabled/>
            </div>
            <div class="custom mb-3 max-h-40 overflow-y-scroll">
                <p class="mb-2">همکاران خود:</p>
                <div class="flex gap-2 my-2 h-10" v-for="(teammate, index) in editDeskTeammate" :key="index">
                    <InputText v-model="teammate.fullName" type="text" placeholder="نام همکار" class="w-1/2" />
                    <InputText v-model="teammate.phoneNumber" type="text" placeholder="شماره همراه" class="w-1/2" />
                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" class="p-button-sm p-button-danger my-px"
                            @click="removeEditTeammate(index)" />
                        <Button icon="pi pi-plus" class="p-button-sm p-button-success my-px" @click="addEditTeammate" />
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="انصراف" class="p-button-sm p-button-danger w-16 h-10" @click="modalEditDesk = false" />
                <Button label="ثبت" class="p-button-sm p-button-info w-16 h-10" :disabled="!(editDeskValue.name.length > 0)"
                    @click="editDesk" />
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
import popUp from '@/components/popUp.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    name: 'sliderTeammate',

    components: {
        Chip,
        popUp,
        Button,
        InputText
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide_teammate', {
                perPage: 6,
                perMove: 1,
                direction: 'rtl',
                pagination: false,
            });

            splide.mount();
        })
        const modalEditDesk = ref(false)
        const editDeskValue = ref<any>(null)
        let editDeskTeammate = ref<any>([])
        const deskBeforeChange = ref('')
        const deskStore = useDeskStore()
        const currentDesk: any = ref(deskStore.currentDesk)
        const selectedDesk: any = ref(deskStore.selectedDesk(currentDesk.value))
        const currentTeammate = computed(() => {
            if (Object.values(selectedDesk.value.teammates).length > 0) {
                return selectedDesk.value.teammates
            } else {
                return []
            }
        })

        function currentEditDesk() {
            modalEditDesk.value = true
            editDeskValue.value = Object.assign({}, selectedDesk.value)
            deskBeforeChange.value = selectedDesk.value.name
            editDeskTeammate.value = []
            Object.values(editDeskValue.value.teammates).forEach((teammate: any) => {
                editDeskTeammate.value.push({
                    fullName: teammate.fullName,
                    phoneNumber: teammate.phoneNumber
                })
            })
            editDeskTeammate.value.push({
                fullName: '',
                phoneNumber: ''
            })
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
            let teammatesObj: any = {}
            if (editDeskTeammate.value[0].fullName.length > 0) {
                editDeskTeammate.value.forEach((item: any) => {
                    if (item.fullName.length > 0) {
                        teammatesObj[item.fullName] = item
                    }
                })
            }

            let objDesk: any = {}

            objDesk = {
                name: editDeskValue.value.name,
                projects: editDeskValue.value.projects,
                teammates: teammatesObj,
                active: true
            }

            deskStore.editDesk(objDesk, deskBeforeChange.value)

            modalEditDesk.value = false
            setInterval(() => {
                deskStore.changeTeammateLoading(false)
            }, 1000);
        }

        return {
            removeEditTeammate,
            addEditTeammate,
            currentEditDesk,
            editDesk,
            editDeskTeammate,
            editDeskValue,
            modalEditDesk,
            currentDesk,
            selectedDesk,
            currentTeammate,
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

