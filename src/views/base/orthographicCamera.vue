<script type="text/ecmascript-6">
/**
 * 正投影相机
 * OrthographicCamera
 *
 * left: number,//视窗左边
 * right: number,//视窗右边
 * top: number,// 视窗上
 * bottom: number,//视窗下
 * near?: number,// 近平面
 * far?: number// 远平面
 */
import * as THREE from 'three'

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
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 400)
        camera.position.x = 0 // 相机位置
        camera.position.y = 0
        camera.position.z = 1
        camera.up.x = 1 // 相机旋转上方向指向，相当于在相机屏幕平面内指向哪儿
        camera.up.y = 0
        camera.up.z = 0
        camera.lookAt(0, 0, 0)// 相机看向哪儿
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        var geometry = new THREE.BoxGeometry(0.5, 1, 0.5)
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      }

      function animate () {
        renderer.clear()
        flag && requestAnimationFrame(animate)

        // mesh.rotation.y += 0.01
        // mesh.rotation.x += 0.01
        renderer.render(scene, camera)
      }
    }

  }
}
</script>
