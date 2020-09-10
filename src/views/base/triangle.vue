
<script type="text/ecmascript-6">
/**
 * triangle 三角形
 * 使用geometry 顶点绘制三角形，
 * 使用geometry face 面索引创建三角形面
 * 使用face 的顶点着色器着色
 */

import * as THREE from 'three'
export default {
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
      let geometry

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
        camera.position.set(0, 0, 30)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        const aa = () => { return parseInt(10 * Math.random() + 1) }
        geometry = new THREE.Geometry()
        geometry.vertices = ([1, 2, 3].map(idx => {
          return new THREE.Vector3(aa(), aa(), 0)
        }))

        geometry.faces.push(new THREE.Face3(0, 1, 2, new THREE.Vector3(0, 0, 1)))

        var colors = []
        colors.push(new THREE.Color('rgb(255,23,23)'))
        colors.push(new THREE.Color('rgb(23,255,23)'))
        colors.push(new THREE.Color('rgb(23,23,255)'))

        geometry.colors = colors

        geometry.faces[0].vertexColors = colors

        // geometry.computeFaceNormals()
        // geometry.computeVertexNormals()

        var meterial = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })

        console.log(geometry)
        var axesHelper = new THREE.AxesHelper(11)

        scene.add(new THREE.Mesh(geometry, meterial), axesHelper)
      }

      function animate () {
        render.render(scene, camera)
      }
    }

  }
}
</script>
