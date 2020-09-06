
<script type="text/ecmascript-6">
/**
 * 在边长固定的立方体内绘制固定个数的随机三角形碎片
 * 色值选取固定顶点着色
 */
import * as THREE from 'three'

export default {
  render: h => h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }),
  async mounted () {
    await this.initStats()
    this.init()
  },
  methods: {
    async initStats () {
      // 初始化性能工具，
    // 在渲染前后调用begin/end方法
      const { default: Stats } = await import('stats.js')
      window.stats = new Stats()
      window.stats.dom.style.position = 'absolute'
      window.stats.dom.style.top = '10px'
      window.stats.dom.style.left = '10px'
      document.body.appendChild(window.stats.dom)
      window.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    },
    init () {
      const dom = this.$refs.webgl
      let render
      let camera
      let scene
      let mesh
      let geometry
      let material

      function initThree () {
        render = new THREE.WebGLRenderer({ antialias: true })
        render.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(render.domElement)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(50, dom.offsetWidth / dom.offsetHeight, -250, 250)
        camera.position.set(0, 0, 600)
      }

      const initLight = () => {
        let light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 250, 250)
        scene.add(light)

        light = new THREE.AmbientLight(0xffffff)
        scene.add(light)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        const n = 1000
        const count = 3000

        geometry = new THREE.BufferGeometry()

        const randomNum = (num) => { return Math.random() * num - num / 2 }
        const vertices = new Float32Array(count * 3)// 每个面三个点，每个点XYZ
        const colors = new Float32Array(count * 3)// 每个面三个点，每个点XYZ

        for (let i = 0; i < count; i++) {
          const po = [randomNum(n), randomNum(n), randomNum(n)]
          const color = [(po[0] / n + 0.5), (po[1] / n + 0.5), (po[2] / n + 0.5)]

          vertices[3 * i + 0] = po[0]
          vertices[3 * i + 1] = po[1]
          vertices[3 * i + 2] = po[2]

          colors[3 * i + 0] = color[0]
          colors[3 * i + 1] = color[1]
          colors[3 * i + 2] = color[2]
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        window.geometry = geometry
        material = new THREE.PointsMaterial({ size: 3, vertexColors: true })
        // var axesHelper = new THREE.AxesHelper(200)

        mesh = new THREE.Points(geometry, material)
        scene.add(mesh /** axesHelper */)
      }

      function animate () {
        window.stats.begin()
        render.render(scene, camera)
        mesh.rotation.x += 0.005
        mesh.rotation.y += 0.01
        requestAnimationFrame(animate)
        window.stats.end()
      }

      initThree()
      initCamera()
      initScene()
      initLight()
      initObject()
      animate.call(this)
    }

  }
}
</script>
