<template>
  <div>
    <input
      ref="refFileUpload"
      type="file"
      accept="image/*"
      hidden
      @change="changeImage"
    />

    <v-card width="250px" outlined>
      <v-img
        :aspect-ratio="4 / 3"
        :src="value || require('/src/assets/img/image-upload.png')"
      />
      <v-card-actions>
        <span
          v-if="value"
          class="font-weight-black error--text"
          style="cursor: pointer"
          @click="clear"
          >초기화</span
        >
        <v-spacer />
        <span
          class="font-weight-black"
          style="cursor: pointer"
          @click="refFileUpload.click()"
          >이미지 업로드</span
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="openCropperDialog" width="500px">
      <v-card class="d-flex flex-column overflow-hidden">
        <v-card-text
          class="flex-grow-1 pa-0 d-flex justify-center align-center"
        >
          <vue-cropper
            ref="refCropper"
            class="cropper"
            :aspect-ratio="4 / 3"
            :guides="true"
            :background="false"
            :view-mode="3"
            drag-mode="move"
            :src="chosenImage"
            alt="Image not available"
          />
        </v-card-text>

        <v-card-actions class="pa-0">
          <div
            class="dialog-button cancel-button"
            @click="openCropperDialog = false"
          >
            취소
          </div>
          <div class="dialog-button confirm-button" @click="cropImage">
            자르기
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { ref } from "vue";
import { useAlertStore } from "@/stores/alert";
import { getPresignedUrl } from "@/utils/apis";
import envs from "@/constants/envs";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
import { useVModel } from "@vueuse/core";

const { toastWarning } = useAlertStore();

const props = withDefaults(
  defineProps<{
    value?: string;
  }>(),
  { value: "" }
);

const emits = defineEmits<{
  (e: "input", v: string): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });

const openCropperDialog = ref(false);
const chosenImage = ref<string | null | unknown>(null);
const imageFileType = ref<string>("");

async function changeImage(event: InputEvent): Promise<void> {
  if (!event) return;

  const inputElement = event.target as HTMLInputElement;
  const image = inputElement.files?.[0];

  if (image) {
    chosenImage.value = await toBase64(image);
    await initCropper(image.type);
  }

  inputElement.value = "";
}

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function initCropper(type: string): Promise<void> {
  if (!type || !type.startsWith("image/")) {
    toastWarning("이미지만 업로드가 가능합니다.");
    return;
  }
  openCropperDialog.value = true;
  imageFileType.value = type;
  await new Promise((resolve) => setTimeout(resolve, 50));
  refCropper.value.replace(chosenImage.value);
}

function clear() {
  value.value = "";
}

function blobToFile(blob, fileName) {
  return new File([blob], fileName, { type: blob.type });
}

function cropImage() {
  const croppedCanvas = refCropper.value.getCroppedCanvas();

  croppedCanvas.toBlob(async (blob) => {
    const fileExtension = imageFileType.value.split("/")[1];
    const fileName = `${uuidV4()}.${fileExtension}`;

    const file = blobToFile(blob, fileName);

    await getPresignedUrl({
      bucket: envs.S3_BUCKET,
      folder: "item",
      fileName: fileName,
      acl: "private",
    }).then(async (response) => {
      try {
        const uploadResponse = await axios({
          method: "PUT",
          url: response,
          data: file,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.status === 200) {
          value.value = `https://${envs.S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/item/${fileName}`;
        }
      } catch (e) {
        toastWarning(
          "이미지가 정상적으로 등록되지 않았습니다. 다시 업로드해주세요."
        );
      } finally {
        openCropperDialog.value = false;
      }
    });
  }, imageFileType.value);
}
const refCropper = ref();
const refFileUpload = ref();
</script>

<style scoped>
.cropper img {
  width: 100%;
}

.dialog-button {
  display: inline-block;
  width: 50%;
  height: 65px;
  line-height: 65px;
  text-align: center;
  cursor: pointer;
}

.cancel-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 400;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background-color: #2196f3;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #1976d2;
}
</style>
