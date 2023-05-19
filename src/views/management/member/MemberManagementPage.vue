<template>
  <div>
    <PageTitle title="유저 관리" button-icon="mdi-refresh" @click="fetchList" />
    <v-card-text class="pt-0">
      <MemberFilter v-model="filter" />
      <v-data-table
        must-sort
        :headers="headers"
        :items="items"
        :options.sync="pagination"
        :loading="loading"
      >
        <template #[`item.createdAt`]="{ item }">
          <span>{{ formatDateTime(item.createdAt) }}</span>
        </template>
        <template #[`item.availableFlag`]="{ item }">
          <div class="d-flex justify-center">
            <v-switch
              :input-value="item.availableFlag"
              inset
              dense
              readonly
              @click="changeAvailableFlag(item.id, !item.availableFlag)"
            />
          </div>
        </template>
        <template #[`item.name`]="{ item }">
          <span class="text-ellipsis">{{ item.name }}</span>
        </template>
        <template #[`item.email`]="{ item }">
          <span class="text-ellipsis">{{ item.email }}</span>
        </template>
        <template #[`item.stores`]="{ item }">
          <v-icon v-if="item.stores.length > 0" @click="openSheet(item.stores)">
            mdi-format-list-checkbox
          </v-icon>
        </template>
        <template #[`item.action`]="{ item }">
          <v-btn x-small outlined color="error" @click="resetPassword(item)"
            >비밀번호 초기화</v-btn
          >
        </template>
      </v-data-table>
    </v-card-text>

    <StoreListSheet
      v-if="optionSheet"
      :sheet.sync="optionSheet"
      :value="viewItems"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { MemberForAdmin, Store } from "@/definitions/entities";
import { useDataTable } from "@/compositions/useDataTable";
import { getApi, patchApi } from "@/utils/apis";
import { computed, ref } from "vue";
import { stringify } from "qs";
import { PageResponse } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { formatDateTime } from "@/utils/formatter";
import { useConfirmStore } from "@/stores/confirm";
import StoreListSheet from "@/views/management/member/StoreListSheet.vue";
import MemberFilter from "@/views/management/member/MemberFilter.vue";
import { MemberFilters } from "@/definitions/filters";
import { defaultMemberFilter } from "@/definitions/defaults";

const { confirm } = useConfirmStore();

const optionSheet = ref(false);
const viewItems = ref<Store[]>([]);
const filter = ref<MemberFilters>(defaultMemberFilter());

const { pagination, totalItems, items, loading, changeAvailableFlag } =
  useDataTable<MemberForAdmin>("members", {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["createdAt"],
    sortDesc: [true],
  });

const headers: DataTableHeader[] = [
  {
    text: "회원 가입일",
    align: "start",
    value: "createdAt",
    width: "11rem",
  },
  {
    text: "닉네임",
    align: "start",
    value: "name",
    width: "10rem",
  },
  {
    text: "이메일",
    align: "start",
    value: "email",
  },
  {
    text: "매장 목록",
    align: "center",
    value: "stores",
    width: "8rem",
    sortable: false,
  },
  {
    text: "활성 / 비활성",
    align: "center",
    value: "availableFlag",
    width: "8rem",
  },
  {
    text: "",
    align: "center",
    value: "action",
    width: "5rem",
    sortable: false,
  },
];

function openSheet(items: Store[]) {
  viewItems.value = items;
  optionSheet.value = true;
}

async function resetPassword(member: MemberForAdmin) {
  confirm(
    "비밀번호를 초기화하겠습니까?\n(000000으로 초기화됩니다.)",
    async () => {
      const response = await patchApi<MemberForAdmin>(
        `members/${member.id}/reset-password`,
        null
      );

      if (response.success) {
        items.value = items.value.map((item) => {
          if (item.id === member.id) {
            return response.result;
          } else {
            return item;
          }
        });
      }
    }
  );
}

async function fetchList(): Promise<void> {
  items.value = [];
  totalItems.value = 0;

  loading.value = true;
  const response = await getApi<PageResponse<MemberForAdmin>>(
    `members?${queryString.value}`
  );
  loading.value = false;

  if (response.success) {
    items.value = response.result?.content ?? [];
    totalItems.value = response.result?.totalElements ?? 0;
  }
}

const queryString = computed(() =>
  stringify(
    { ...pagination.value, ...filter.value },
    { arrayFormat: "comma", skipNulls: true }
  )
);

watchDebounced(
  () => [queryString.value],
  async () => await fetchList(),
  {
    debounce: 300,
  }
);
</script>
