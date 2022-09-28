import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import * as Cesium from "cesium";
import CustomDataSource from "cesium/Source/DataSources/CustomDataSource";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Cartesian2 from "cesium/Source/Core/Cartesian2";
import Cartographic from "cesium/Source/Core/Cartographic";
import { CallbackProperty, Rectangle } from "cesium";
import Entity from "cesium/Source/DataSources/Entity";

/**
 * 经纬度地理坐标
 */
interface PositionLonLatType {
  lng?: number;
  lat?: number;
  alt?: number;
  lon?: number;
}
/**
 * @description 画一个矩形，圈片地~
 */
class DrawRect {
  rectLayer: null | CustomDataSource;
  _viewer: Viewer;
  _digRect: Cartesian3[];
  _handle: Cesium.ScreenSpaceEventHandler | undefined | null;

  constructor(viewer: Viewer, layerName: string) {
    this.rectLayer = null;
    if (!viewer.dataSources.getByName(layerName).length) {
      this.rectLayer = new Cesium.CustomDataSource(layerName);
      viewer && viewer.dataSources.add(this.rectLayer);
    } else {
      viewer.dataSources.getByName(layerName)[0].entities.removeAll();
      this.rectLayer = viewer.dataSources.getByName(layerName)[0];
    }
    this._viewer = viewer;
    this._digRect = [];
  }

  get digRect() {
    return this._digRect;
  }

  set digRect(arr) {
    this._digRect = arr;
  }

  /**
   * 坐标转换 84经纬度转 Cartesian3
   * @param position:PositionLonLatType 经纬度
   * @param alt 高度
   * @returns
   */
  transfromWGS84ToCartesian(position: PositionLonLatType, alt?: number) {
    if (this._viewer) {
      return position
        ? Cesium.Cartesian3.fromDegrees(
            (position.lng as number) || (position.lon as number),
            position.lat as number,
            (position.alt = alt || position.alt)
          )
        : Cesium.Cartesian3.ZERO;
    }
  }

  /**
   * 坐标数组转换 84经纬度转Cartesian3
   * @param WGS84Arr [..., {lng,lat,alt}]
   * @param alt
   * @returns
   */
  transformWGS84ArrayToCartesianArray(WGS84Arr: any[], alt: any) {
    if (this._viewer && WGS84Arr) {
      let _this = this;
      return WGS84Arr
        ? WGS84Arr.map(function (item: any) {
            return _this.transfromWGS84ToCartesian(item, alt);
          })
        : [];
    }
  }

  /**
   * 坐标转换 Cartesian3 转84经纬度
   * @param cartesian 三维位置坐标
   * @returns {{lng: number, alt: number, lat: number}} 地理坐标
   */
  transformCartensianToWGS84(cartesian: Cartesian3): PositionLonLatType {
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    let cartographic = ellipsoid.cartesianToCartographic(cartesian);
    let pos: PositionLonLatType = {
      lng: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      alt: cartographic.height,
    };
    return pos;
  }

  /**
   * 坐标数组转换 Cartesian3转84经纬度 数组
   * @param cartesianArr
   * @returns
   */
  transformCartesianArrayToWGS84Array(cartesianArr: Cartesian3[]) {
    let _this = this;
    return cartesianArr
      ? cartesianArr.map(function (item: any) {
          return _this.transformCartensianToWGS84(item);
        })
      : [];
  }
  /**
   * WGS84 经纬度转弧度坐标
   * @param position
   * @returns
   */
  transformWGS84ToCartographic(position: any) {
    return position
      ? Cesium.Cartographic.fromDegrees(
          position.lng || position.lon,
          position.lat,
          position.alt
        )
      : Cesium.Cartographic.ZERO;
  }

  /**
   * 拾取位置点
   * @param {Cartesian2} px 屏幕坐标
   * @returns {false | Cesium.Cartesian3 | null | undefined}
   */
  getCartesian3FromPX(px: Cartesian2) {
    if (this._viewer && px) {
      let picks = this._viewer.scene.drillPick(px);
      let cartesian = null;
      let isOn3Dtiles = false,
        isOnTerrain = false;

      // drillPick 可以获取到所有的entity
      for (let i in picks) {
        let pick = picks[i];
        // 在3dtiles上拾取到坐标
        if (
          (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
          (pick && pick.primitive instanceof Cesium.Cesium3DTile) ||
          (pick && pick.primitive instanceof Cesium.Model)
        ) {
          isOn3Dtiles = true;
        }
        // 3dtileset
        if (isOn3Dtiles) {
          this._viewer.scene.pick(px);
          cartesian = this._viewer.scene.pickPosition(px);
          if (cartesian) {
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (cartographic.height < 0) {
              cartographic.height = 0;
            }

            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            const position: PositionLonLatType = {
              lng: longitude,
              lat: latitude,
              alt: height,
            };
            cartesian = this.transfromWGS84ToCartesian(position);
          }
        }
      }

      // 地形上
      let boolTerrain =
        this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
      // terrian
      if (!isOn3Dtiles && !boolTerrain) {
        let ray = this._viewer.scene.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        isOnTerrain = true;
      }

      // 地球上
      if (!isOn3Dtiles && !isOnTerrain && boolTerrain) {
        cartesian = this._viewer.scene.camera.pickEllipsoid(
          px,
          this._viewer.scene.globe.ellipsoid
        );
      }
      if (cartesian) {
        let position = this.transformCartensianToWGS84(cartesian);
        if (position !== undefined && (position.alt as number) < 0) {
          cartesian = this.transfromWGS84ToCartesian(position, 0.01);
        }
        return cartesian;
      }
      return false;
    }
  }

  /**
   * 获取84坐标的距离
   * @param positions
   * @returns
   */
  getPositionDistance(positions: string | any[]) {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      let point1cartographic = this.transformWGS84ToCartographic(positions[i]);
      let point2cartographic = this.transformWGS84ToCartographic(
        positions[i + 1]
      );
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      s = Math.sqrt(
        Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2)
      );
      distance = distance + s;
    }
    return distance.toFixed(3);
  }

  /**
   * 由矩形提出点坐标
   * @param coordinates
   * @param isClose
   * @returns
   */
  polylineFromRect(coordinates: any, isClose = false) {
    let tempArr = [];
    // 四个角点
    let left_down = Cesium.Cartesian3.fromRadians(
      coordinates.west,
      coordinates.south
    );
    let right_down = Cesium.Cartesian3.fromRadians(
      coordinates.east,
      coordinates.south
    );
    let right_up = Cesium.Cartesian3.fromRadians(
      coordinates.east,
      coordinates.north
    );
    let left_up = Cesium.Cartesian3.fromRadians(
      coordinates.west,
      coordinates.north
    );

    tempArr.push(left_down, right_down, right_up, left_up);
    return isClose ? [...tempArr, tempArr[0]] : [...tempArr];
  }

  drawRectangle(
    RectColor: any,
    LineColor: any,
    callback: (arr: any[]) => void
  ) {
    let _this = this;
    let pointsArr = []; // 左键点击的点， Cartesian3

    interface IRectangle {
      points: Cartographic[];
      rect: Rectangle | undefined | CallbackProperty;
      entity: Entity | undefined;
    }
    // [0]是第一次点击的坐标，[1]是移动中不断更新的坐标
    let rectangle: IRectangle = {
      points: [],
      rect: undefined,
      entity: undefined,
    };

    this._handle = new Cesium.ScreenSpaceEventHandler(
      this._viewer.scene.canvas
    );
    // 左键点击
    this._handle.setInputAction(function (evt: any) {
      let cartesian3 = _this.getCartesian3FromPX(evt.position);
      if (cartesian3) {
        if (rectangle.points.length === 0) {
          pointsArr.push(cartesian3);
          rectangle.points.push(
            _this._viewer.scene.globe.ellipsoid.cartesianToCartographic(
              cartesian3
            )
          );
          rectangle.rect = Cesium.Rectangle.fromCartographicArray(
            rectangle.points
          );
          rectangle.entity = _this.rectLayer?.entities.add({
            rectangle: {
              coordinates: rectangle.rect,
              material: RectColor || Cesium.Color.fromCssColorString("#41b883"),
            },
          });
          let positions = [..._this.polylineFromRect(rectangle.rect, true)];

          //@ts-ignore
          rectangle.entity.polyline = {
            positions: new Cesium.ConstantProperty(positions),
            width: new Cesium.ConstantProperty(2),
            material: LineColor || Cesium.Color.fromCssColorString("#e0e0e0"),
            //@ts-ignore
            arcType: Cesium.ArcType.RHUMB,
          };
        } else {
          const arrL = _this.transformCartesianArrayToWGS84Array(
            _this._digRect
          );

          // 左下角
          const bottomLat = arrL[0].lat?.toFixed(4);
          const leftLon = arrL[0].lng?.toFixed(4);
          // 右上角
          const topLat = arrL[2].lat?.toFixed(4);
          const rightLon = arrL[2].lng?.toFixed(4);
          callback([bottomLat, leftLon, topLat, rightLon]);
          
          _this.cleanRect()

          _this._handle?.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          _this._handle?.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动
    this._handle.setInputAction(function (evt: any) {
      if (rectangle.points.length === 0) {
        return;
      }
      let moveEndPosition = _this.getCartesian3FromPX(evt.endPosition);
      // 点在无地形的球面上
      if (moveEndPosition) {
        pointsArr[1] = moveEndPosition;
        // 另一个点是动态的
        rectangle.points[1] =
          _this._viewer.scene.globe.ellipsoid.cartesianToCartographic(
            moveEndPosition
          );
        rectangle.rect = new Cesium.CallbackProperty(function () {
          return Cesium.Rectangle.fromCartographicArray(rectangle.points);
          // @ts-ignore
        }, false).getValue();

        //@ts-ignore
        rectangle.entity.rectangle.coordinates = new Cesium.CallbackProperty(
          () => {
            return Cesium.Rectangle.fromCartographicArray(rectangle.points);
          },
          false
        );
        //@ts-ignore
        rectangle.entity.polyline.positions = new Cesium.CallbackProperty(
          () => {
            return [..._this.polylineFromRect(rectangle.rect, true)];
          },
          false
        );
      }

      let temp = _this.polylineFromRect(rectangle.rect);
      _this.digRect = [...temp];
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  cleanRect() {
    this.rectLayer?.entities.removeAll();
    if (Cesium.defined(this._handle)) {
      this._handle?.destroy();
      this._handle = null;
    }
  }
  destroy() {
    if (this._handle) {
      this._handle.destroy();
      this._handle = null;
    }
  }
}
export default DrawRect;
