<script type="text/ecmascript-6">
/**
 * dat.GUI 调整参数的GUI 插件
 * npm install --save dat.gui
 *
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
    init (a, b) {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let mesh
      let light
      let gui
      const guiData = { fov: 45 }

      createGui()
      initThree()
      initCamera()
      initScene()
      initLight()
      initObject()
      animate()

      async function createGui () {
        if (gui) return
        const dat = require('dat.gui')
        gui = new dat.GUI({ name: 'my-GUI' })
        gui.add(guiData, 'fov', 0, 90).name('视角')
      }

      function initThree () {
        renderer = new THREE.WebGLRenderer({
          antialias: true // 抗锯齿
        })
        renderer.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(renderer.domElement)
        renderer.setClearColor(0xffffff, 1.0)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(guiData.fov, dom.offsetWidth / dom.offsetHeight, 0.01, 10)
        camera.position.x = 1
        camera.position.y = 2
        camera.position.z = 5
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initLight () {
        light = new THREE.DirectionalLight(0xff0000, 2)
        light.position.set(1, 1, 1)
        scene.add(light)
      }

      function initObject () {
        var geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20, 1, false)
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })

        mesh = new THREE.Mesh(geometry, material)

        var axesHelper = new THREE.AxesHelper(2)
        scene.add(mesh, axesHelper)
      }

      function animate () {
        renderer.clear()
        flag && requestAnimationFrame(animate)
        // 根据gui参数调整相机fov
        camera.fov = guiData.fov
        camera.updateProjectionMatrix()

        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.02
        renderer.render(scene, camera)
      }
    }

  }
}
</script>
