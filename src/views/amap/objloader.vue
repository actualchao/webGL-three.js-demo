<template>
<div id="container">
  <div class="map-container" ref="amap"></div>
</div>

</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import MapContainer from '@/utils/amap-utils.js'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

export default {
  mounted () {
    this.initMap(this.$refs.amap)
  },
  methods: {
    initMap (dom) {
      if (!dom) {
        throw new Error('map dom is required')
      }
      this.mapIntance = new MapContainer({
        target: dom,
        pitch: 55,
        zoom: 16
      })
      this.map = this.mapIntance.map
      this.initLight()
      this.initObject()
    },
    initLight () {
      this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 1)
      this.map.DirectionLight = new AMap.Lights.DirectionLight([1, 0, -0.5], [1, 1, 1], 1)
    },
    initObject () {
      // 初始化加载管理器
      const manager = new THREE.LoadingManager()
      manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
      }

      manager.onLoad = function () {
        console.log('complete!')
      }

      manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
      }

      manager.onError = function (url) {
        console.log('ERROR ' + url)
      }

      // 初始化THREE 三维信息 loader
      const objLoader = new OBJLoader(manager)
      //  初始化 材质信息 loader
      const mtlLoader = new MTLLoader(manager)

      //  开始加载材质信息
      mtlLoader
        .setPath('/modal/obj2/')
        .load('Model.mtl', (materials) => {
          // 给objloader 挂载材质属性，
          objLoader.setMaterials(materials)

          // 开始加载obj 模型
          objLoader
            .setPath('/modal/obj2/')
            .load('Model.obj', geometry => {
              // 初始化高德3D涂层
              const object3Dlayer = new AMap.Object3DLayer()

              // console.log(geometry);
              // 拿到加载好的材质和geometry
              const materials = geometry.children[0].material
              geometry = geometry.children[0].geometry

              // 拿到所有的点、法线、纹理坐标信息
              const { position, normal, uv } = geometry.attributes
              // console.log(position, normal, uv)

              // 材质对应分组geometry信息
              // 根据分组信息，对应拿到每个组的数据，赋值给高德构造器
              const meshs = geometry.groups
              meshs.forEach(mesh => {
                // three 加载后的分组索引信息
                const { start, count, materialIndex } = mesh

                //  拿到材质的颜色信息
                const { color, opacity } = materials[materialIndex]

                // 初始化高德构造器
                const amapMesh = new AMap.Object3D.MeshAcceptLights()
                var amapGeometry = amapMesh.geometry

                //   循环赋值
                // 高德三位笛卡尔坐标Z轴向下 计算时对应转换点坐标/uv坐标
                for (let i = 0; i < count; i++) {
                  amapGeometry.vertices.push(position.array[3 * (start + i) + 0], position.array[3 * (start + i) + 2], -position.array[3 * (start + i) + 1])
                  amapGeometry.vertexNormals.push(normal.array[3 * (start + i) + 0], normal.array[3 * (start + i) + 2], -normal.array[3 * (start + i) + 1])
                  amapGeometry.vertexUVs.push(uv.array[2 * (start + i)], 1 - uv.array[2 * (start + i) + 1])
                  amapGeometry.vertexColors.push(color.r, color.g, color.b, opacity)
                  // 按照纹理索引   设置每个点纹理索引
                  amapGeometry.textureIndices.push(materialIndex, materialIndex, materialIndex)
                }
                // 模型设置地图位置
                amapMesh.position(new AMap.LngLat(120, 30))
                // 模型缩放
                amapMesh.scale(12, 12, 12)
                // 双面渲染
                amapMesh.backOrFront = 'both'

                const map = materials[materialIndex].map
                // 控制台能拿到image 但是js 读取不到，bug待查
                // 手动按照顺序添加纹理贴图
                // console.log(map.image)
                map && amapMesh.textures.push('/modal/obj2/mat 00 02.png', '/modal/obj2/mat 01.png', '/modal/obj2/mat 00 02.png')

                amapMesh.rotateZ(180)

                object3Dlayer.add(amapMesh)
              })

              console.log(object3Dlayer)
              window.object3Dlayer = object3Dlayer
              this.map.add(object3Dlayer)

              // let i = 0
              // setInterval(() => {
              //   this.map.setRotation(i % 360)
              //   i += 0.5
              // }, 50)
            })
        })
    }

  }
}
</script>
<style lang="scss">
#container{
  width: 100%;
  height: 100%;
}
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
