<script type="text/ecmascript-6">
/**
 * 方向光，平行光
 * THREE.DirectionalLight
 * @param {} color 十六进制颜色
 * @param {} intensity 光强度 0-1之间
 *
 * 环境光，只有颜色
 * THREE.AmbientLiht
 * @param {} color 十六进制颜色
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
    this.init('directionalLight')
    this.init('ambientLight')
  },
  methods: {
    init (lightType) {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let mesh
      let light
      let gui
      const guiData = { fov: 45, lightX: 5, lightY: 5, lightZ: 5, intensity: 0.8, ratateX: 0, ratateY: 0, ratateZ: 0 }

      const createGui = async () => {
        if (gui) return
        const dat = require('dat.gui')
        gui = gui = new dat.GUI({ name: 'my-GUI' })
        gui.add(guiData, 'fov', 0, 90).name('视角')
        gui.add(guiData, 'lightX', -100, 100).name('光源X')
        gui.add(guiData, 'lightY', -100, 100).name('光源Y')
        gui.add(guiData, 'lightZ', -100, 100).name('光源Z')
        gui.add(guiData, 'intensity', 0, 1).name('光源强度')
        gui.add(guiData, 'ratateX', 0, 3.14).name('旋转角度X')
        gui.add(guiData, 'ratateY', 0, 3.14).name('旋转角度Y')
        gui.add(guiData, 'ratateZ', 0, 3.14).name('旋转角度Z')
      }

      const initThree = () => {
        renderer = new THREE.WebGLRenderer({
          antialias: true // 抗锯齿
        })
        renderer.setSize(dom.offsetWidth * 0.5, dom.offsetHeight)
        dom.appendChild(renderer.domElement)
        renderer.setClearColor(0xffffff, 1.0)
      }
      const initCamera = () => {
        camera = new THREE.PerspectiveCamera(guiData.fov, dom.offsetWidth * 0.5 / dom.offsetHeight, 0.01, 10)
        camera.position.x = 0
        camera.position.y = 2
        camera.position.z = 5
        camera.lookAt(0, 0, 0)
      }

      const initScene = () => {
        scene = new THREE.Scene()
      }

      const initDirectionalLight = () => {
        light = new THREE.DirectionalLight(0xff0000, guiData.intensity)
        light.position.set(guiData.lightX, guiData.lightY, guiData.lightZ)
        scene.add(light)
      }

      const initAmbientLight = () => {
        light = new THREE.AmbientLight(0xff0000)
        scene.add(light)
      }

      const initObject = () => {
        var geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20, 1, false)
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })

        mesh = new THREE.Mesh(geometry, material)

        var axesHelper = new THREE.AxesHelper(2)
        scene.add(mesh, axesHelper)
      }

      const animate = () => {
        renderer.clear()
        requestAnimationFrame(animate)
        // 根据gui参数调整相机fov
        camera.fov = guiData.fov
        camera.updateProjectionMatrix()
        light.position.set(guiData.lightX, guiData.lightY, guiData.lightZ)
        light.intensity = guiData.intensity
        light.color.setHex('0x' + this.color.slice(1, 8))

        mesh.rotation.x = guiData.ratateX
        mesh.rotation.y = guiData.ratateY
        mesh.rotation.z = guiData.ratateZ
        renderer.render(scene, camera)
      }

      createGui()
      initThree()
      initCamera()
      initScene()
      lightType === 'directionalLight' && initDirectionalLight()
      lightType === 'ambientLight' && initAmbientLight()
      initObject()
      animate()
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
