
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
        camera.position.set(0, 0, 1000)
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
        const n = 400
        const r = 12
        const count = 10000

        geometry = new THREE.BufferGeometry()

        const randomNum = (num) => { return Math.random() * num - num / 2 }
        const vertices = new Float32Array(count * 3 * 3)// 每个面三个点，每个点XYZ
        const normals = new Float32Array(count * 3 * 3)// 每个面三个点，每个点XYZ
        const colors = new Float32Array(count * 3 * 3)// 每个面三个点，每个点XYZ

        let baseP = [randomNum(n), randomNum(n), randomNum(n)]
        for (let i = 0; i < count; i++) {
          const po = [[], [], []]
          const color = []

          let j = 0
          while (j < 3) { //  循环生成XYZ
            po[0][j] = baseP[j] + randomNum(r)
            po[1][j] = baseP[j] + randomNum(r)
            po[2][j] = baseP[j] + randomNum(r)

            color[j] = baseP[j] / n + 0.5

            // // 9*i第几个面 0,3,6 面的三个点的数据开始索引
            // vertices[9 * i + 0 + j] = pa[j]
            // vertices[9 * i + 3 + j] = pb[j]
            // vertices[9 * i + 6 + j] = pc[j]

            j++
          }
          const na = new THREE.Vector3(...po[0])
          const nb = new THREE.Vector3(...po[1])
          const nc = new THREE.Vector3(...po[2])

          const ab = new THREE.Vector3()
          const ac = new THREE.Vector3()

          ab.subVectors(na, nb)
          ac.subVectors(na, nc)

          ab.cross(ac)
          ab.normalize()

          const nor = [ab.x, ab.y, ab.z]

          let k = 0
          while (k < 9) {
            const idx1 = parseInt(k / 3)
            const idx2 = k % 3

            vertices[9 * i + k] = po[idx1][idx2]
            normals[9 * i + k] = nor[idx2]
            colors[9 * i + k] = color[idx2]
            k++
          }

          baseP = [randomNum(n), randomNum(n), randomNum(n)]
        }

        console.log(vertices)

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        geometry.setAttribute('normals', new THREE.BufferAttribute(normals, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        // geometry.setAttribute('normals')
        // geometry.setAttribute('uvs', verrices)

        window.geometry = geometry
        material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, vertexColors: true })
        var axesHelper = new THREE.AxesHelper(200)

        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh, axesHelper)
      }

      function animate () {
        window.stats.begin()
        render.render(scene, camera)
        mesh.rotation.x += 0.01
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
