import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import * as Cesium from "cesium";
import { viewerStore } from "../../../store/index"; // 导入 Pinia Store
import { MapConfig } from "./TDTKey";
export default function () {
    let useViewer = viewerStore();    // 成功使用pinia调用到viewer    
    let viewer = useViewer.viewer;    // viewer 是非响应式


    function addMap() {
        // 天地图影像地图
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: MapConfig.TDT_IMG_C,
                layer: 'img_c',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'c',
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                maximumLevel: 6
            }), 0)
        // 天地图注记地图
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: MapConfig.TDT_CVA_C,
                layer: 'cva_c',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'c',
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
                maximumLevel: 18
            })
        )
    }
    function addGLB(lon: number, lat: number) {
        const h = Math.round(Math.random()*100)
        const drone = viewer.entities.add({
            name: "drone",
            position: Cesium.Cartesian3.fromDegrees(lon, lat, h),
            model: {
                // uri: "models/Drone.glb",
                uri: "models/feiji.glb",
                minimumPixelSize: 128,
                maximumScale: 20000,
                scale: 10,
                runAnimations: true, // 动画
            }            
        })
        // viewer.trackedEntity = drone;
        // viewer.flyTo(drone);
    }

    function initView() {
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                113.23082677,
                36.83987519,
                30000000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0.0,
            },
        });

    }

    function basicConfigs() {

        let creditContainer = <HTMLImageElement>viewer.cesiumWidget.creditContainer;
        creditContainer.style.display = "none";
        // 抗锯齿
        viewer.resolutionScale = window.devicePixelRatio
        viewer.scene.postProcessStages.fxaa.enabled = true

    }    
    return { addMap, addGLB, initView, basicConfigs };
}