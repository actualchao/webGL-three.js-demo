<script type="text/ecmascript-6">
/**
 * Stats 性能检测工具
 */
import * as THREE from 'three'
import Stats from 'stats.js'

export default {
  // template: '<div ref="webgl" id="webgl-container"></div>',
  render: h => h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }),
  mounted () {
    // 初始化性能工具，
    // 在渲染前后调用begin/end方法
    this.stats = new Stats()
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = '10px'
    this.stats.dom.style.left = '10px'
    document.body.appendChild(this.stats.dom)
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom

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
      animate.call(this)

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

      function animate () {
        this.stats.begin()

        renderer.clear()
        /** */
        camera.position.x += 0.01
        renderer.render(scene, camera)

        this.stats.end()

        requestAnimationFrame(animate.bind(this))
      }
    }

  }
}
</script>
