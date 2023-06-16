<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router/composables";
import { useMemberStore } from "@/stores/member";
import { routerReplace } from "@/utils/commands";
import { useStoreStore } from "@/stores/store";
import { useAlertStore } from "@/stores/alert";
import { Token } from "@/definitions/types";

const { query } = useRoute();
const { saveToken, memberClear } = useMemberStore();
const { fetchStoreList, storeClear } = useStoreStore();
const { toastError } = useAlertStore();

function clear() {
  memberClear();
  storeClear();
}

async function fetchMemberInfo(tokens: Token) {
  await saveToken(tokens);
  await fetchStoreList();
}

onMounted(async () => {
  const accessToken = query.accessToken as string;
  const refreshToken = query.refreshToken as string;
  const error = query.error as string;

  if (accessToken && refreshToken) {
    clear();
    await fetchMemberInfo({ accessToken, refreshToken });
  } else if (error) {
    toastError(error);
  }
  await routerReplace("/");
});
</script>
