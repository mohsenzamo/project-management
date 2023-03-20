import { defineStore } from "pinia";
import axios from "axios";

export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    allDesks: {} as any,
    currentDesks: {} as any,
    desksLoading: false as boolean,
  }),
  getters: {
    allDesk: (state) => state.allDesks,
    currentDesk: (state) => state.currentDesks,
    deskLoading: (state) => state.desksLoading,
  },
  actions: {
    fetchDesks() {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/workdesks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then(async (res) => {
            await res.data.data.forEach((desk: any) => {
              const objDesk: any = {};
              objDesk[desk._id] = desk;
              this.allDesks = Object.assign(this.allDesks, objDesk);
            });
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createDesk(deskName: string) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/workdesks",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: deskName,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deskStatus(desk: any) {
      const config = {
        method: "patch",
        url: process.env.VUE_APP_BASE_API_URL + "/workdesks/one/" + desk._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          isActive: desk.isActive,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    editDesk(editDesk: any) {
      const config = {
        method: "patch",
        url:
          process.env.VUE_APP_BASE_API_URL + "/workdesks/one/" + editDesk._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: editDesk.title,
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    increasePoint(username: string, point: number, reason: string) {
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
    setCurrentDesk(deskId: string) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/workdesks/one/" + deskId, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((resdesk) => {
            this.currentDesks = resdesk.data[0];
            resolve(resdesk);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    addTeammate(deskId: string, teammateUsername: string) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/teammates/workdesk/" + deskId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          username: teammateUsername,
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
      this.desksLoading = bool;
    },
  },
});
