
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
        camera = new THREE.PerspectiveCamera(12, dom.offsetWidth / dom.offsetHeight, -250, 1000)
        camera.position.set(300, 20, 1000)
        camera.lookAt(0, -100, -1000)
      }

      const initLight = () => {
        let light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(150, 150, 150)
        scene.add(light)

        light = new THREE.AmbientLight(0xffffff)
        scene.add(light)
      }

      function initScene () {
        scene = new THREE.Scene()
        scene.position.x = -250
        scene.position.y = -150
      }

      function initObject () {
        const L = 15000// 长X
        const W = 15000// 宽Z
        // const H = 200// 高Y

        const stepL = 200 // X间隔
        const stepW = 250// Y间隔
        // const stepH = 50// Z间隔

        const computedArr = (n, step) => {
          let j = 0
          const arr = []
          while (j <= n) {
            arr.push(j - n / 2)
            j += step
          }
          return arr
        }

        const arrL = computedArr(L, stepL)
        const arrW = computedArr(W, stepW)
        // const arrH = computedArr(H, stepH)

        console.log(arrL, arrW)

        geometry = new THREE.BufferGeometry()

        const count = arrL.length * arrW.length

        const vertices = new Float32Array(count * 3)// count个点XYZ
        const colors = new Float32Array(count * 3)// count个点XYZ

        arrL.forEach((l, lIdx) => {
          arrW.forEach((w, wIdx) => {
            vertices[(lIdx * arrL.length + wIdx) * 3 + 0] = l
            vertices[(lIdx * arrL.length + wIdx) * 3 + 1] = 0
            vertices[(lIdx * arrL.length + wIdx) * 3 + 2] = w

            colors[(lIdx * arrL.length + wIdx) * 3 + 0] = l / L + 0.5
            colors[(lIdx * arrL.length + wIdx) * 3 + 1] = 0.9
            colors[(lIdx * arrL.length + wIdx) * 3 + 2] = w / W + 0.5
          })
        })

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        window.geometry = geometry
        material = new THREE.PointsMaterial({ size: 30, vertexColors: true })

        // var axesHelper = new THREE.AxesHelper(200)

        mesh = new THREE.Points(geometry, material)
        scene.add(mesh /** axesHelper */)
      }

      let mathI = 0

      function animate () {
        window.stats.begin()

        const count = geometry.attributes.position.count

        for (let i = 1; i < count * 3; i += 3) {
          geometry.attributes.position.array[i] = 45 * Math.sin(i / 3 + mathI)
        }
        geometry.attributes.position.needsUpdate = true

        mathI += 0.03
        render.render(scene, camera)
        mesh.rotation.y = 0.25 * Math.PI
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
