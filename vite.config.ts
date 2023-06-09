import { defineConfig } from "vite";
import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import PostcssPxToViewport from "postcss-px-to-viewport";
import { resolve } from "path";
import { viteVConsole } from "vite-plugin-vconsole";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  console.log(command, mode, env);

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
      viteVConsole({
        entry: [resolve(__dirname, "./src/main.ts")],
        localEnabled: command === "serve",
        enabled: command === "serve",
        config: {
          maxLogNumber: 1000,
          theme: "dark",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      host: true,
      port: 9527,
      proxy: {
        "/api": {
          target: "http://api.example.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          PostcssPxToViewport({
            unitToConvert: "px", // 要转化的单位
            viewportWidth: 375, // UI设计稿的宽度，一般是375/750
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            landscape: false, // 是否处理横屏情况
          }),
        ],
      },
    },
  };
});
