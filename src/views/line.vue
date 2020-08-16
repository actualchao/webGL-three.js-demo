
<script type="text/ecmascript-6">
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
      let render
      let camera
      let scene

      initThree()
      initCamera()
      initScene()
      initObject()
      animate()

      function initThree () {
        render = new THREE.WebGLRenderer({ antialias: true })
        render.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(render.domElement)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 0.01, 1000)
        camera.position.set(0, 0, 100)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        // create a blue LineBasicMaterial
        var material = new THREE.LineBasicMaterial({ vertexColors: true })
        var points = []
        points.push(new THREE.Vector3(-10, 0, 0))
        points.push(new THREE.Vector3(10, 0, 0))
        points.push(new THREE.Vector3(0, 10, 0))

        var colors = []
        colors.push(new THREE.Color('rgb(255,23,23)'))
        colors.push(new THREE.Color('rgb(23,255,23)'))
        colors.push(new THREE.Color('rgb(23,23,255)'))

        var geometry = new THREE.Geometry()
        points.forEach(point => {
          geometry.vertices.push(point)
        })
        colors.forEach(color => {
          geometry.colors.push(color)
        })

        var line = new THREE.Line(geometry, material)
        scene.add(line)
      }

      function animate () {
        requestAnimationFrame(animate)
        render.render(scene, camera)
      }
    }

  }
}
</script>
