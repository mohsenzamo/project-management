<template>
    <nav class="bg-red-400 flex justify-between py-1">
        <div class="flex items-center gap-4 justify-start px-4">
            <i class="pi pi-align-justify" style="font-size: 2rem"></i>
            <p>پنل کاربر</p>

            <Dropdown v-if="desksDrop.length > 1" v-model="selectedCity" :options="desksDrop" optionLabel="name"
                placeholder="میزکار" class="drop-down" />


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
    <div class="pt-3 px-2">
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
                <Button label="ایجاد" class="p-button-sm p-button-success" :disabled="!(deskName.length > 0)" />
            </div>
        </popUp>
    </transition>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue'
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import popUp from '@/components/popUp.vue'

export default {
    name: 'UserPanel',

    components: {
        Dropdown,
        InputText,
        Avatar,
        Button,
        popUp
    },

    props: ["id"],

    setup() {
        // {
        //     name: '',
        //         teammates: [
        //             {
        //                 fullName: '',
        //                 phoneNumber: null
        //             }
        //         ]
        // }

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

        const desks: any = [
        ]

        let desksDrop = desks.map((item: any, index: number) => {
            return { name: item.name, code: index + 1 }
        })

        desksDrop.push({ name: 'میزکار جدید', code: '0' })

        const selectedCity = desksDrop.length > 1 ? desksDrop[0] : null

        const createNewDesk = ref(false)

        // function createDesk() {
        //     desks.push(
        //         {
        //             name: deskName.value,
        //             teammates: deskTeammates.value[0].fullName.length > 0 ? deskTeammates.value : null
        //         }
        //     )
        //     console.log(desks)
        // }

        return {
            selectedCity,
            desksDrop,
            createNewDesk,
            deskName,
            deskTeammates,
            addTeammate,
            removeTeammate,
            // createDesk
        }
    },
}
</script>

<style lang="scss">

</style>

