<template>
    <div class="splide splide_project mx-auto mt-24" role="group" style="width: 99%;">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="Object.values(currentProject).length > 0">
                    <li v-for="project in currentProject" :key="project.name" class="splide__slide py-4">
                        <Card class="w-64 h-80 shadow-md hover:-translate-y-2 transition-all">
                            <template #header>
                                <div class="flex mb-1 gap-2 justify-between p-3">
                                    <InputSwitch v-model="checked" />
                                    <i class="pi pi-pencil cursor-pointer hover:text-yellow-400" style="font-size: 1.5rem"></i>
                                </div>
                            </template>
                            <template #title>
                                <p class="mb-3 text-center">{{ project.name }}</p>
                            </template>
                            <template #content>
                                <div class="mb-4">
                                    <p class="mb-2 text-lg">وضعیت پروژه:</p>
                                    <ProgressBar :value="60" />
                                </div>
                                <div>
                                    <p class="mb-2 text-lg">وضایف من:</p>
                                    <ProgressBar :value="40" />
                                </div>
                            </template>
                        </Card>
                    </li>
                    <li class="splide__slide py-4">
                        <Card class="w-64 h-80 shadow-md hover:-translate-y-2 transition-all">
                            <template #content>
                                <div class="h-full w-full text-center mt-20">
                                    <p class="mb-4 text-xl">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')" class="h-10"/>
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide py-4">
                        <Card class="w-64 h-80 hover:-translate-y-2 transition-all shadow-md">
                            <template #content>
                                <div class="h-full w-full text-center mt-16">
                                    <p class="mb-4">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { ref, computed, watch, onMounted } from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import InputSwitch from 'primevue/inputswitch';

export default {
    name: "ListProject",

    props: ['currentProject'],

    components: {
        Card,
        Button,
        ProgressBar,
        InputSwitch
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
        const checked = ref(false)

        return {
            checked
        }
    },
}
</script>

<style lang="scss">
.p-progressbar {
    @apply font-iransans;
}

.p-button .p-button-icon-left {
    margin-right: 0;
    margin-left: .5rem;
}
</style>