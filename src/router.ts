import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";
import { routeSignInPage } from "@/utils/commands";

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
      return next(from.path ? from.path : "/");
    }
    return next();
  };

const routes = (): RouteConfig[] => {
  const management: RouteConfig[] = [
    {
      path: "/management/store",
      beforeEnter: requiredAuthenticated(),
      component: () => import("@/views/management/store/StorePage.vue"),
    },
    {
      path: "/management/category",
      beforeEnter: requiredAuthenticated(),
      component: () => import("@/views/management/category/CategoryPage.vue"),
    },
  ];
  const error: RouteConfig[] = [
    {
      path: "/error/404",
      component: () => import("@/views/error/NotFoundPage.vue"),
      meta: {
        layout: "error",
      },
    },
  ];
  const sign: RouteConfig[] = [
    {
      path: "/sign-in",
      beforeEnter: requiredUnauthenticated(),
      component: () => import("@/views/sign/SignIn.vue"),
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/sign-up",
      beforeEnter: requiredUnauthenticated(),
      component: () => import("@/views/sign/SignUp.vue"),
      meta: {
        layout: "auth",
      },
    },
  ];

  return [
    {
      path: "/",
      beforeEnter: requiredAuthenticated(),
      component: () => import("@/views/HomePage.vue"),
    },
    ...management,
    ...sign,
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
