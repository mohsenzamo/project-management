import { defineStore } from "pinia";

interface deskObj {
  name: string;
}

export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    allDesks: {} as any,
    currentDesks: "" as string,
    selectedDropDesks: {} as object,
    desksLoading: false as boolean,
    tasksLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    deskLoading: (state) => state.desksLoading,
    taskLoading: (state) => state.tasksLoading,
    currentDesk: (state) => state.currentDesks,
    selectedDropDesk: (state) => state.selectedDropDesks,
    desksDrop: (state) => {
      const drops = Object.values(state.allDesks).map((item: any) => {
        return { name: item.name, code: item.name };
      });
      drops.push({ name: "میزکار جدید", code: 0 });
      return drops;
    },
    selectedDesk: (state) => {
      return (deskId: any) => {
        return state.allDesks[deskId];
      };
    },
  },
  actions: {
    increment(deskItem: object) {
      this.allDesks = Object.assign(this.allDesks, deskItem);
    },
    setProject(deskId: string, projectName: string, teammates: object) {
      const objProject: any = {};

      objProject[projectName] = {
        name: projectName,
        tasks: {},
        teammates: teammates,
      };

      this.allDesks[deskId].projects = Object.assign(
        this.allDesks[deskId].projects,
        objProject
      );
    },
    setTask(
      deskId: string,
      projectId: string,
      taskName: string,
      taskDescription: string,
      responsible: string
    ) {
      const objTask: any = {};
      objTask[taskName] = {
        name: taskName,
        description: taskDescription,
        responsible: responsible,
        isDone: false
      };
      this.allDesks[deskId].projects[projectId].tasks = Object.assign(
        this.allDesks[deskId].projects[projectId].tasks,
        objTask
      );
    },
    setCurrentDesk(deskId: string) {
      this.currentDesks = deskId;
    },
    setSelectedDropDesk(desk: object) {
      this.selectedDropDesks = desk;
    },
    changeLoading(bool: boolean) {
      this.desksLoading = bool;
    },
    changeTaskLoading(bool: boolean) {
      this.tasksLoading = bool;
    },
  },
});
