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
    teammatesLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    deskLoading: (state) => state.desksLoading,
    taskLoading: (state) => state.tasksLoading,
    teammateLoading: (state) => state.teammatesLoading,
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
        active: true,
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
      taskPoint: number,
      deadlinePeriod: string,
      deadlineUnit: number
    ) {
      const objTask: any = {};

      let deadlineToSecond = 0;
      if (deadlinePeriod === "ساعت") {
        deadlineToSecond = deadlineUnit * 60 * 60;
      } else if (deadlinePeriod === "روز") {
        deadlineToSecond = deadlineUnit * 60 * 60 * 24;
      } else if (deadlinePeriod === "هفته") {
        deadlineToSecond = deadlineUnit * 60 * 60 * 24 * 7;
      }

      objTask[taskName] = {
        name: taskName,
        description: taskDescription,
        responsible: responsible,
        isDone: false,
        projectId: projectId,
        deskId: deskId,
        point: taskPoint,
        deadline: {
          period: deadlinePeriod,
          unit: deadlineUnit,
          second: deadlineToSecond,
        },
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
    changeTeammateLoading(bool: boolean) {
      this.teammatesLoading = bool;
    },
    editDesk(deskItem: any, deskBefore: string) {
      if (deskItem.name !== deskBefore) {
        Object.values(deskItem.projects).forEach((project: any) => {
          project.deskId = deskItem.name;
          Object.values(project.tasks).forEach((task: any) => {
            task.deskId = deskItem.name;
          });
        });
        const objDesk: any = {};
        objDesk[deskItem.name] = deskItem;
        this.allDesks = Object.assign(this.allDesks, objDesk);
        delete this.allDesks[deskBefore];
      } else {
        this.allDesks[deskItem.name] = Object.assign(
          this.allDesks[deskItem.name],
          deskItem
        );
      }
    },
    editProject(projectItem: any, projectBefore: string) {
      if (projectItem.name !== projectBefore) {
        Object.values(projectItem.tasks).forEach((task: any) => {
          task.projectId = projectItem.name;
        });
        const objProject: any = {};
        objProject[projectItem.name] = projectItem;
        this.allDesks[projectItem.deskId].projects = Object.assign(
          this.allDesks[projectItem.deskId].projects,
          objProject
        );
        delete this.allDesks[projectItem.deskId].projects[projectBefore];
      } else {
        this.allDesks[projectItem.deskId].projects[projectBefore] =
          Object.assign(
            this.allDesks[projectItem.deskId].projects[projectBefore],
            projectItem
          );
      }
    },
    deleteTask(taskItem: any) {
      delete this.allDesks[taskItem.deskId].projects[taskItem.projectId].tasks[
        taskItem.name
      ];
    },
  },
});
