import { defineStore } from "pinia";

interface taskObj {
  name: string;
  description: string
  responsible: [];
}

export const useTaskStore = defineStore("useTaskStore", {
  state: () => ({
    // allTasks: {} as any,
    // tasksLoading: false as boolean,
  }),
  getters: {
    // allTask: (state) => state.allTasks,
    // taskLoading: (state) => state.tasksLoading,
    // selectedTask: (state) => {
    //   return (taskId: any) => {
    //     return state.allTasks[taskId];
    //   };
    // },
  },
  actions: {
    // addTask(deskName: string, task: object) {
    //   const objTask: any = {};

    //   if (this.allTasks[deskName] && this.allTasks[deskName].length > 0) {
    //     this.allTasks[deskName].push(task);
    //   } else {
    //     objTask[deskName] = [task];
    //     this.allTasks = Object.assign(this.allTasks, objTask);
    //   }
    // },
    // changeLoading(bool: boolean) {
    //   this.tasksLoading = bool;
    // },
  },
});
