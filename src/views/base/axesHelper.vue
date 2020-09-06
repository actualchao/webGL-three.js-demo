
<script type="text/ecmascript-6">
/**
 * 坐标系辅助工具，生成辅助坐标系
 * 创建Object3D 类，作为group，把3D实例添加到group上实现分组
 *
 * AxesHelper
 * size?: number //坐标轴长度
 *
 */
import * as THREE from 'three'

export default {
  // template: '<div ref="webgl" id="webgl-container"></div>',
  render: h => h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }),
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let objectGroup

      initThree()
      initCamera()
      initScene()
      initObject()
      animate()

      function initThree () {
        renderer = new THREE.WebGLRenderer({
          antialias: true // 抗锯齿
        })
        renderer.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(renderer.domElement)
        renderer.setClearColor('0xFFFFFF', 1.0)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(70, dom.offsetWidth / dom.offsetHeight, 0.01, 10)
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 1
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const mesh = new THREE.Mesh(geometry, material)

        var axesHelper = new THREE.AxesHelper(5)

        objectGroup = new THREE.Object3D()
        objectGroup.add(mesh)
        objectGroup.add(axesHelper)

        scene.add(objectGroup)
      }

      function animate () {
        renderer.clear()
        objectGroup.rotation.x += 0.01
        objectGroup.rotation.y += 0.02
        renderer.render(scene, camera)

        /** 渲染循环 */
        requestAnimationFrame(animate)
      }
    }

  }
}
</script>
