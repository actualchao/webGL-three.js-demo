
<script type="text/ecmascript-6">
/**
 * tween插件
 * 封装的位置改变插件/支持链式调用
 */
import * as THREE from 'three'
import TWEEN from 'tween'

let flag = true
export default {
  beforeDestroy () { flag = false },
  created () { flag = true },
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
      let mesh
      let tween

      initThree()
      initCamera()
      initScene()
      initObject()
      initTween()
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
        camera.position.z = 2
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      }

      function initTween () {
        // 初始化tween
        tween = new TWEEN.Tween(camera.position)
        // 设置终点位置/时长
        // 链式调用
        tween.to({ x: 1 }, 2000).start()
      }

      function animate () {
        renderer.clear()
        flag && requestAnimationFrame(animate)
        renderer.render(scene, camera)
        TWEEN.update()
      }
    }

  }
}
</script>
