<template>
    <div class="splide splide_project w-full" role="group">
        <div class="splide__track">
            <ul class="splide__list">
                <template v-if="currentProject?.length > 0">
                    <li v-for="project in currentProject" :key="project.name" class="splide__slide">
                        <Card
                            class="w-44 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100">
                            <template #content>
                                <p class="mb-2">{{ project.name }}</p>
                            </template>
                        </Card>
                    </li>
                    <li class="splide__slide">
                        <Card
                            class="w-44 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100">
                            <template #content>
                                <p class="mb-2">پروژه جدید</p>
                                <Button icon="pi pi-plus" class="p-button-sm p-button-help"
                                    @click="$emit('callPopupProject')" />
                            </template>
                        </Card>
                    </li>
                </template>
                <template v-else>
                    <li class="splide__slide">
                        <Card
                            class="w-44 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100">
                            <template #content>
                                <p class="mb-2">پروژه جدید</p>
                                <Button icon="pi pi-plus" class="p-button-sm p-button-help"
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
import { computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/store/projectStore';
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
        const projectStore = useProjectStore()

        const selectedDesk: any = computed(() => {
            return deskStore.selectedDropDesk
        })

        const currentProject = computed(() => {
            if (selectedDesk.value.code !== 0) {
                return projectStore.selectedProject(selectedDesk.value.name)
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

</style>

