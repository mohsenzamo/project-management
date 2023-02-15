import { defineStore } from "pinia";

interface projectObj {
  name: string;
  teammate: [];
}

export const useProjectStore = defineStore("useProjectStore", {
  state: () => ({
    allProjects: {} as any,
    projectsLoading: false as boolean,
    currentProjects: "" as string,
    selectedDropProjects: {} as object,
  }),
  getters: {
    allProject: (state) => state.allProjects,
    projectLoading: (state) => state.projectsLoading,
    selectedProject: (state) => {
      return (projectId: any) => {
        return state.allProjects[projectId];
      };
    },
    // currentProject: (state) => state.currentProjects,
    // selectedDropProject: (state) => state.selectedDropProjects,
    // projectsDrop: (state) => {
    //   const drops = Object.values(state.allProjects).map((item: any) => {
    //     return { name: item.name, code: item.name };
    //   });
    //   drops.push({ name: "پروژه جدید", code: 0 });
    //   return drops;
    // },
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
    // setCurrentProject(projectId: string) {
    //   this.currentProjects = projectId;
    // },
    // setSelectedDropProject(project: object) {
    //   this.selectedDropProjects = project;
    // },
    changeLoading(bool: boolean) {
      this.projectsLoading = bool;
    },
  },
});
