import { defineStore } from "pinia";
import { useProjectStore } from "./projectStore";
import axios from "axios";
const projectStore = useProjectStore();

export const useTaskStore = defineStore("useTaskStore", {
  state: () => ({
    currentTasks: {} as any,
    tasksLoading: false as boolean,
  }),
  getters: {
    currentTask: (state) => state.currentTasks,
    taskLoading: (state) => state.tasksLoading,
  },
  actions: {
    setCurrentTask(id: any) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/tasks/one/" + id, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((res) => {
            this.currentTasks = Object.assign({}, res.data);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setTask(
      projectId: any,
      taskName: string,
      taskDescription: any,
      selectedDropTeammate: any,
      selectedPoint: number,
      selectedDropDeadlinePeriod: any,
      selectedUnit: number,
      selectedTask: any
    ) {
      const config: any = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/tasks/" + projectId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: taskName,
          description: taskDescription,
          deadline_unit: selectedDropDeadlinePeriod,
          deadline_n: selectedUnit,
          responsible: selectedDropTeammate,
          point: selectedPoint,
          dependentTaskId: selectedTask,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            projectStore.setCurrentProject(projectId).then(() => {
              resolve(response);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    editTask(
      projectId: any,
      task: any,
      responsible: any,
      deadlinePeriod: any,
      selectedTask: any
    ) {
      const config: any = {
        method: "patch",
        url: process.env.VUE_APP_BASE_API_URL + "/tasks/one/" + task._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: task.title,
          description: task.description,
          deadline: {
            unit: deadlinePeriod,
            n: task.deadline.n,
          },
          responsible: responsible,
          point: task.point,
        },
      };
      if (selectedTask !== 0) {
        config.data.dependentTaskId = selectedTask;
      }
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            projectStore.setCurrentProject(projectId).then(() => {
              resolve(response);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    attachFile(taskId: string, file: any) {
      const config = {
        method: "post",
        url:
          process.env.VUE_APP_BASE_API_URL_UPLOAD + "/uploads/task/" + taskId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
        data: {
          file: file,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteTask(projectId: any, task: any) {
      const config = {
        method: "delete",
        url: process.env.VUE_APP_BASE_API_URL + "/tasks/one/" + task._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            projectStore.setCurrentProject(projectId).then(() => {
              resolve(response);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    changeStatus(taskId: any, status: string) {
      let config = {};
      if (status === "pending") {
        config = {
          method: "post",
          url: process.env.VUE_APP_BASE_API_URL + "/tasks/one/" + taskId,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        };
      } else {
        config = {
          method: "post",
          url: process.env.VUE_APP_BASE_API_URL + "/tasks/status/" + taskId,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          data: {
            status: status,
          },
        };
      }
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    addComment(taskId: string, type: string, comment: string) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/comments/" + taskId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: type,
          description: comment,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    changeLoading(bool: boolean) {
      this.tasksLoading = bool;
    },
  },
});
