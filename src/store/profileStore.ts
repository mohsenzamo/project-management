import { defineStore } from "pinia";
import axios from "axios";

export const useProfileStore = defineStore("useProfileStore", {
  state: () => ({
    profile: {} as any,
    loading: false as boolean,
  }),
  getters: {
    userProfile: (state) => state.profile,
    profileLoading: (state) => state.loading,
  },
  actions: {
    fetchProfile() {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_BASE_API_URL + "/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then(async (res) => {
            this.profile = Object.assign({}, res.data);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    register(
      userNameR: string,
      passwordR: string,
      chosechar: string,
      firstNameR: string,
      lastNameR: string,
      ageR: number,
      phoneR: string,
      emailR: string
    ) {
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_BASE_API_URL + "/register", {
            username: userNameR,
            password: passwordR,
            position: chosechar,
            fname: firstNameR,
            lname: lastNameR,
            age: ageR,
            phone: phoneR,
            email: emailR,
          })
          .then((res: any) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    login(userNameL: string, passwordL: string) {
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_BASE_API_URL + "/login", {
            username: userNameL,
            password: passwordL,
          })
          .then((response) => {
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    changeProfile(changeableProfile: any) {
      let config = {};
      if (changeableProfile.username === this.profile.username) {
        config = {
          method: "patch",
          url: process.env.VUE_APP_BASE_API_URL + "/profile",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          data: {
            fname: changeableProfile.fname,
            lname: changeableProfile.lname,
            age: changeableProfile.age,
          },
        };
      } else {
        config = {
          method: "patch",
          url: process.env.VUE_APP_BASE_API_URL + "/profile",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          data: {
            fname: changeableProfile.fname,
            lname: changeableProfile.lname,
            age: changeableProfile.age,
            username: changeableProfile.username,
          },
        };
      }
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
      this.loading = bool;
    },
  },
});
