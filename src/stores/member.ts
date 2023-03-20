import { defineStore } from "pinia";
import { Token } from "@/definitions/types";
import jwtDecode from "jwt-decode";

export const useMemberStore = defineStore("member", {
  state: () => ({
    id: 0,
    name: "",
  }),
  getters: {
    isSignedIn(state): boolean {
      return (
        !!state.id &&
        !!window.localStorage.getItem("accessToken") &&
        !!window.localStorage.getItem("refreshToken")
      );
    },
  },
  actions: {
    saveToken(tokens: Token) {
      const decodeToken = jwtDecode<{
        id: number;
      }>(tokens.accessToken);

      this.$state.id = decodeToken.id;
      window.localStorage.setItem("accessToken", tokens.accessToken);
      window.localStorage.setItem("refreshToken", tokens.refreshToken);
    },
  },
  persist: true,
});
