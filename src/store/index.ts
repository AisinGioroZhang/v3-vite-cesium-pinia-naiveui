import {defineStore} from 'pinia'
import * as Cesium from 'cesium'

// 创建store,命名规则： useXxxxStore
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
export const viewerStore = defineStore('viewerPinia ',{
    // 状态。state: 返回对象的函数
    state: () => ({
        viewer:{} as Cesium.Viewer
    }),
    
     // 修改状态（包括同步和异步），封装逻辑
    actions: {
        changeLevelName(newV: Cesium.Viewer) {
            this.viewer = newV;
            return ;
          },
    },

    // 计算属性
    getters: {

    },

})

