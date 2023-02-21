import { defineStore } from "pinia";

interface deskObj {
  name: string;
}

export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    allDesks: {} as any,
    currentDesks: "" as string,
    selectedDropDesks: {} as object,
    currentProjects: "" as string,
    currentTasks: "" as string,
    desksLoading: false as boolean,
    tasksLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    deskLoading: (state) => state.desksLoading,
    taskLoading: (state) => state.tasksLoading,
    currentDesk: (state) => state.currentDesks,
    currentTask: (state) => state.currentTasks,
    selectedDropDesk: (state) => state.selectedDropDesks,
    currentProject: (state) => state.currentProjects,
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
        deskId: deskId,
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
      responsible: string,
      taskPoint: number
    ) {
      const objTask: any = {};
      objTask[taskName] = {
        name: taskName,
        description: taskDescription,
        responsible: responsible,
        isDone: false,
        projectId: projectId,
        deskId: deskId,
        point: taskPoint,
      };
      this.allDesks[deskId].projects[projectId].tasks = Object.assign(
        this.allDesks[deskId].projects[projectId].tasks,
        objTask
      );
    },
    setCurrentDesk(deskId: string) {
      this.currentDesks = deskId;
    },
    setCurrentProject(project: any) {
      this.currentProjects = project;
    },
    setCurrentTask(task: any) {
      this.currentTasks = task;
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