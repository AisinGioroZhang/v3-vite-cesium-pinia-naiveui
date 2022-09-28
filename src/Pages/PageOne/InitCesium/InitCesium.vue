<template>
  <div id="cesium">
    <div id="cesium-container"></div>
  </div>  
</template>

<script setup lang="ts">
import { markRaw, nextTick, onMounted } from "vue";
import * as Cesium from "cesium";
import { CustomDataSource, Ion, Viewer } from "cesium";

// 导入 Pinia Store,
import { viewerStore } from "@/store/index";

// 导入 TDTKey
import { MapConfig } from "./TDTKey";
// 使用hooks 初始化cesium
import useBaseMap from "./useBaseMap";



// 导入接口
import useQueryWeather from "@/api/business/weatherquery";

// 调用函数获得Store
const viewStore = viewerStore();

let viewer: Viewer;

function initCe() {
  Ion.defaultAccessToken = MapConfig.CesiumDefaultAccessToken;
  viewer = markRaw(
    new Viewer("cesium-container", {
      timeline: false, // 隐藏正下方时间线
      homeButton: false, // 隐藏界面右上角初始化地球位置按钮
      fullscreenButton: false, // 隐藏界面右下角全屏按钮
      infoBox: false, // 点击地球后的信息框
      animation: false, // 隐藏界面左下角控制动画的面板
      geocoder: false, // 右上角 搜索
      sceneModePicker: false, // 右上角 2D/3D切换
      baseLayerPicker: false, // 隐藏界面左上角地图底图的切换按钮
      navigationHelpButton: false, // 右上角 Help
      shouldAnimate: true, // 动画
      selectionIndicator: false, // 隐藏双击entity时候的聚焦框
      skyAtmosphere: false, // 去除地球外侧光圈      
    })
  );
  viewStore.viewer = viewer; // 存入pinia
  
  let creditContainer = viewer.cesiumWidget.creditContainer;
  //@ts-ignore
  creditContainer.style.display = "none"; //隐藏版权信息

  viewer.scene.globe.depthTestAgainstTerrain = true;

  let { addMap, initView, basicConfigs } = useBaseMap(); // 初始化地图
  
  // addMap(); // 申请key后可以添加天地图影像和注记
  initView(); // 初始化视角
  basicConfigs();

  // viewer.extend(viewerCesiumInspectorMixin); // 打开cesium的控制面板
}
/**
 * 新建图层
 */
const newlayer = (layerName: string) => {
  let layer: null | CustomDataSource;
  if (!viewer.dataSources?.getByName(layerName).length) {
    layer = new Cesium.CustomDataSource(layerName);
    viewer && viewer.dataSources?.add(layer);
  } else {
    viewer.dataSources.getByName(layerName)[0].entities.removeAll();
    layer = viewer.dataSources.getByName(layerName)[0];
  }
};

onMounted(() => {
  initCe();
  nextTick(() => {
    newlayer("meteorlogical"); // 
  });
});
</script>

<style scoped lang="scss">
@import "InitCesium.scss";
</style>
