import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import { viewerStore } from "../../../store/index"; // 导入 Pinia Store

export default function () {

  function clickV():Viewer {    
    let useViewer = viewerStore();    // 成功使用pinia调用到viewer    
    let viewer = useViewer.viewer;    // viewer 是非响应式
    
    return viewer;  
  }
  return { clickV };
}
