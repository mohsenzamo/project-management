import { defineStore } from "pinia";

interface deskObj {
  name: string;
  teammates:
    | [
        {
          fullName: string;
          phoneNumber: number;
        }
      ]
    | null;
}

export const useStore = defineStore("counter", {
  state: () => ({
    allDesks: {} as object,
    currentDesks: "" as string,
    selectedDropDesks: {} as object,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
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
  },
});
