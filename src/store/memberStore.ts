import { defineStore } from "pinia";
import axios from "axios";

export const useMemberStore = defineStore("useMemberStore", {
  state: () => ({
    allMembers: {} as any,
    membersLoading: false as boolean,
  }),
  getters: {
    allMember: (state) => state.allMembers,
    memberLoading: (state) => state.membersLoading,
  },
  actions: {
    fetchMembers() {
      const config = {
        method: "get",
        url: process.env.VUE_APP_BASE_API_URL + "/members/all",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            this.allMembers = Object.assign({}, response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getMemberOne(username: any) {
      const config = {
        method: "get",
        url: process.env.VUE_APP_BASE_API_URL + "/members/one/" + username,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
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
      this.membersLoading = bool;
    },
  },
});
