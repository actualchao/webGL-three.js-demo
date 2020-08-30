<script type="text/ecmascript-6">
/**
 * 方向光，平行光
 * THREE.PointLight
 * @param {} color 十六进制颜色
 * @param {} intensity 光强度 0-1之间
 * @param {number} distance 光照距离
 * @param {} decay 光衰弱
 */

import * as THREE from 'three'
export default {
  render: function (h) {
    return h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }, [
      (<el-color-picker v-model={this.color} color-format="hex"></el-color-picker>)
    ])
  },
  data () {
    return { color: '#ff0000' }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let mesh
      let light
      let gui
      let texture = null
      const guiData = {
        fov: 15,
        lightX: 5,
        lightY: 5,
        lightZ: 5,
        intensity: 0.8,
        distance: 20,
        decay: 0.8,
        cameraX: 0,
        cameraY: 0,
        cameraZ: 4,
        repeatX: 2,
        repeatY: 2,
        /** 回环方式包裹方式 */
        repeatMode: [THREE.RepeatWrapping, /** 简单重复 */THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping],
        repeatModeIdxX: 0,
        repeatModeIdxY: 0

      }

      const createGui = async () => {
        if (gui) return
        const dat = require('dat.gui')
        gui = gui = new dat.GUI({ name: 'my-GUI' })
        gui.add(guiData, 'cameraX', -3, 6).name('相机位置X').step(1)
        gui.add(guiData, 'cameraY', -3, 6).name('相机位置Y').step(1)
        gui.add(guiData, 'cameraZ', -3, 6).name('相机位置Z').step(1)
        gui.add(guiData, 'repeatX', 2, 6).name('材质重复X').step(1)
        gui.add(guiData, 'repeatY', 2, 6).name('材质重复y').step(1)
        gui.add(guiData, 'repeatModeIdxX', 0, 2).name('材质重复方式X').step(1)
        gui.add(guiData, 'repeatModeIdxY', 0, 2).name('材质重复方式Y').step(1)
      }

      const initThree = () => {
        renderer = new THREE.WebGLRenderer({
          antialias: true // 抗锯齿
        })
        renderer.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(renderer.domElement)
        renderer.setClearColor(0xffffff, 1.0)
      }
      const initCamera = () => {
        camera = new THREE.PerspectiveCamera(guiData.fov, dom.offsetWidth / dom.offsetHeight, 0.01, 10)
        camera.position.x = guiData.cameraX
        camera.position.y = guiData.cameraY
        camera.position.z = guiData.cameraZ
        camera.lookAt(0, 0, 0)
      }

      const initScene = () => {
        scene = new THREE.Scene()
      }

      const initLight = () => {
        light = new THREE.PointLight(this.color, guiData.intensity, guiData.distance, guiData.decay)
        scene.add(light)
      }

      const initObject = () => {
        return new Promise((resolve, reject) => {
          var geometry = new THREE.BoxGeometry(0.8, 0.4, 0.4)

          // var createTexture = new THREE.ImageUtils.loadTexture(require('@/assets/a.jpg'))
          // var material = new T HREE.MeshLambertMaterial({ map: createTexture, color: 0xFFFFFF })

          // 初始化一个加载器
          var loader = new THREE.TextureLoader()

          // 加载一个资源
          loader.load(
          // 资源URL
            require('@/assets/a.jpg'),

            // onLoad回调
            function (textureSelf) {
              texture = textureSelf
              // in this example we create the material when the texture is loaded
              var material = new THREE.MeshBasicMaterial({
                map: texture
              })
              mesh = new THREE.Mesh(geometry, material)

              var axesHelper = new THREE.AxesHelper(2)
              scene.add(mesh, axesHelper)
              resolve(texture)
            },

            // 目前暂不支持onProgress的回调
            undefined,

            // onError回调
            function (err) {
              console.log(err)
              console.error('An error happened.')
            }
          )
        })
      }

      const animate = () => {
        renderer.clear()
        requestAnimationFrame(animate)

        /** 更新纹理重复属性 */
        texture.wrapS = guiData.repeatMode[guiData.repeatModeIdxX]
        texture.wrapT = guiData.repeatMode[guiData.repeatModeIdxY]
        texture.offset.x += 0.01
        texture.repeat.x = guiData.repeatX
        texture.repeat.y = guiData.repeatY
        // 设置回环包裹方式需要设置需要更新属性，使纹理重新加载到内存中
        texture.needsUpdate = true

        // 根据gui参数调整相机fovF
        camera.position.x = guiData.cameraX
        camera.position.y = guiData.cameraY
        camera.position.z = guiData.cameraZ
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      }

      createGui()
      initThree()
      initCamera()
      initScene()
      initLight()
      initObject().then(() => {
        animate()
      })
      // animate()
    }

  }
}
</script>

<style lang="scss" scoped>
.el-color-picker {
  position: absolute;
  bottom: 0;
  left: 10px;
}
</style>
