import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";

Vue.use(VueRouter);

const routes = (): RouteConfig[] => {
    const error: RouteConfig[] = [
        {
            path: "/error/404",
            component: () => import("@/views/error/NotFoundPage.vue"),
            meta: {
                layout: "error",
            },
        }
    ];

    return [
        ...error,
        {
            path: "*",
            redirect: "/error/404",
        }
    ];
}
export default new VueRouter({
    mode: "history",
    routes: routes(),
});