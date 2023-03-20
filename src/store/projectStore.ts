import { defineStore } from "pinia";
import axios from "axios";

export const useProjectStore = defineStore("useProjectStore", {
  state: () => ({
    currentProjects: {} as any,
    projectsLoading: false as boolean,
  }),
  getters: {
    currentProject: (state) => state.currentProjects,
    projectLoading: (state) => state.projectsLoading,
  },
  actions: {
    setCurrentProject(id: any) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/projects/one/" + id, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((res) => {
            this.currentProjects = Object.assign({}, res.data[0]);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    addProject(deskId: string, projectName: string) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/projects/" + deskId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: projectName,
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
    removeTeammate(projectId: string, username: string) {
      const config = {
        method: "delete",
        url:
          process.env.VUE_APP_BASE_API_URL + "/teammates/project/" + projectId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          username: username,
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
    editProject(editProjectValue: any) {
      const config = {
        method: "patch",
        url:
          process.env.VUE_APP_BASE_API_URL +
          "/projects/one/" +
          editProjectValue._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: editProjectValue.title,
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
    changeProjectStatus(projectId: string, status: boolean) {
      const config = {
        method: "patch",
        url: process.env.VUE_APP_BASE_API_URL + "/projects/status/" + projectId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          isActive: status,
          permision: !status,
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
    increasePoint(username: string, point: number, reason: string) {
      console.log(reason, 3);
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/points",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          username: username,
          point: point,
          reason: reason,
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
    addTeammates(projectId: any, teammates: any) {
      return new Promise((resolve, reject) => {
        teammates.forEach(async (teammate: any) => {
          const config = {
            method: "post",
            url:
              process.env.VUE_APP_BASE_API_URL +
              "/teammates/project/" +
              projectId,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            data: {
              username: teammate.username,
            },
          };
          const result = await axios(config);
        });
        resolve("success");
      });
    },
    changeLoading(bool: boolean) {
      this.projectsLoading = bool;
    },
  },
});
