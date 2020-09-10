<script type="text/ecmascript-6">
/**
 * 几何模型旋转中心不在几何中心，借助载体实现旋转中心和几何中心重叠
 */
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

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
      let group

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
        camera = new THREE.PerspectiveCamera(70, dom.offsetWidth / dom.offsetHeight, 0.01, 200)
        camera.position.x = 0
        camera.position.y = 20
        camera.position.z = 20
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        const loader = new OBJLoader()
        loader.setPath('/modal/obj3/').load('Model.obj', geometry => {
          geometry = geometry.children[0].geometry
          var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
          const mesh = new THREE.Mesh(geometry, material)

          mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.02

          const boxHelper = new THREE.BoxHelper(mesh)

          // mesh.position.x -= center.x
          // mesh.position.y -= center.y
          // mesh.position.z -= center.z

          group = new THREE.Object3D()
          group.add(mesh)

          //  记录几何中心
          const box = new THREE.Box3()
          box.setFromObject(mesh)
          // 把几何物体旋转中心由原点设置为几何中心
          box.center(mesh.position)
          // 几何反转设置几何中心到原点
          mesh.position.multiplyScalar(-1)
          // 把原来的中心赋值给载体
          box.center(group.position)

          const axesHelper = new THREE.AxesHelper(100)
          const girdHelper = new THREE.GridHelper(100)
          scene.add(group).add(girdHelper).add(axesHelper).add(boxHelper)
        })
      }

      function animate () {
        flag && requestAnimationFrame(animate)
        // mesh.rotation.x += 0.01
        group && (group.rotation.y += 0.02)
        renderer.render(scene, camera)
      }
    }

  }
}
</script>
