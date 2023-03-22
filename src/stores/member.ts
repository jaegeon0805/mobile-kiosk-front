import { defineStore } from "pinia";
import { Token } from "@/definitions/types";
import jwtDecode from "jwt-decode";
import axios from "axios";
import envs from "@/constants/envs";
import { ApiResponse } from "@/utils/apis";
import router from "@/router";

export const useMemberStore = defineStore("member", {
  state: () => ({
    uuid: "",
  }),
  getters: {
    isSignedIn(): boolean {
      return (
        !!this.uuid &&
        !!window.localStorage.getItem("accessToken") &&
        !!window.localStorage.getItem("refreshToken")
      );
    },
  },
  actions: {
    saveToken(tokens: Token): void {
      this.uuid = jwtDecode<{ sub: string }>(tokens.accessToken).sub;
      window.localStorage.setItem("accessToken", tokens.accessToken);
      window.localStorage.setItem("refreshToken", tokens.refreshToken);
    },
    async reissueToken(): Promise<Token | null> {
      const refreshToken = window.localStorage.getItem("refreshToken");
      if (this.isTokenExpired(refreshToken)) {
        this.clear();
        await router.push("sign-in");
        return null;
      }

      const response = await axios
        .create({
          baseURL: envs.API_HOST,
          headers: {
            contentType: "application/json",
            refreshToken: refreshToken,
          },
        })
        .get<ApiResponse<Token>>("/api/v1/reissue-token");
      this.saveToken(response.data.result);
      return response.data.result;
    },
    isTokenExpired(token): boolean {
      try {
        const exp = jwtDecode<{ exp: number }>(token).exp;
        const currentTime = Date.now() / 1000;

        return !!(exp && exp < currentTime);
      } catch {
        return true;
      }
    },
    clear() {
      this.$reset();
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    },
  },
  persist: true,
});
