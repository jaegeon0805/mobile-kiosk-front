import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";
import { routeSignInPage } from "@/utils/utils";

Vue.use(VueRouter);

const requiredAuthenticated =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { isSignedIn } = useMemberStore(store);
    if (isSignedIn) {
      return next();
    }
    return routeSignInPage();
  };

const requiredUnauthenticated =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { isSignedIn } = useMemberStore(store);
    if (isSignedIn) {
      return;
    }
    next();
  };

const routes = (): RouteConfig[] => {
  const error: RouteConfig[] = [
    {
      path: "/error/404",
      component: () => import("@/views/error/NotFoundPage.vue"),
    },
  ];

  return [
    {
      path: "/",
      beforeEnter: requiredAuthenticated(),
      component: () => import("@/views/HomePage.vue"),
      meta: {
        requiresAuth: "true",
      },
    },
    {
      path: "/sign-in",
      beforeEnter: requiredUnauthenticated(),
      component: () => import("@/views/sign/SignIn.vue"),
      meta: {
        layout: "auth",
      },
    },
    ...error,
    {
      path: "*",
      redirect: "/error/404",
    },
  ];
};

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: routes(),
});

export default router;
