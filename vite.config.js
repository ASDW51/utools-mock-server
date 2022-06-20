const path = require("path")
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig(({command})=>{
  console.log(command)
  return {
  base:"./",
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [  
        IconsResolver({
        enabledCollections: ['ep'],
      }),,ElementPlusResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  build:{
    terserOptions: {
        /**
         * command 用来判断环境
         */
        compress: {
          drop_console: command !== 'serve',
          // 默认是true
          drop_debugger: command !== 'serve'
        }
    }
  }
}})
