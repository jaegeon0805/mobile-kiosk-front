import envs from "@/constants/envs";
import dayjs from "dayjs";

export function formatDateTime(value: Date): string {
  return dayjs(value).isValid()
    ? dayjs(value).format(envs.DATETIME_FORMAT)
    : "";
}
