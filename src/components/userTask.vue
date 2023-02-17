<template>
    <div class="w-full h-screen p-4">
        <div class="mb-5">
            <p>
                تسک های میزکار :
                <Dropdown v-if="desksDrop.length > 0" v-model="selectedDropDesk" :options="desksDrop" optionLabel="name"
                    placeholder="میزکار" class="drop-down" @change="newDeskCall" />
            </p>
        </div>
        <div class="flex items-center mb-5 gap-2">
            <TriStateCheckbox v-model="isDoneTask" />
            <p v-if="isDoneTask === true">تسک های انجام شده</p>
            <p v-else-if="isDoneTask === false">تسک های در حال انجام</p>
            <p v-else-if="isDoneTask === null">همه تسک ها</p>
        </div>
        <div class="mb-5">
            <Button icon="pi pi-plus" label="تسک جدید" class="p-button-info" @click="$emit('callPopupTask')" />
        </div>
        <div v-if="taskLoading || deskLoading" class="w-fit mx-auto mt-40">
            <ProgressSpinner />
        </div>
        <div v-else>
            <template v-for="project in currentProject" :key="project.name">
                <template v-if="Object.values(project.tasks).length > 0">
                    <div v-for="task in project.tasks" :key="task.name"
                        class="w-full mx-auto mb-2 bg-white rounded-sm shadow-sm flex justify-between items-center p-2">
                        <div class="flex gap-2 items-center">
                            <Checkbox name="task" :value="task.name" v-model="tasksChecked" />
                            <p>{{ task.name }}</p>
                            <small class="text-ellipsis whitespace-nowrap overflow-hidden w-96">{{ task.description
                            }}</small>
                        </div>
                        <div class="flex gap-2 items-center">
                            <Chip :label="project.name" icon="pi pi-folder" />
                            <Chip :label="task.responsible" icon="pi pi-user" />
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Dropdown from 'primevue/dropdown';
import { useDeskStore } from '@/store/deskStore';
import { ref, computed, watch } from 'vue'
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TriStateCheckbox from 'primevue/tristatecheckbox';

export default {
    name: "UserTask",

    components: {
        Button,
        Chip,
        Checkbox,
        ProgressSpinner,
        Dropdown,
        TriStateCheckbox
    },

    setup(props: any, context: any) {

        const tasksChecked = computed(() => {
            const isDoneArray: any = []
            if (Object.values(selectedDesk.value.projects).length > 0) {
                Object.values(selectedDesk.value.projects).forEach((project: any) => {
                    Object.values(project.tasks).forEach((task: any) => {
                        task.isDone === true ? isDoneArray.push(task.name) : null
                    })
                })
            }
            return isDoneArray
        })
        const isDoneTask = ref(null)
        const deskStore = useDeskStore()
        const currentDesk: any = computed(() => deskStore.currentDesk)
        const selectedDesk: any = computed(() => deskStore.selectedDesk(currentDesk.value))
        const taskLoading = computed(() => deskStore.taskLoading)
        const desksDrop = computed(() => {
            let result = deskStore.desksDrop.filter(item => item.code !== 0);
            result = result.filter(item => {
                return Object.values(deskStore.allDesk[item.code].projects).length > 0
            })
            return result
        })
        const selectedDropDesk = computed(() => deskStore.selectedDropDesk)
        const deskLoading = computed(() => deskStore.deskLoading)


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

        watch(tasksChecked, (x) => { console.log(x) })

        return {
            tasksChecked,
            currentProject,
            taskLoading,
            desksDrop,
            selectedDropDesk,
            deskLoading,
            isDoneTask,
            newDeskCall
        }
    },
}
</script>

<style lang="scss" scoped>
.p-chip {
    @apply bg-slate-100 cursor-pointer rounded-sm;

    &:hover {
        @apply bg-slate-200;
    }

}

.p-chip .p-chip-icon {
    margin-left: .5rem;
    margin-right: 0;
}
</style>