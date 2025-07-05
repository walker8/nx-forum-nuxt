// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import prismjs from 'vite-plugin-prismjs'
import type { NuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@vant/nuxt',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss'
  ],

  pinia: {
    storesDirs: ['./stores/**']
  },

  piniaPersistedstate: {
    storage: 'localStorage',
    debug: false
  },

  vant: {
    /** Options */
    lazyload: true
  },

  css: ['element-plus/dist/index.css', 'element-plus/theme-chalk/display.css'],

  vite: {
    // 设置scss的api类型为modern-compiler
    css: {
      preprocessorOptions: {
        scss: {
          // @ts-ignore - 忽略类型检查，scss的api选项在新版本中支持
          api: 'modern-compiler'
        }
      }
    },
    plugins: [
      AutoImport({
        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver(),
          VantResolver(),
          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({ prefix: 'Icon' })
        ]
      }),
      Components({
        dts: true,
        resolvers: [
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep']
          }),
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          ElementPlusResolver({
            importStyle: false
          }),
          VantResolver({
            importStyle: true
          })
        ]
      }),
      prismjs({
        // 添加支持的高亮的语言, 如果需要支持全部的话改成这样:  languages: "all"
        languages: 'all',
        // 配置prism插件 toolbar是后面两个插件依赖的插件.
        // show-language: 显示语言名。
        // copy-to-clipboard: 添加复制代码功能。
        plugins: ['toolbar', 'show-language', 'copy-to-clipboard'],
        // 主题名称,支持的主题可以在 node_moduels中安装此库的目录下寻找。
        theme: 'tomorrow',
        css: true
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
          experimentalMinChunkSize: 10 * 1024 // 单位b
        },
        treeshake: {
          moduleSideEffects: 'no-external' // 删除外部模块的未使用部分
        }
      }
    }
  },

  // 配置应用程序选项
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  // 避免内联style，减少document体积
  features: {
    inlineStyles: false
  },

  devServer: {
    host: '0.0.0.0'
  },

  nitro: {
    // 仅在开发环境（development）中生效
    devProxy: {
      '/nx-forum': {
        target: 'http://127.0.0.1:8083/nx-forum',
        changeOrigin: true,
        prependPath: true
      }
    },
    // 代理转发，在所有环境（development 和 production）中都生效
    routeRules: {
      '/nx-forum/**': {
        proxy: 'http://127.0.0.1:8083/nx-forum/**'
      },
      '/': {
        ssr: true
      },
      '/f/**': {
        ssr: true
      },
      '/t/**': {
        ssr: true
      },
      '/c/**': {
        ssr: false
      },
      '/editor/**': {
        ssr: false
      },
      '/admin/**': {
        ssr: false
      },
      '/uc/**': {
        ssr: false
      },
      '/notification/**': {
        ssr: false
      }
    }
  },

  devtools: {
    enabled: false,
    timeline: {
      enabled: true
    }
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  // 保持兼容性，避免API变更导致的问题
  compatibilityDate: '2025-05-15'
}) satisfies NuxtConfig
