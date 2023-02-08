<template>
    <div ref="carousel" class="splide w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <li v-for="i in 10" :key="i" class="splide__slide bg-green-500">
                    <Card class="text-center w-44 mx-4">
                        <template #content>
                            <p class="mb-3">پروژه جدید</p>
                            <Button icon="pi pi-plus" class="p-button-sm p-button-help" />
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
            const splide = new Splide('.splide', {
                autoWidth: true,
                perMove: 1,
                direction: 'rtl',
                wheel: true,
                pagination: false,
                arrows: false
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

