import { defineConfig } from "vite";

import cesium from "vite-plugin-cesium";
import vue from "@vitejs/plugin-vue";
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // 映射路径
    const alias = [{ find: '@', replacement: resolve(__dirname, 'src') }]
    return {
        plugins: [vue(), cesium()],
        resolve: {
            alias
        },
        base: './',
        terserOptions: {
            // 生产环境移除console
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        server: {
            port: 8324,
            proxy: {
                '/api': {
                    target: 'http://172.26.8.21:8001/', // 接口基地址
                    changeOrigin: true,                 // 允许跨域
                    rewrite: path => {
                        console.log(path); 
                        return path.replace(/^\/api/, '');
                    }
                }
            }

        }

    }
});

