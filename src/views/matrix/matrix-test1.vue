<script type="text/ecmascript-6">
/**
 * 自行计算矩阵
 * 设置了自行计算矩阵，那么设置几何的position rotation 等未知参数将失效
 *
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let flag = true
export default {
  beforeDestroy () { flag = false },
  created () { flag = true },
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
      let controls

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
        camera = new THREE.PerspectiveCamera(23, dom.offsetWidth / dom.offsetHeight, 0.01, 200)
        camera.position.x = 0
        camera.position.y = 20
        camera.position.z = 20
        camera.lookAt(0, 0, 0)

        controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 0.5, 0)

        // controls.autoRotate = true;

        controls.update()
        controls.enablePan = false
        controls.enableDamping = true
      }

      function initScene () {
        scene = new THREE.Scene()

        const light = new THREE.DirectionalLight(0xff0000, 1)
        light.position.set(2, 2, 2)
        scene.add(light)
      }

      function initObject () {
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
        const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5)

        const metrail = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.9, 0.55, 0.4) })

        const boxMesh = new THREE.Mesh(boxGeometry, metrail)
        const sphereMesh = new THREE.Mesh(sphereGeometry, metrail)
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, metrail)

        // boxMesh.visible = false
        // sphereMesh.visible = false

        // 关闭自动矩阵计算
        boxMesh.matrixAutoUpdate = false
        sphereMesh.matrixAutoUpdate = false
        cylinderMesh.matrixAutoUpdate = false

        // box 不动不计算矩阵
        // 接着，我创建了一个平移矩阵并把它应用到了球对象上。
        var sphereMatrix = new THREE.Matrix4().makeTranslation(0.0, 1.0, 0.0)
        sphereMesh.applyMatrix(sphereMatrix)

        // 在圆柱体上，我clone了球的矩阵信息，旋转-90度 。并在此基础上又创建了一个新的平移矩阵，圆柱体将移动1.75。
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(0.5 * Math.PI)
        const cylinderMatrix = sphereMatrix.clone().multiply(rotationMatrix)
        cylinderMatrix.multiply(new THREE.Matrix4().makeTranslation(0, 1, 0))

        // 创建一个逆矩阵
        var inverseMatrix = new THREE.Matrix4()
        inverseMatrix.getInverse(rotationMatrix)

        // 乘逆矩阵表示的是相反的变换。
        cylinderMatrix.multiply(inverseMatrix)
        // 再次平移转换
        cylinderMatrix.multiply(new THREE.Matrix4().makeTranslation(0, 1, 0))
        cylinderMesh.applyMatrix(cylinderMatrix)

        const helper = new THREE.AxesHelper(10)
        scene.add(boxMesh).add(sphereMesh).add(cylinderMesh).add(helper)
      }

      function animate () {
        controls.update()
        flag && requestAnimationFrame(animate)
        // mesh.rotation.x += 0.01
        group && (group.rotation.y += 0.02)
        renderer.render(scene, camera)
      }
    }

  }
}
</script>
