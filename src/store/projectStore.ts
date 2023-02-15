import { defineStore } from "pinia";

interface projectObj {
  name: string;
  teammate: [];
}

export const useProjectStore = defineStore("useProjectStore", {
  state: () => ({
    allProjects: {} as any,
    projectsLoading: false as boolean,
  }),
  getters: {
    allProject: (state) => state.allProjects,
    projectLoading: (state) => state.projectsLoading,
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
    changeLoading(bool: boolean) {
      this.projectsLoading = bool;
    },
  },
});
