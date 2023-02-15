<template>
    <div>
        <p>
                پروژه ها:
                <!-- <Dropdown v-if="projectsDrop.length > 1" v-model="selectedDesk" :options="projectsDrop" optionLabel="name"
                    placeholder="پروژه" class="drop-down" /> -->
            </p>
    </div>
</template>

<script lang="ts">
import Dropdown from 'primevue/dropdown';
import { useProjectStore } from '@/store/projectStore';
import { ref, computed, watch, onMounted } from 'vue'

export default {
    name: "UserTask",

    components: {
        // Dropdown
    },

    setup() {
        const projectStore = useProjectStore();

        // const projectsDrop = computed(() => {
        //     return projectStore.projectsDrop
        // })

        // const selectedDesk = computed(() => {
        //     return projectStore.selectedDropProject
        // })

        return {
            // projectsDrop,
            // selectedDesk
        }
    },
}
</script>

<style lang="scss">

</style>