
<script type="text/ecmascript-6">
/* eslint-disable no-unused-vars */
/**
 * 在边长固定的立方体内绘制固定个数的随机三角形碎片
 * 色值选取固定顶点着色
 */
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { log } from 'three'

let flag = true
export default {
  beforeDestroy () { flag = false },
  created () { flag = true },
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
      const group = new THREE.Object3D()
      const meshChehe = []
      window.meshs = meshChehe
      window.group = group

      function initThree () {
        render = new THREE.WebGLRenderer({ antialias: true })
        render.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(render.domElement)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(50, dom.offsetWidth / dom.offsetHeight, -100, 100)
        camera.position.set(0, 150, 600)
        camera.lookAt(0, 0, 0)
      }

      const initLight = () => {
        let light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 50, 50)
        scene.add(light)

        light = new THREE.AmbientLight(0xffffff)
        scene.add(light)
      }

      function initScene () {
        scene = new THREE.Scene()

        const axesHelper = new THREE.AxesHelper(350)
        scene.add(group).add(axesHelper)
      }

      function initObject () {
        // 地面网格
        const girdGeo = new THREE.PlaneBufferGeometry(2000, 700, 60, 40)
        const girdMar = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 })
        const girdMesh = new THREE.Points(girdGeo, girdMar)
        girdMesh.rotation.x = -Math.PI / 2
        group.add(girdMesh)

        // 获取模型点数数据
        function combineBuffer (model, bufferName) {
          let itemSize = 3
          let count = 0
          model.traverse(child => {
            if (child.isMesh) {
              count += child.geometry.attributes[bufferName].count
              itemSize = child.geometry.attributes[bufferName].itemSize
            }
          })

          const combined = new Float32Array(count * 3)

          let offset = 0
          model.traverse(child => {
            if (child.isMesh) {
              const array = child.geometry.attributes[bufferName].array
              combined.set(array, offset)
              offset += array.length
            }
          })

          return new THREE.BufferAttribute(combined, itemSize)
        }

        function addMesh (positions, scale, x, y, z, color, dynamic) {
          const material = new THREE.PointsMaterial({ size: 0.1, color })
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position', positions.clone())
          const mesh = new THREE.Points(geometry, material)

          mesh.scale.x = mesh.scale.y = mesh.scale.z = scale
          mesh.position.set(x, y, z)
          group.add(mesh)

          if (dynamic) {
            meshChehe.push({
              mesh,
              positions,
              direction: -1, // 1向上 -1向下
              delay: createMath(100) + 100,
              upDoneNum: 0
            })
          }
        }

        function createMath (n) {
          return (Math.random() * 2 - 1) * n
        }
        function createColor () {
          return new THREE.Color(Math.random(), Math.random(), Math.random())
        }
        function createScale (r, n) {
          return parseFloat(Math.random() * (n - r) + r) / 10
        }

        const loader = new OBJLoader()
        loader.setPath('/three-page/modal/obj1/').load('male.obj', model => {
          const positions = combineBuffer(model, 'position')
          for (let i = 0; i < 10; i++) {
            addMesh(positions, createScale(6, 10), createMath(300), 0, createMath(250), createColor(), true)
          }
          for (let i = 0; i < 30; i++) {
            addMesh(positions, createScale(4, 6), createMath(400), 0, createMath(300), 0x333333, false)
          }
        })
      }

      function animate () {
        renderThree()
        flag && requestAnimationFrame(animate)
      }

      function renderThree () {
        function createMath (n) {
          return (Math.random() * 2 - 1) * n
        }

        window.stats.begin()

        for (let i = 0; i < meshChehe.length; i++) {
          const data = meshChehe[i]
          const positions = data.mesh.geometry.attributes.position
          const count = positions.count

          if (data.doneNum >= count) {
            data.doneNum = 0
            data.direction *= -1
            data.delay = createMath(100) + 100
          }

          if (data.delay > 0) {
            data.delay -= 1
          } else {
            data.doneNum = 0
            for (let i = 0; i < count; i++) {
              const px = positions.getX(i)
              const py = positions.getY(i)
              const pz = positions.getZ(i)

              if (data.direction === -1) {
                if (py > 0) {
                  data.mesh.geometry.attributes.position.setXYZ(
                    i,
                    px + 1.5 * (0.50 - Math.random()),
                    py + 3.0 * (0.25 - Math.random()),
                    pz + 1.5 * (0.50 - Math.random())
                  )
                } else {
                  data.doneNum += 1
                }
              }

              if (data.direction === 1) {
                var ix = data.positions.getX(i)
                var iy = data.positions.getY(i)
                var iz = data.positions.getZ(i)

                var dx = Math.abs(px - ix)
                var dy = Math.abs(py - iy)
                var dz = Math.abs(pz - iz)

                var d = dx + dy + dx

                if (d > 1) {
                  positions.setXYZ(
                    i,
                    px - (px - ix) / dx * (0.85 - Math.random()),
                    py - (py - iy) / dy * (1 + Math.random()),
                    pz - (pz - iz) / dz * (0.85 - Math.random())
                  )
                } else {
                  data.doneNum += 1
                }
              }
            }
          }

          positions.needsUpdate = true
        }

        scene.rotation.y += 0.005

        render.render(scene, camera)
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
