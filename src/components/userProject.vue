<template>
    <div class="w-full h-screen p-4">
        <p class="">
            پروژه های میزکار :
            <Dropdown v-if="desksDrop.length > 1" v-model="selectedDesk" :options="desksDrop" optionLabel="name"
                placeholder="میزکار" class="drop-down" />
        </p>

        <div class="splide splide_project bg-lime-600 mx-auto mt-20" role="group" style="width: 99%;">
            <div class="splide__track">
                <ul class="splide__list">
                    <li v-for="i in 10" :key="i" class="splide__slide">
                        <Card>
                            <template #header>
                                <div class="bg-red-500 flex justify-center h-20 items-center">
                                    <i class="pi pi-times" style="font-size: 2rem"></i>
                                </div>
                            </template>
                            <template #title>
                                اسم پروژه
                            </template>
                            <template #content>
                                <div>
                                    <p>وضعیت پروژه:</p>
                                    <ProgressBar :value="60" />
                                </div>
                                <div>
                                    <p>وضایف من:</p>
                                    <ProgressBar :value="40" />
                                </div>
                            </template>
                            <template #footer>
                                <div class="flex gap-2">
                                    <Button icon="pi pi-check" label="ادیت" />
                                    <Button icon="pi pi-times" label="حذف" class="p-button-secondary"
                                        style="margin-left: .5em" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { ref, computed, watch, onMounted } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Dropdown from 'primevue/dropdown';

export default {
    name: "UserProject",

    components: {
        Dropdown,
        Card,
        Button,
        ProgressBar
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide', {
                autoWidth: true,
                perMove: 1,
                direction: 'rtl',
                wheel: true,
                pagination: false,
                arrows: false,
                gap: '1rem'
            });

            splide.mount();
        })

        const store = useDeskStore();

        let desksDrop = computed(() => {
            let items: object[] = Object.values(store.allDesk).map((item: any, index: number) => {
                return { name: item.name, code: item.name }
            })
            items.push({ name: 'میزکار جدید', code: 0 })
            return items
        })

        const selectedDesk = computed(() => {
            return store.selectedDropDesk
        })

        return {
            selectedDesk,
            desksDrop,
        }
    },
}
</script>