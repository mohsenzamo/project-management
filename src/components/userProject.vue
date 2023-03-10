<template>
    <div class="w-full h-screen p-4">
        <div class="flex justify-between items-center">
            <p>
                پروژه های میزکار :
                <Dropdown v-if="desksDrop.length > 1" v-model="selectedDropDesk" :options="desksDrop" optionLabel="name"
                    placeholder="میزکار" class="drop-down" @change="newDeskCall" />
            </p>
            <div class="flex gap-2">
                <InlineMessage v-if="notFoundedProject && !projectLoading" severity="warn">پروژه ای با این نام پیدا نشد
                </InlineMessage>
                <InputText type="text" placeholder="جستجو پروژه" v-model="projectSearch"
                    :disabled="currentProject === undefined || currentProject.length === 0" class="h-10 w-44"/>
            </div>
        </div>
        <div v-if="deskLoading || projectLoading" class="w-fit mx-auto mt-40">
            <ProgressSpinner />
        </div>
        <template v-else>
            <div v-if="notFoundedProject">
                <listProject @callPopupProject="$emit('callPopupProject')" :currentProject="[]" />
            </div>
            <listProject v-else @callPopupProject="$emit('callPopupProject')"
                :currentProject="Object.values(foundedProject).length > 0 ? foundedProject : currentProject" />
        </template>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { useDeskStore } from '@/store/deskStore';
import { useProjectStore } from '@/store/projectStore';
import Dropdown from 'primevue/dropdown';
import listProject from './listProject.vue';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

export default {
    name: "UserProject",

    components: {
        Dropdown,
        listProject,
        ProgressSpinner,
        InputText,
        InlineMessage
    },

    setup(props: any, context: any) {
        const projectSearch = ref('')
        const foundedProject = ref<any>({})
        const notFoundedProject = ref(false)
        const deskStore = useDeskStore()
        const projectStore = useProjectStore()
        const desksDrop = computed(() => deskStore.desksDrop)
        const deskLoading = computed(() => deskStore.deskLoading)
        const projectLoading = computed(() => projectStore.projectLoading)
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const selectedDropDesk = computed(() => deskStore.selectedDropDesk)
        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))
        const currentProject: any = computed(() => {
            if (Object.values(selectedDesk.value.projects).length > 0) {
                return selectedDesk.value.projects
            } else {
                return []
            }
        })

        function newDeskCall(code: any) {
            if (code.value.code === 0) {
                context.emit('callCreate')
            } else {
                deskStore.changeLoading(true)
                deskStore.setCurrentDesk(code.value.name)
                deskStore.setSelectedDropDesk({ name: code.value.name, code: code.value.name })
                setInterval(() => {
                    deskStore.changeLoading(false)
                }, 3000);
            }
        }

        watch(projectSearch, (text) => {
            projectStore.changeLoading(true)
            if (text && text.length > 0) {
                foundedProject.value = {}
                notFoundedProject.value = false
                Object.values(currentProject.value).forEach((element: any) => {
                    element.name.startsWith(text) ? foundedProject.value[element.name] = currentProject.value[element.name] : null
                })
                if (Object.values(foundedProject.value).length === 0) {
                    notFoundedProject.value = true
                }
            } else {
                foundedProject.value = {}
                notFoundedProject.value = false
            }
            setInterval(() => {
                projectStore.changeLoading(false)
            }, 1000);
        })

        return {
            selectedDropDesk,
            foundedProject,
            notFoundedProject,
            desksDrop,
            selectedDesk,
            newDeskCall,
            deskLoading,
            currentProject,
            projectLoading,
            projectSearch
        }
    },
}
</script>

<style lang="scss">
.p-inline-message .p-inline-message-icon {
    margin-right: 0;
    margin-left: .5rem;
}
</style>