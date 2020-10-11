import AMap from 'AMap'
import AMapStyle from './amap-style'

export default class MapContainer {
  constructor (options) {
    // 逆地理编码实例
    this.geocoder = new AMap.Geocoder()
    // 海量点实例集合
    this.massMarksMap = new Map()
    // 覆盖物集合实例集合
    this.overlayGroupMap = new Map()
    // 聚合覆盖物实例集合
    this.clusterMarkersMap = new Map()
    // init
    this.initMap(options)
  }

  /**
   *初始化地图
   * @param {Object} options 参数配置与高德的相同
   * @memberof MapContainer
   */
  initMap (options) {
    const map = new AMap.Map(
      options.target,
      Object.assign({
        viewMode: '3D',
        zoom: options.zoom || 18, // 级别
        center: options.center || [120, 30], // 中心点坐标
        ...options
      })
    )
    this.map = map
  }

  /**
 * 添加海量点
 * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
 * @param {Array} {data} 点位数据
 * @param {Object} {options} 高德MassMarks 类配置
 * @param {Function} {clickCallback} 点位点击后的回调
 * @memberof MapContainer
 */
  addMassMarks ({ type, data, options = {}, clickCallback }) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setData(data)
    } else {
      const mass = new AMap.MassMarks(data, {
        ...options,
        style: AMapStyle[type]
      })
      clickCallback && mass.on('click', clickCallback)
      mass.setMap(this.map)
      this.massMarksMap.set(type, mass)
    }
  }

  /**
   * 切换海量点涂层显示隐藏
   * @param {String} type 点位类型
   * @param {Boolean} show 显示隐藏
   */
  changeMassTypeShow (type, show) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      show ? mass.show() : mass.hide()
    }
  }

  /**
   * 获取海量点数据
   * @param {String} type 海量点类型
   */
  getMassTypeData (type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      return mass.getData()
    } else {
      console.log('no has this type!!')
      return []
    }
  }

  clearMassType (type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setMap(null)
      this.massMarksMap.set(type, null)
    } else {
      console.log('no has this type!!')
    }
  }

  /**
   * 重新渲染海量点
   * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
   * @memberof MapContainer
   */
  renderMassMarks (type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setStyle(AMapStyle[type])
    }
  }

  /**
   * 添加规划涂层组
   * @param {String} type 类型
   * @param {Array} data 规划数据
   * @param {Object} styleOption 样式
   */
  addOverLayGroup ({ type, data, styleOption = {} }) {
    if (this.overlayGroupMap.has(type)) {
      const OverlayGroup = this.overlayGroupMap.get(type)
      OverlayGroup.setMap(null)
      this.overlayGroupMap.set(type, null)
    }
    let overlays = []
    data.forEach((item, index) => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(parseFloat(item.point[1][0]), parseFloat(item.point[1][1])), // 取轨迹的第二个点打名字点位
        content: `<div class="plan-track-area-name"><span class="amap-ui-district-cluster-marker-title">${type === 'polyline' ? '路线' : '区域'}</span><span class="plan-track-area-name-body">${item.name || `${index}号`}</span></div>`,
        extData: item,
        offset: new AMap.Pixel(-20, -30)
      })
      let poly = null
      if (type === 'polyline') {
        poly = new AMap.Polyline({
          path: item.point,
          strokeColor: '#4169E1',
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round'
          // zIndex: 50,
          // ...styleOption
        })
      } else if (type === 'polygon') {
        poly = new AMap.Polygon({
          path: item.point,
          strokeColor: '#4169E1',
          fillColor: '#4169E1',
          fillOpacity: 0.2,
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round'
          // zIndex: 50,
          // ...styleOption
        })
      } else {
        throw new Error('没有该类型')
      }
      overlays = overlays.concat([marker, poly])
    })
    const OverlayGroup = new AMap.OverlayGroup(overlays)
    OverlayGroup.setMap(this.map)
    this.overlayGroupMap.set(type, OverlayGroup)
  }
  /**
   * 改变涂层组显示隐藏
   * @param {String} type 类别
   * @param {Boolean} show 显示隐藏
   */

  changeOverlayGroupShow (type, show) {
    if (this.overlayGroupMap.has(type)) {
      const OverlayGroup = this.overlayGroupMap.get(type)
      show ? OverlayGroup.show() : OverlayGroup.hide()
    }
  }
  /**
   * 生成轨迹并回放轨迹
   * @param {Array} pathData 轨迹数据
   */

  addTrackReshow (pathData, iconName) {
    // 清除上次移动点位，上次轨迹
    this.movePoint && this.movePoint.stopMove()
    this.movePoint && this.movePoint.setMap(null)
    this.movePoint = null
    this.overlayGroupMap.get('track') && this.overlayGroupMap.get('track').setMap(null)
    this.overlayGroupMap.set('track', null)

    // 轨迹长度小于2不处理
    if (pathData.length < 2) {
      return
    }

    // 生成路径，途经点数据
    const path = []
    const markerPoints = []
    pathData.forEach(point => {
      const { longitude, latitude, stayTime } = point
      if (longitude && latitude) {
        path.push([longitude, latitude])
        if (stayTime) {
          markerPoints.push(point)
        }
      }
    })

    const startPoint = { ...pathData[0] }
    const endPoint = { ...pathData[pathData.length - 1] }
    markerPoints.unshift(startPoint)
    markerPoints.push(endPoint)
    // 生成路径线
    const movePolyline = new AMap.Polyline({
      path,
      strokeColor: '#1A28D3',
      strokeOpacity: 1,
      strokeWeight: 4,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'square',
      zIndex: 50
    })
    // 生成路径点位
    const markers = markerPoints.map(item => {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(parseFloat(item.longitude), parseFloat(item.latitude)), // 取轨迹的第二个点打名字点位
        content: `<div class="track-stay-time"><div class="text-tip" ${!item.stayTime ? 'style="display:none;' : ''}><p>停留</p><p>${item.stayTime}</p></div></div>`,
        extData: item,
        offset: new AMap.Pixel(-40, -89)
      })
      return marker
    })
    // 实例化涂层组
    const OverlayGroup = new AMap.OverlayGroup([movePolyline, ...markers])
    this.overlayGroupMap.set('track', OverlayGroup)
    OverlayGroup.setMap(this.map)
    this.map.setFitView()

    // 生成移动点位
    this.movePoint = new AMap.Marker({
      map: this.map,
      position: path[0],
      icon: (process.env.VUE_APP_BASEURL || '') + `/three-page/images/${iconName}.png`,
      offset: new AMap.Pixel(-17, -40),
      zIndex: 200,
      // autoRotation: true,
      angle: 0
    })
    this.movePoint.moveAlong(path, 999)
  }

  /**
   *  鼠标工具
   * @param {String} type 类型
   * @param {Object} styleOption 样式配置
   * @param {Boolean} edit 能不能编辑
   * @param {function} callback 回调函数
   */
  mouseToolDraw (type, styleOption = {}, edit, callback) {
    this.mouseTool && this.mouseTool.close(true)
    const hasType = ['polyline', 'polygon', 'circle', 'rectangle'].includes(type)
    if (!hasType) { throw new Error("type is required and in ['polyline', 'polygon', 'circle']") }
    this.mouseTool = new AMap.MouseTool(this.map)

    this.mouseTool.on('draw', function ({ obj }) {
      if (edit) {
        this.mouseTool && this.mouseTool.close(false)
        // 开始编辑画的类
        callback && callback(obj)
      } else {
        this.mouseTool && this.mouseTool.close(true)
        callback && callback(obj.getPath())
      }
    }.bind(this))
    this.mouseTool[type]({

      strokeColor: '#4169E1',
      strokeOpacity: 1,
      strokeWeight: 4,
      // 折线样式还支持 'dashed'
      strokeStyle: 'dashed',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 50,
      ...styleOption
    })
  }

  /**
   * 生成折线编辑器
   * @param {String} { type } 类型
   * @param {Array} { path } 折线或多边形数据
   * @param {Object} { styleOption } 折线或多边形样式
   * @param {function} { addNodeCallback } 增加节点回调
   * @param {function} { adjustCallback } 移动节点回调
   * @param {function} { endCallback } 结束编辑回调
   */
  newPolyEditor ({
    type,
    path,
    styleOption = {},
    addNodeCallback,
    adjustCallback,
    endCallback,
    drawCallback
  }) {
    // 结束编辑事件
    this.polyEditor && this.polyEditor.close()
    this.poly && this.poly.setMap(null)
    this.poly = null

    const fn = (poly) => {
      this.poly = poly
      this.poly.setMap(this.map)

      // 缩放地图到合适的视野级别
      this.map.setFitView([this.poly])
      // 初始化编辑器
      this.polyEditor = new AMap.PolyEditor(this.map, this.poly)

      //  添加节点事件
      this.polyEditor.on('addnode', function (event) {
        console.log('addnode')

        addNodeCallback && addNodeCallback(event)
      })
      // 节点改变事件
      this.polyEditor.on('adjust', function (event) {
        console.log('adjust')
        adjustCallback && adjustCallback(event)
      })
      // 结束编辑事件
      this.polyEditor.on('end', function (event) {
        console.log('end')
        endCallback && endCallback(event)
      // event.target 即为编辑后的折线对象
      })

      this.polyEditor.open()
      drawCallback && drawCallback(this.polyEditor)
    }

    if (path) {
      let poly = null
      if (type === 'polyline') {
        poly = new AMap.Polyline({
          path,
          strokeColor: '#4169E1',
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      } else if (type === 'polygon') {
        poly = new AMap.Polygon({
          path,
          strokeColor: '#4169E1',
          fillColor: '#4169E1',
          fillOpacity: 0.2,
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      }
      fn(poly)
    } else {
      this.mouseToolDraw(type, styleOption, true, fn)
    }

    // return this.polyEditor
  }

  /**
   * 添加聚合点位
   *
   * @param {Array} { data } 点位数据
   * @param {String} { type } 点位类型
   * @param {Object} { markerOpt } 点配置
   * @param {Function} { markerClickCallback } 坐标点点击回调
   * @param {Object} { options } 聚合配置
   * @memberof MapContainer
   */
  addMarkerClusterer ({ data, type = 'default', markerOpt, markerClickCallback, options }) {
    const markers = data.map(item => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(item.longitude, item.latitude),
        extData: item,
        icon: new AMap.Icon(AMapStyle.clusterMarker),
        ...markerOpt
      })

      markerClickCallback && marker.on('click', markerClickCallback)

      return marker
    })

    // clusterMarkersMap 分类管理聚合点数据
    let clusterMarkersMapVal = this.clusterMarkersMap.get(type)
    if (clusterMarkersMapVal) {
      clusterMarkersMapVal = clusterMarkersMapVal.concat(markers)
    }
    this.clusterMarkersMap.set(type, markers)

    if (this.clusterMarkers) {
      this.clusterMarkers.addMarkers(markers)
    } else {
      this.clusterMarkers = new AMap.MarkerClusterer(this.map, markers, {
        styles: AMapStyle.clusterStyle,
        ...options
      })
    }
  }

  /**
   *打开信息弹窗
   * @param {String/HTMLElement} { target } // 显示内容，可以是HTML要素字符串或者HTMLElement对象
   * @param {*} { longitude } // 经度
   * @param {*} { latitude } // 纬度
   * @param {Array} { offset } // 信息窗体显示位置偏移量。默认基准点为信息窗体的底部中心（若设置了anchor，则以anchor值为基准点）。
   * @param {Function} { closeCallback } // 关闭弹窗的回调
   * @memberof MapContainer
   */
  openInfoWindow ({ target, longitude, latitude, offset, closeCallback }) {
    const position = new AMap.LngLat(longitude, latitude)
    if (this.infoWindow) {
      this.infoWindow.close()
      this.infoWindow.setPosition(position)
      this.infoWindow.setContent(target)
    } else {
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        content: target,
        position,
        autoMove: true,
        closeWhenClickMap: true,
        offset: new AMap.Pixel(offset[0], offset[1])
      })
    }
    // 清除上一次的关闭回调
    this.infoWindow._oldCallback && this.infoWindow.off('close', this.infoWindow._oldCallback)
    // 将关闭回调保存下来
    this.infoWindow._oldCallback = closeCallback
    closeCallback && this.infoWindow.on('close', closeCallback)

    this.infoWindow.open(this.map, position)
  }

  /**
   * 清除信息窗口
   */
  clearInfoWindow () {
    if (this.infoWindow) {
      this.infoWindow.close()
      // 清除上一次的关闭回调
      this.infoWindow._oldCallback && this.infoWindow.off('close', this.infoWindow._oldCallback)
    }
  }

  // 移动地图到指定位置
  setCenterPosition (lnglat, zoom = this.map.getZoom()) {
    this.map.setZoomAndCenter(zoom, lnglat)
  }

  /**
   * 绑定点击事件
   * @param {function} { clickCallBack }
   * @memberof MapContainer
   */
  bindClickEvent (clickCallBack) {
    this.map.on('click', clickCallBack)
  }

  /**
   * 解除绑定点击事件
   * @param {function} { clickCallBack }
   * @memberof MapContainer
   */
  unBindClickEvent (clickCallBack) {
    this.map.off('click', clickCallBack)
  }

  /**
   * 设置默认地图点位
   * @param {Number} {longitude} 经度
   * @param {Number} {latitude} 纬度
   * @param {Icon} {icon} 点位图标
   * @memberof MapContainer
   */
  setLocaltion ({
    longitude,
    latitude,
    toCenter,
    icon = new AMap.Icon(AMapStyle.location),
    options
  }, callback) {
    this.clearLocaltion()

    this.localtionMarker = new AMap.Marker({
      icon,
      position: new AMap.LngLat(longitude, latitude),
      ...options
    })
    callback && this.localtionMarker.on('click', callback)
    this.localtionMarker.setMap(this.map)
    if (toCenter) {
      this.setCenterPosition([longitude, latitude], this.map.getZoom())
    }
  }

  // 清除定位点击点位
  clearLocaltion () {
    this.localtionMarker && this.localtionMarker.setMap(null)
    this.localtionMarker = null
  }

  // /**
  //  * 经纬度转地址
  //  * @param {Array} {position} 点位坐标数据
  //  */
  // getAddressByLnglat (position) {
  //   return new Promise((resolve, reject) => {
  //     // 地图展示和点击获取的都是84坐标系
  //     // 调用高德服务接口时需要转换为高德坐标系才能获得正确地址
  //     const [longitude, latitude] = transformPoint(position)

  //     this.geocoder.getAddress([longitude, latitude], (status, result) => {
  //       if (status === 'complete') {
  //         resolve(result.regeocode)
  //       } else {
  //         reject(result)
  //       }
  //     })
  //   })
  // }

  isPointInRing (point, ring) {
    return AMap.GeometryUtil.isPointInRing(point, ring)
  }
}
