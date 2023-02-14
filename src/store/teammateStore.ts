import { defineStore } from "pinia";

interface teammateObj {
  fullName: string;
  number: number;
}

export const useTeammateStore = defineStore("useTeammateStore", {
  state: () => ({
    allTeammates: {} as any,
  }),
  getters: {
    allTeammate: (state) => state.allTeammates,
    selectedTeammate: (state) => {
      return (teammateId: any) => {
        return state.allTeammates[teammateId];
      };
    },
  },
  actions: {
    addTeammate(deskName: string, teammates: [teammateObj]) {
      const objTeammate: any = {};

      if (
        teammates[teammates.length - 1] &&
        teammates[teammates.length - 1].fullName.length === 0
      ) {
        teammates.pop();
      }

      objTeammate[deskName] = teammates;

      this.allTeammates = Object.assign(this.allTeammates, objTeammate);
    },
  },
});
