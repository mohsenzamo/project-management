<template>
    <div class="splide splide_project w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <li v-for="i in 10" :key="i" class="splide__slide">
                    <Card class="w-44 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100">
                        <template #content>
                            <p class="mb-2">پروژه جدید</p>
                            <Button v-if="i % 2 == 0" icon="pi pi-plus" class="p-button-sm p-button-help" />
                        </template>
                    </Card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
    name: 'sliderProject',

    components: {
        Card,
        Button
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide_project', {
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

</style>

