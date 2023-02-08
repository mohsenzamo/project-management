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
    desk: {} as object,
  }),
  getters: {
    allDesk: (state) => state.desk,
  },
  actions: {
    increment(deskItem: any) {
      this.desk = Object.assign(this.desk, deskItem);
    },
  },
});
