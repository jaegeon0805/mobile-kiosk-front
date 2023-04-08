import router from "@/router";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";
import { ApiResponse, getApi, postApi } from "@/utils/apis";
import axios from "axios";
import envs from "@/constants/envs";
import { PageResponse, Token } from "@/definitions/types";
import { defaultMember, defaultPagination } from "@/definitions/defaults";
import { Member, Store } from "@/definitions/entities";
import { useStoreStore } from "@/stores/store";
import { stringify } from "qs";

const { memberClear, isTokenExpired, reissueToken } = useMemberStore(store);
const { storeClear } = useStoreStore(store);

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
    memberClear();
    storeClear();
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

export async function reissue(): Promise<Token> {
  const refreshToken = window.localStorage.getItem("refreshToken");

  const response = await axios
    .create({
      baseURL: envs.API_HOST,
      headers: {
        contentType: "application/json",
        refreshToken: refreshToken,
      },
    })
    .get<ApiResponse<Token>>("/api/v1/reissue-token");

  return response.data.result;
}

export async function signOut(): Promise<void> {
  await postApi("sign-out", null);
  await routeSignInPage();
}

export async function getMyProfile(): Promise<Member> {
  const response = await getApi<Member>("my-profile");

  if (response.success) {
    return response.result;
  }
  return defaultMember();
}

export async function getStoreList(
  memberId: number | undefined
): Promise<Store[]> {
  if (!memberId) {
    return [];
  }

  const queryString = stringify(defaultPagination(), { arrayFormat: "comma" });

  const response = await getApi<PageResponse<Store>>(
    `members/${memberId}/stores?${queryString}`
  );
  if (response.success && response.result) {
    return response.result.content || [];
  }
  return [];
}
