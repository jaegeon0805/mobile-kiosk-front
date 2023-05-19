<template>
  <div>
    <PageTitle title="주문 관리" button-icon="mdi-refresh" @click="fetchList" />
    <v-card-text class="pt-0">
      <OrderFilter v-model="filter" />
      <v-data-table
        must-sort
        :headers="headers"
        :items="items"
        :options.sync="pagination"
        :loading="loading"
      >
        <template #[`item.approveAt`]="{ item }">
          <span>{{ formatDateTime(item.approveAt) }}</span>
        </template>
        <template #[`item.orderState`]="{ item }">
          <span :class="getOrderStateClass(item.orderState)">
            {{ getTypeName(OrderStates, item.orderState) }}
          </span>
        </template>
        <template #[`item.orderType`]="{ item }">
          <span>{{ getTypeName(OrderTypes, item.orderType) }}</span>
        </template>
        <template #[`item.name`]="{ item }">
          <span class="text-ellipsis">{{ item.name }}</span>
        </template>
        <template #[`item.quantity`]="{ item }">
          <span>{{ item.quantity }}개</span>
        </template>
        <template #[`item.totalPrice`]="{ item }">
          <span>{{ toPriceText(item.totalPrice) }}</span>
        </template>
        <template #[`item.detail`]="{ item }">
          <v-icon @click="openSheet(item.detail)">mdi-magnify-expand</v-icon>
        </template>
        <template #[`item.action`]="{ item }">
          <v-btn
            v-if="item.orderState === ORDER_STATE.PAYMENT"
            outlined
            small
            class="primary--text font-weight-black"
            @click="complete(item)"
          >
            완료하기
          </v-btn>
          <v-btn
            v-else-if="item.orderState === ORDER_STATE.COMPLETE"
            outlined
            small
            class="error--text font-weight-black"
            @click="refund(item)"
          >
            환불하기
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <OrderDetailSheet
      v-if="optionSheet"
      v-model="viewItems"
      :sheet.sync="optionSheet"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { Order } from "@/definitions/entities";
import { useDataTable } from "@/compositions/useDataTable";
import { getApi, patchApi } from "@/utils/apis";
import { computed, ref } from "vue";
import { stringify } from "qs";
import { OrderItem, PageResponse } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { ORDER_STATE, OrderStates, OrderTypes } from "@/definitions/enums";
import { getOrderStateClass, getTypeName, toPriceText } from "@/utils/commands";
import { formatDateTime } from "@/utils/formatter";
import OrderDetailSheet from "@/views/management/order/OrderDetailSheet.vue";
import OrderFilter from "@/views/management/order/OrderFilter.vue";
import { OrderFilters } from "@/definitions/filters";
import { defaultOrderFilter } from "@/definitions/defaults";
import { useNotificationStore } from "@/stores/notification";
import { useConfirmStore } from "@/stores/confirm";

const { selectedStore } = storeToRefs(useStoreStore());
const { readNotifications } = useNotificationStore();
const { confirm } = useConfirmStore();

const { pagination, totalItems, items, loading } = useDataTable<Order>(
  "orders",
  {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["approveAt"],
    sortDesc: [true],
  }
);

const optionSheet = ref(false);
const viewItems = ref<OrderItem[]>([]);
const filter = ref<OrderFilters>(defaultOrderFilter());

const headers: DataTableHeader[] = [
  {
    text: "주문 시간",
    align: "start",
    value: "approveAt",
    width: "11rem",
  },
  {
    text: "주문 상태",
    align: "start",
    value: "orderState",
    width: "6rem",
  },
  {
    text: "주문 타입",
    align: "start",
    value: "orderType",
    width: "6rem",
  },
  {
    text: "결제 금액",
    align: "start",
    value: "totalPrice",
    width: "8rem",
  },
  {
    text: "주문명",
    align: "start",
    value: "title",
    sortable: false,
  },
  {
    text: "상세정보",
    align: "center",
    value: "detail",
    width: "5rem",
    sortable: false,
  },
  {
    text: "",
    align: "center",
    value: "action",
    width: "5rem",
    sortable: false,
  },
];

function openSheet(items: OrderItem[]) {
  viewItems.value = items;
  optionSheet.value = true;
}

async function complete(order: Order) {
  confirm("완료 처리하시겠습니까?", async () => {
    const response = await patchApi<Order>(
      `orders/${order.id}/complete?storeId=${selectedStore.value.id}`,
      null
    );

    if (response.success) {
      items.value = items.value.map((oldItem) => {
        if (oldItem.id === response.result.id) {
          return response.result;
        }
        return oldItem;
      });
    }
  });
}

async function refund(order: Order) {
  confirm("환불 처리하시겠습니까?", async () => {
    const response = await patchApi<Order>(
      `orders/${order.id}/refund?storeId=${selectedStore.value.id}`,
      null
    );

    if (response.success) {
      items.value = items.value.map((oldItem) => {
        if (oldItem.id === response.result.id) {
          return response.result;
        }
        return oldItem;
      });
    }
  });
}

async function fetchList(): Promise<void> {
  items.value = [];
  totalItems.value = 0;

  loading.value = true;
  const response = await getApi<PageResponse<Order>>(
    `orders?storeId=${selectedStore.value.id}&${queryString.value}`
  );
  loading.value = false;

  if (response.success) {
    items.value = response.result?.content ?? [];
    totalItems.value = response.result?.totalElements ?? 0;

    if (selectedStore.value.id) {
      await readNotifications(selectedStore.value.id);
    }
  }
}

const queryString = computed(() =>
  stringify(
    { ...pagination.value, ...filter.value },
    { arrayFormat: "comma", skipNulls: true }
  )
);

watchDebounced(
  () => [selectedStore.value, queryString.value],
  async () => await fetchList(),
  {
    debounce: 300,
  }
);
</script>
