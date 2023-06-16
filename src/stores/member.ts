import { defineStore } from "pinia";
import { Token } from "@/definitions/types";
import jwtDecode from "jwt-decode";
import { getMyProfile, reissue, routeSignInPage } from "@/utils/commands";
import { defaultMember } from "@/definitions/defaults";

export const useMemberStore = defineStore("member", {
  state: () => ({
    uuid: "",
    member: defaultMember(),
  }),
  getters: {
    isSignedIn(): boolean {
      return (
        !!this.uuid &&
        !!window.localStorage.getItem("accessToken") &&
        !!window.localStorage.getItem("refreshToken")
      );
    },
    isAdmin(): boolean {
      return this.member.role === "ROLE_ADMIN";
    },
    isLocalMember(): boolean {
      return this.member.providerType === "LOCAL";
    },
  },
  actions: {
    async saveToken(tokens: Token): Promise<void> {
      this.uuid = jwtDecode<{ sub: string }>(tokens.accessToken).sub;
      window.localStorage.setItem("accessToken", tokens.accessToken);
      window.localStorage.setItem("refreshToken", tokens.refreshToken);

      await this.saveMyProfile();
    },
    async reissueToken(): Promise<void> {
      const refreshToken = window.localStorage.getItem("refreshToken");
      if (this.isTokenExpired(refreshToken)) {
        await routeSignInPage();
        return;
      }

      const token = await reissue();
      await this.saveToken(token);
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
    async saveMyProfile(): Promise<void> {
      this.$state.member = await getMyProfile();
    },
    memberClear() {
      this.$reset();
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    },
  },
  persist: true,
});
