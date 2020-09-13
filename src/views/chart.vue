<script type="text/ecmascript-6">
/* eslint-disable no-unused-vars */
/**
 *
 */
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { log } from 'three'

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
      let mesh
      initThree()
      initCamera()
      initScene()
      initObject()
      animate()

      function initThree () {
        renderer = new THREE.WebGLRenderer({
          antialias: true, // 抗锯齿
          alpha: true
        })
        renderer.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(renderer.domElement)
        renderer.setClearColor(0xEEEEEE, 0.0)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(35, dom.offsetWidth / dom.offsetHeight, 0.01, 200)
        camera.position.x = 0
        camera.position.y = -55
        camera.position.z = 20
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        const light = new THREE.DirectionalLight(0xfffff, 1)
        light.position.set(30, 10, 10)

        const light2 = new THREE.AmbientLight(0xffffff, 0.3)
        scene = new THREE.Scene()
        scene.add(light).add(light2)
      }

      function initObject () {
        const data = [
          { value: 12 }, { value: 25 },
          { value: 42 }, { value: 22 },
          { value: 19 }
        ]

        const colors = [0x1BD6B7, 0x2773D8, 0xDBCA43, 0x1BD6B7, 0x63D0FF]

        const count = data.reduce((prev, item, index, data) => { return prev + item.value }, 0)
        console.log(count)

        let startPre = -0.01

        const group = new THREE.Object3D()
        data.forEach((item, index) => {
          item.count = count
          item.precent = item.value / count

          addFn(startPre, startPre + item.precent, index)

          startPre += item.precent
        })

        function addFn (startPre, endPre, color, innerRadius = 16, outRadius = 20, height = 1) {
          height = color % 4 + 1

          const startAngle = startPre * 2 * Math.PI
          const endAngle = endPre * 2 * Math.PI
          const precent = innerRadius / outRadius

          const x1 = Math.cos(startAngle) * innerRadius
          const y1 = Math.sin(startAngle) * innerRadius

          const x2 = x1 / precent
          const y2 = y1 / precent

          const x3 = Math.cos(endAngle) * innerRadius
          const y3 = Math.sin(endAngle) * innerRadius

          const extrudeSettings = { curveSegments: 24, depth: height, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 1 }

          var shape = new THREE.Shape()
          shape.moveTo(x1, y1)
            .lineTo(x2, y2)
            .absarc(0, 0, outRadius, startAngle, endAngle, false)
            .lineTo(x3, y3)
            .absarc(0, 0, innerRadius, endAngle, startAngle, true)
          // var points = path.getPoints()

          // console.log(points)

          var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)

          geometry.computeFaceNormals()
          console.log(color)
          var material = new THREE.MeshLambertMaterial({ color: colors[color % colors.length], side: THREE.DoubleSide })
          mesh = new THREE.Mesh(geometry, material)

          group.add(mesh)
        }

        const axesHelper = new THREE.AxesHelper(20)
        scene.add(group)
          .add(axesHelper)
      }

      function animate () {
        flag && requestAnimationFrame(animate)
        // mesh.rotation.x += 0.01
        // mesh.rotation.x += 0.01
        renderer.render(scene, camera)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
#webgl-container{
  width: 500px !important;
  height: 300px !important;
  border: 1px solid #ff00ff;
}

</style>
