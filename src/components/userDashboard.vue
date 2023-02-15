<template>
    <div v-if="Object.keys(alldesks).length > 0" class="pt-3 px-2">
        <p>
            میزکارشما :
            <Dropdown v-if="desksDrop.length > 1" v-model="selectedDesk" :options="desksDrop" optionLabel="name"
                placeholder="میزکار" class="drop-down" @change="newDeskCall" />
        </p>

        <div v-if="deskLoading" class="w-fit mx-auto mt-40">
            <ProgressSpinner />
        </div>
        <template v-else>

            <div class="my-2">
                <p class="mb-2">پروژه ها:</p>
                <div v-if="projectLoading" class="w-fit mx-auto">
                    <ProgressSpinner />
                </div>
                <sliderProject v-else @callPopupProject="$emit('callPopupProject')"></sliderProject>
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
        </template>
    </div>

    <div v-else class="pt-3 px-2">
        <div class="flex items-center gap-2">
            <p>
                شما میزِکار فعالی ندارید. لطفاً جهت ادامه یک میزِکار جدید برای خود بسازید:
            </p>
            <Button label="ایجاد میزکار جدید" icon="pi pi-plus" class="p-button-sm" @click="$emit('callPopup')" />
        </div>
    </div>

</template>

<script lang="ts">
import Button from 'primevue/button';
import { ref, computed, watch, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import Card from 'primevue/card';
import sliderProject from '@/components/sliderProject.vue';
import sliderTeammate from '@/components/sliderTeammate.vue';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'UserDashboard',

    components: {
        Dropdown,
        Avatar,
        Button,
        Card,
        sliderProject,
        sliderTeammate,
        Checkbox,
        ProgressBar,
        ProgressSpinner
    },

    setup(props: any, context: any) {
        const deskStore = useDeskStore();
        const projectStore = useProjectStore();

        const deskLoading = computed(() => {
            return deskStore.deskLoading
        })

        const projectLoading = computed(() => {
            return projectStore.projectLoading
        })

        function newDeskCall(code: any) {
            if (code.value.code === 0) {
                context.emit('callCreate')
            } else {
                deskStore.changeLoading(true)
                deskStore.setCurrentDesk(code.value.name)
                deskStore.setSelectedDropDesk({ name: code.value.name, code: code.value.name })
                setInterval(() => {
                    deskStore.changeLoading(false)
                }, 3000);
            }
        }

        const checked = ref(true)
        const sideBar = ref(true)

        const desksDrop = computed(() => {
            return deskStore.desksDrop
        })

        const selectedDesk = computed(() => {
            return deskStore.selectedDropDesk
        })

        return {
            newDeskCall,
            selectedDesk,
            sideBar,
            checked,
            desksDrop,
            alldesks: deskStore.allDesk,
            deskLoading,
            projectLoading
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

@keyframes p-progress-spinner-color {

    100%,
    0% {
        stroke: #ffa700;
    }
}
</style>

