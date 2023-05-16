<template>
  <div>
    <PageTitle title="주문 관리" />
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
          <span
            :class="
              item.orderState === ORDER_STATE.PAYMENT
                ? 'primary--text font-weight-black'
                : ''
            "
          >
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
import { getApi } from "@/utils/apis";
import { computed, ref } from "vue";
import { stringify } from "qs";
import { OrderItem, PageResponse } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { ORDER_STATE, OrderStates, OrderTypes } from "@/definitions/enums";
import { getTypeName, toPriceText } from "@/utils/commands";
import { formatDateTime } from "@/utils/formatter";
import OrderDetailSheet from "@/views/management/order/OrderDetailSheet.vue";
import OrderFilter from "@/views/management/order/OrderFilter.vue";
import { OrderFilters } from "@/definitions/filters";
import { defaultOrderFilter } from "@/definitions/defaults";
import { useNotificationStore } from "@/stores/notification";

const { selectedStore } = storeToRefs(useStoreStore());
const { readNotifications } = useNotificationStore();

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
    width: "10rem",
    sortable: false,
  },
  {
    text: "동작",
    align: "start",
    value: "center",
    width: "5rem",
    sortable: false,
  },
];

function openSheet(value: OrderItem[]) {
  viewItems.value = value;
  optionSheet.value = true;
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
