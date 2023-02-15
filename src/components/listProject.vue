<template>
    <div class="splide splide_project mx-auto mt-24" role="group" style="width: 99%;">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentProject?.length > 0">
                    <li v-for="project in currentProject" :key="project.name" class="splide__slide">
                        <Card class="w-52 h-72">
                            <template #title>
                                <p class="mb-2 text-center">{{ project.name }}</p>
                            </template>
                            <template #content>
                                <div class="mb-2">
                                    <p class="mb-1">وضعیت پروژه:</p>
                                    <ProgressBar :value="60" />
                                </div>
                                <div>
                                    <p class="mb-1">وضایف من:</p>
                                    <ProgressBar :value="40" />
                                </div>
                            </template>
                            <template #footer>
                                <div class="flex gap-2">
                                    <Button icon="pi pi-check" label="ادیت" class="p-button-success" />
                                    <Button icon="pi pi-times" label="حذف" class="p-button-danger" />
                                </div>
                            </template>
                        </Card>
                    </li>
                    <li class="splide__slide">
                        <Card class="w-52 h-72">
                            <template #content>
                                <div class="h-full w-full text-center mt-16">
                                    <p class="mb-4">ساخت پروژه جدید</p>
                                    <Button icon="pi pi-plus" @click="$emit('callPopupProject')" />
                                </div>
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide">
                        <Card class="w-52 h-72">
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

export default {
    name: "ListProject",

    props: ['currentProject'],

    components: {
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

        return {
        }
    },
}
</script>

<style lang="scss">
.p-button .p-button-icon-left {
    margin-right: 0;
    margin-left: .5rem;
}
</style>