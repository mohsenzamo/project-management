import { defineStore } from "pinia";
import axios from "axios";

export const useSuggestionStore = defineStore("useSuggestionStore", {
  state: () => ({
    suggestionsLoading: false as boolean,
  }),
  getters: {
    suggestionLoading: (state) => state.suggestionsLoading,
  },
  actions: {
    postSuggestion(
      projectId: any,
      suggestionName: string,
      suggestionDescription: any,
      selectedDropTeammate: any,
      selectedPoint: number,
      selectedDropDeadlinePeriod: any,
      selectedUnit: number
    ) {
      const config = {
        method: "post",
        url: process.env.VUE_APP_BASE_API_URL + "/suggestions/" + projectId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
        data: {
          title: suggestionName,
          description: suggestionDescription,
          deadline_unit: selectedDropDeadlinePeriod,
          deadline_n: selectedUnit,
          responsible: selectedDropTeammate,
          point: selectedPoint,
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
    setSuggestionToTask(suggestionId: string) {
      const config = {
        method: "post",
        url:
          process.env.VUE_APP_BASE_API_URL +
          "/suggestions/upgrade/" +
          suggestionId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
        data: {
          suggestionId: suggestionId,
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
    editSuggestion(suggestion: any, responsible: any, deadlinePeriod: any) {
      const config = {
        method: "patch",
        url:
          process.env.VUE_APP_BASE_API_URL + "/suggestions/" + suggestion._id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          title: suggestion.title,
          description: suggestion.description,
          deadline_unit: deadlinePeriod,
          deadline_n: suggestion.deadline.n,
          responsible: responsible,
          point: suggestion.point,
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
    deleteSuggestion(suggestion: any) {
      const config = {
        method: "delete",
        url:
          process.env.VUE_APP_BASE_API_URL + "/suggestions/" + suggestion._id,
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
    attachFile(suggestionId: string, file: any) {
      const config = {
        method: "post",
        url:
          process.env.VUE_APP_BASE_API_URL_UPLOAD +
          "/uploads/suggestion/" +
          suggestionId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
        data: {
          file: file,
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
      this.suggestionsLoading = bool;
    },
  },
});
