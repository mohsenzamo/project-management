import { defineStore } from "pinia";
import axios from "axios";

export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    allDesks: {} as any,
    currentDesks: {} as any,

    selectedDropDesks: {} as object,
    currentProjects: "" as string,
    currentTasks: "" as string,
    desksLoading: false as boolean,
    tasksLoading: false as boolean,
    teammatesLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    currentDesk: (state) => state.currentDesks,
    deskLoading: (state) => state.desksLoading,

    taskLoading: (state) => state.tasksLoading,
    teammateLoading: (state) => state.teammatesLoading,
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
    fetchDesks() {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/workdesks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then(async (res) => {
            await res.data.data.forEach((desk: any) => {
              const objDesk: any = {};
              objDesk[desk._id] = desk;
              this.allDesks = Object.assign(this.allDesks, objDesk);
            });
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createDesk(deskName: string) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/workdesks",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: deskName,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deskStatus(desk: any) {
      const config = {
        method: "patch",
        url: process.env.VUE_APP_BASE_API_URL + "/workdesks/one/" + desk._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          isActive: desk.isActive,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    editDesk(editDesk: any) {
      const config = {
        method: "patch",
        url:
          process.env.VUE_APP_BASE_API_URL + "/workdesks/one/" + editDesk._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: editDesk.title,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
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
    setCurrentDesk(desk: object) {
      this.currentDesks = desk;
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
