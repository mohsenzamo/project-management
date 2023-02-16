<template>
    <div>
        <p>
            پروژه ها:
            <!-- <Dropdown v-model="selectedProject" :options="projectsDrop" optionLabel="name"
                        placeholder="پروژه" class="drop-down" /> -->
        </p>
</div>
</template>

<script lang="ts">

import Dropdown from 'primevue/dropdown';
import { useProjectStore } from '@/store/projectStore';
import { useDeskStore } from '@/store/deskStore';
import { ref, computed, watch, onMounted } from 'vue'

export default {
    name: "UserTask",

    components: {
        // Dropdown
    },

    setup() {
        const projectStore = useProjectStore();
        const deskStore = useDeskStore()

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

        // const projectsDrop = computed(() => {
        //     if (selectedDesk.value.code !== 0) {
        //         console.log(projectStore.projectDrop(selectedDesk.value.name), 12345)
        //         return projectStore.projectDrop(selectedDesk.value.name)
        //     } else {
        //         return []
        //     }
        // })

        // const selectedProject = computed(() => {
        //     return projectStore.selectedDropProject
        // })

        return {
            // projectsDrop,
            // selectedProject
        }
    },
}
</script>

<style lang="scss"></style>