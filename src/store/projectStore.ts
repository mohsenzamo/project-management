import { defineStore } from "pinia";

interface projectObj {
  name: string;
  teammate: [];
}

export const useProjectStore = defineStore("useProjectStore", {
  state: () => ({
    allProjects: {} as any,
  }),
  getters: {
    allProject: (state) => state.allProjects,
    selectedProject: (state) => {
      return (projectId: any) => {
        return state.allProjects[projectId];
      };
    },
  },
  actions: {
    addProject(deskName: string, project: object) {
      const objProject: any = {};

      if (this.allProjects[deskName] && this.allProjects[deskName].length > 0) {
        this.allProjects[deskName].push(project);
      } else {
        objProject[deskName] = [project];
        this.allProjects = Object.assign(this.allProjects, objProject);
      }
    },
  },
});
