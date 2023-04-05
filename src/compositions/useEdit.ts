import { Id } from "@/definitions/entities";
import { useVModel, useVModels } from "@vueuse/core";
import { computed, reactive, toRefs } from "vue";

export function useEdit<T extends Id>(
  props: { value: T; sheet: boolean },
  emits: {
    (e: "input", v: T): void;
    (e: "update:sheet", v: boolean): void;
  }
) {
  const value = useVModel(props, "value", emits, { eventName: "input" });
  const { sheet } = useVModels(props, emits);

  const state = reactive({
    loading: false,
  });

  const computes = {
    isNew: computed((): boolean => !value.value.id),
  };
  return {
    sheet,
    value,
    ...toRefs(state),
    ...computes,
  };
}
