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
          .then(async (res) => {
            console.log(res.data[0], 98);
            this.currentProjects = Object.assign({}, res.data[0]);
            resolve(res);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    addTeammates(projectId: any, teammates: any) {
      return new Promise((resolve, reject) => {
         teammates.forEach(async (teammate:any) => {
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
        resolve('success');
      });
    },
    changeLoading(bool: boolean) {
      this.projectsLoading = bool;
    },
  },
});
