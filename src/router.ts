import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

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
      component: () => import("@/views/HomePage.vue"),
    },
    ...error,
    {
      path: "*",
      redirect: "/error/404",
    },
  ];
};
export default new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: routes(),
});
