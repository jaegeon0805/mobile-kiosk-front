import { Id } from "@/definitions/entities";
import { Pagination } from "@/definitions/types";
import { reactive, ref, Ref, toRefs } from "vue";
import { patchApi } from "@/utils/apis";

export function useDataTable<T extends Id>(
  url: string,
  pagination: Pagination = {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["id"],
    sortDesc: [true],
  }
) {
  const state = reactive({
    pagination: pagination,
    totalItems: 0,
    loading: false,
    availableFlagLoadingSet: new Set<number>(),
  });

  const items = ref<T[]>([]) as Ref<T[]>;

  const methods = {
    changeAvailableFlag: async (
      id: number | undefined,
      value: boolean
    ): Promise<void> => {
      if (!id || state.availableFlagLoadingSet.has(id)) {
        return;
      }

      state.availableFlagLoadingSet.add(id);
      const response = await patchApi<boolean, T>(
        `${url}/${id}/available-flag`,
        {
          availableFlag: value,
        }
      );
      state.availableFlagLoadingSet.delete(id);

      if (response.success) {
        items.value = items.value.map((item) => {
          if (item.id === id) {
            return response.result;
          } else {
            return item;
          }
        });
      }
    },
  };
  return { ...toRefs(state), items, ...methods };
}
