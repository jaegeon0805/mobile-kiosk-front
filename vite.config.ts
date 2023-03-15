import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2';
import Components from "unplugin-vue-components/vite";
import {VuetifyResolver} from "unplugin-vue-components/resolvers";
import {resolve} from "node:path";

export default defineConfig({
  plugins: [
    vue2(),
    Components({
      dts: false,
      resolvers: [VuetifyResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8081,
  },
  // css: {
  //   preprocessorOptions: {
  //     sass: {
  //       additionalData: [
  //         // vuetify variable overrides
  //         '@import "@/styles/variables.scss"',
  //         '',
  //       ].join('\n'),
  //     },
  //   },
  // },
})
