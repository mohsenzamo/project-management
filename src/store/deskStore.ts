import { defineStore } from "pinia";

interface deskObj {
  name: string;
}

export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    allDesks: {} as object,
    currentDesks: "" as string,
    selectedDropDesks: {} as object,
    desksLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    deskLoading: (state) => state.desksLoading,
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
        return Object.values(state.allDesks).find(
          (item) => item.name == deskId
        );
      };
    },
  },
  actions: {
    increment(deskItem: object) {
      this.allDesks = Object.assign(this.allDesks, deskItem);
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
  },
});
