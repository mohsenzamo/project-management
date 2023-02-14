<template>
    <div class="splide splide_teammate w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentTeammate?.length > 0">
                    <li v-for="teammate in currentTeammate" :key="teammate.fullName" class="splide__slide">
                        <Chip :label="teammate.fullName" icon="pi pi-user" />
                    </li>
                    <li class="splide__slide">
                        <Chip label="اضافه کردن همکار جدید" icon="pi pi-plus" />
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide">
                        <Chip label="اضافه کردن همکار جدید" icon="pi pi-plus" />
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Chip from 'primevue/chip';
import { computed, onMounted, watch } from 'vue'
import { useTeammateStore } from '@/store/teammateStore';
import { useDeskStore } from '@/store/deskStore';

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

        const deskStore = useDeskStore()
        const teammateStore = useTeammateStore()

        const selectedDesk: any = computed(() => {
            return deskStore.selectedDropDesk
        })

        const currentTeammate = computed(() => {
            if (selectedDesk.value.code !== 0) {
                return teammateStore.selectedTeammate(selectedDesk.value.name)
            } else {
                return []
            }
        })

        return {
            currentTeammate,
            selectedDesk
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

