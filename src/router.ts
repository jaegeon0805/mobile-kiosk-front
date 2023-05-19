import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";
import { routeSignInPage } from "@/utils/commands";
import { useStoreStore } from "@/stores/store";
import { useAlertStore } from "@/stores/alert";
import { storeToRefs } from "pinia";

Vue.use(VueRouter);

const { toastWarning } = useAlertStore(store);

const requiredAuthenticated =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { isSignedIn } = storeToRefs(useMemberStore(store));
    if (isSignedIn.value) {
      return next();
    }
    return routeSignInPage();
  };

const requiredUnauthenticated =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { isSignedIn } = storeToRefs(useMemberStore(store));
    if (isSignedIn.value) {
      return next(from.path ? from.path : "/");
    }
    return next();
  };

const requiredAdminAuthenticated =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { isSignedIn, isAdmin } = storeToRefs(useMemberStore(store));
    if (isSignedIn.value && isAdmin.value) {
      return next();
    }
    return routeSignInPage();
  };

const requiredStore =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const { storeList } = useStoreStore(store);
    if (storeList.length === 0) {
      toastWarning(
        "점포를 먼저 생성하셔야 합니다. 점포 생성 페이지로 이동됩니다."
      );
      return next("/management/store");
    }
    return next();
  };

const requireAuthenticatedAndStore =
  () => async (to: Route, from: Route, next: NavigationGuardNext) => {
    const authGuard = requiredAuthenticated();
    const storeGuard = requiredStore();

    await authGuard(to, from, async () => {
      await storeGuard(to, from, next);
    });
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
      beforeEnter: requireAuthenticatedAndStore(),
      component: () => import("@/views/management/category/CategoryPage.vue"),
    },
    {
      path: "/management/menu",
      beforeEnter: requireAuthenticatedAndStore(),
      component: () => import("@/views/management/menu/MenuPage.vue"),
    },
    {
      path: "/management/order",
      beforeEnter: requireAuthenticatedAndStore(),
      component: () => import("@/views/management/order/OrderPage.vue"),
    },
    {
      path: "/management/member",
      beforeEnter: requiredAdminAuthenticated(),
      component: () =>
        import("@/views/management/member/MemberManagementPage.vue"),
    },
  ];
  const kiosk: RouteConfig[] = [
    {
      path: "/kiosk/:storeId",
      component: () => import("@/views/kiosk/home/KioskHomePage.vue"),
      meta: {
        layout: "kiosk",
      },
    },
    {
      path: "/kiosk/:storeId/menu/:menuId",
      component: () => import("@/views/kiosk/menu/KioskMenuPage.vue"),
      meta: {
        layout: "kiosk",
      },
    },
    {
      path: "/kiosk/:storeId/cart",
      component: () => import("@/views/kiosk/cart/KioskCartPage.vue"),
      meta: {
        layout: "kiosk",
      },
    },
    {
      path: "/kiosk/:storeId/payment",
      component: () => import("@/views/kiosk/payment/PaymentWaitPage.vue"),
      meta: {
        layout: "kiosk",
      },
    },
    {
      path: "/kiosk/:storeId/orders",
      component: () => import("@/views/kiosk/order/KioskOrderPage.vue"),
      meta: {
        layout: "kiosk",
      },
    },
    {
      path: "/kiosk/:storeId/orders/:orderId",
      component: () => import("@/views/kiosk/order/KioskOrderDetailPage.vue"),
      meta: {
        layout: "kiosk",
      },
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
    ...kiosk,
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
