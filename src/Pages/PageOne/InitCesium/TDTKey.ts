// 天地图Key
const SD_TDTKey = '自己申请'        // 山东省天地图   
const TDTKey = '自己申请'           // 国家天地图
export const MapConfig = {

  // Cesium的Token，最好自己申请
  CesiumDefaultAccessToken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MDU0YjFhNS1kZWYyLTQ2MmUtYTFjOS1mODRhNGE3Z' +
  'DQ1N2EiLCJpZCI6NjczMTIsImlhdCI6MTYzMTY4OTAwN30.hSUD_kw8g8FdFY5L1q0tMWbTyqCX90d5EoJn_NN6RsM',
  SD_TDT_URL:
    'http://service.sdmap.gov.cn/tileservice/sdrasterpubmap?tk=' + SD_TDTKey +
    '&layer=SDRasterPubMap&style=default&tilematrixset=default028mm&Service=' +
    'WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={TileMatrix}&' +
    'TileCol={TileCol}&TileRow={TileRow}',
  TDT_IMG_C:
    'http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
    TDTKey,
  TDT_CVA_C:
    'http://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
    TDTKey,
}
