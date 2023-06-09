import { Id } from "@/definitions/entities";
import { reactive, ref, Ref, toRefs } from "vue";
import { patchApi } from "@/utils/apis";

export function useSimpleTable<T extends Id>(url: string) {
  const state = reactive({
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
          flag: value,
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
    changeSuspendFlag: async (
      id: number | undefined,
      value: boolean
    ): Promise<void> => {
      const response = await patchApi<boolean, T>(`${url}/${id}/suspend-flag`, {
        flag: value,
      });

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
    created(item: T) {
      items.value = [...items.value, item];
    },
    updated(item: T) {
      items.value = items.value.map((oldItem) => {
        if (oldItem.id === item.id) {
          return item;
        } else {
          return oldItem;
        }
      });
    },
  };
  return { ...toRefs(state), items, ...methods };
}
