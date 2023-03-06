<template>
    <div class="splide splide_project w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="Object.values(currentProject).length > 0">
                    <li v-for="project in currentProject" :key="project.name" class="splide__slide py-2">
                        <Card
                            class="w-44 h-36 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:-translate-y-2 transition-all shadow-md mx-auto">
                            <template #content>
                                <p class="mb-2">{{ project.name }}</p>
                            </template>
                        </Card>
                    </li>
                    <li class="splide__slide py-2">
                        <Card
                            class="w-44 h-36 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:-translate-y-2 transition-all shadow-md mx-auto">
                            <template #content>
                                <p class="mb-2 text-lg">پروژه جدید</p>
                                <Button icon="pi pi-plus" class="p-button-primary p-button-sm p-button-help h-9 w-9"
                                    @click="$emit('callPopupProject')" />
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide py-2">
                        <Card
                            class="w-44 h-36 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:-translate-y-2 transition-all shadow-md mx-auto">
                            <template #content>
                                <p class="mb-2 text-lg">پروژه جدید</p>
                                <Button icon="pi pi-plus" class="p-button-primary p-button-sm p-button-help h-9 w-9"
                                    @click="$emit('callPopupProject')" />
                            </template>
                        </Card>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { computed, onMounted, ref } from 'vue'
import { useDeskStore } from '@/store/deskStore';

export default {
    name: 'sliderProject',

    components: {
        Card,
        Button
    },

    setup() {
        onMounted(() => {
            const splide = new Splide('.splide_project', {
                perPage: 5,
                perMove: 1,
                direction: 'rtl',
                wheel: true,
                pagination: false,
            });

            splide.mount();
        })

        const deskStore = useDeskStore()
        const currentDesk: any = ref(deskStore.currentDesk)
        const selectedDesk: any = ref(deskStore.selectedDesk(currentDesk.value))
        const currentProject = computed(() => {
            if (Object.values(selectedDesk.value.projects).length > 0) {
                return selectedDesk.value.projects
            } else {
                return []
            }
        })

        return {
            currentProject,
        }
    },
}
</script>

<style lang="scss">
.splide__arrow {
    background-color: #ccc;
    border-radius: .2rem;
    height: 3.5em;
    width: .7em;
}

.splide__arrows--rtl .splide__arrow--prev {
    right: -.5em;
}

.splide__arrows--rtl .splide__arrow--next {
    left: -.5em;
}
</style>

