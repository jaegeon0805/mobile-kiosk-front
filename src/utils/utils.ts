import router from "@/router";

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
  await routerReplace("/sign-in");
}
