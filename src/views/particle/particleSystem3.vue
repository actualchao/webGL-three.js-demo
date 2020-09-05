
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
      this.$refs.webgl.appendChild(window.stats.dom)
      window.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    },
    init () {
      const dom = this.$refs.webgl
      let render
      let camera
      let scene
      let mesh
      let geometry
      let gui
      let material
      let group
      let light

      const width = 100
      const length = 100

      const guiData = {
        cameraX: 0,
        cameraY: -1,
        cameraZ: 10,
        rotationY: 0.3,
        rotationX: 0.42
      }

      async function createGui () {
        if (gui) return
        const dat = require('dat.gui')
        gui = new dat.GUI({ name: 'my-GUI' })

        gui.add(guiData, 'cameraX', -10, 20).name('相机位置X').step(0.1)
        gui.add(guiData, 'cameraY', -20, 20).name('相机位置Y').step(0.1)
        gui.add(guiData, 'cameraZ', -20, 20).name('相机位置Z').step(0.1)
        gui.add(guiData, 'rotationY', 0, Math.PI).name('rotationY').step(0.01)
        gui.add(guiData, 'rotationX', 0, Math.PI).name('rotationX').step(0.01)
      }

      function initThree () {
        render = new THREE.WebGLRenderer({ antialias: true })
        render.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(render.domElement)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
        camera.lookAt(0, 0, 0)
      }

      const initLight = () => {
        // light = new THREE.DirectionalLight(0xffffff, 1)
        // light.position.set(10, 10, 10)
        // scene.add(light)

        light = new THREE.AmbientLight(0xffffff)
        scene.add(light)

        // light = new THREE.PointLight(0xfffff, 0, 100, 0)
        // light.position.set(5, 5, 5)
        // scene.add(light)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        const createMesh = (color, offsetX) => {
          geometry = new THREE.BufferGeometry()
          var numPoints = width * length

          var positions = new Float32Array(numPoints * 3)
          var colors = new Float32Array(numPoints * 3)

          let k = 0

          for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
              var u = i / width
              var v = j / length
              var x = u - 0.5
              var y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20
              var z = v - 0.5

              positions[3 * k] = x
              positions[3 * k + 1] = y
              positions[3 * k + 2] = z

              var intensity = (y + 0.1) * 5
              colors[3 * k] = color.r * intensity
              colors[3 * k + 1] = color.g * intensity
              colors[3 * k + 2] = color.b * intensity

              k++
            }
          }

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
          geometry.computeBoundingBox()

          material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, side: THREE.DoubleSide })

          mesh = new THREE.Points(geometry, material)

          mesh.scale.set(15, 12, 36)
          mesh.position.set(offsetX, 0, 0)

          return mesh
        }

        const mesh1 = createMesh(new THREE.Color(0, 1, 1), -15)
        const mesh2 = createMesh(new THREE.Color(0, 1, 1), 0)
        const mesh3 = createMesh(new THREE.Color(0, 1, 1), 15)

        group = new THREE.Object3D()

        group
          .add(mesh1)
          .add(mesh2)
          .add(mesh3)

        // var axesHelper = new THREE.AxesHelper(5)
        scene.add(group /** axesHelper */)
      }

      let mathI = 0

      function animate () {
        window.stats.begin()
        camera.position.set(guiData.cameraX, guiData.cameraY, guiData.cameraZ)
        group.rotation.x = guiData.rotationX
        group.rotation.y = guiData.rotationY
        camera.updateMatrix()

        let k = 0

        for (let i = 0; i < width; i++) {
          for (let j = 0; j < length; j++) {
            var u = i / width
            var v = j / length
            var y = (Math.cos(u * Math.PI * 4 + mathI) + Math.sin(v * Math.PI * 8 + mathI)) / 20

            group.children.forEach(child => {
              child.geometry.attributes.position.array[3 * k + 1] = y
              child.geometry.attributes.position.needsUpdate = true
            })

            k++
          }
        }

        mathI += 0.03 * Math.random()

        render.render(scene, camera)
        requestAnimationFrame(animate)
        window.stats.end()
      }

      createGui()
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
