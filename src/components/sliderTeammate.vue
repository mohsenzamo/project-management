<template>
    <div class="splide splide_teammate w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <li v-for="i in 10" :key="i" class="splide__slide">
                    <Chip label="محسن زهرایی" icon="pi pi-user" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Chip from 'primevue/chip';

export default {
    name: 'sliderTeammate',

    components: {
        Chip
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide_teammate', {
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
.p-chip {
    @apply bg-white cursor-pointer;

    &:hover {
        @apply bg-slate-100;
    }

}

.p-chip .p-chip-icon {
    margin-left: .5rem;
    margin-right: 0;
}
</style>

