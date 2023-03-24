import router from "@/router";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";
import { postApi } from "@/utils/apis";

const { clear, isTokenExpired, reissueToken } = useMemberStore(store);

// 히스토리에 남지 않음, 뒤로가기로 돌아갈 수 없음
export async function routerReplace(path: string): Promise<void> {
  if (router.currentRoute.path !== path) {
    await router.replace(path);
  }
}

// 히스토리에 남음, 뒤로가기로 돌아갈 수 있음
export async function routerPush(path: string): Promise<void> {
  if (router.currentRoute.path !== path) {
    await router.push(path);
  }
}

export async function routeSignInPage(): Promise<void> {
  if (!["/sign-in", "/sign-up"].includes(router.currentRoute.path)) {
    clear();
    await routerReplace("/sign-in");
  }
}

export async function getAccessToken(): Promise<string> {
  let accessToken = window.localStorage.getItem("accessToken");
  if (!accessToken) {
    await routeSignInPage();
    return "";
  }

  if (isTokenExpired(accessToken)) {
    await reissueToken();
    accessToken = window.localStorage.getItem("accessToken");
  }

  return accessToken || "";
}

export async function signOut(): Promise<void> {
  await postApi("sign-out", null);
  await routeSignInPage();
}
