<script type="text/ecmascript-6">
/**
 * 圆柱体 ==> Three.CylinderGeometry
 * @param {*} radiusTop?: number,圆柱体上顶面半径
 * @param {*} radiusBottom?: number,圆柱体下平面半径
 * @param {*} height?: number,//圆柱体高度
 * @param {*} radiusSegments?: number,// 圆柱体圆弧分段数
 * @param {*} heightSegments?: number,//圆柱体高分段数
 * @param {*} openEnded?: boolean,// 是否开口
 * @param {*} thetaStart?: number, //圆弧第一段开始点，默认为0 ，三点钟方向
 * @param {*} thetaLength?: number，//圆弧角度，默认值为2 * Pi，表示完整的圆柱体。
 */

import * as THREE from 'three'
export default {
  // template: '<div ref="webgl" id="webgl-container"></div>',
  render: h => h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }),
  mounted () {
    this.init()
  },
  methods: {
    init (a, b) {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let mesh
      let light

      initThree()
      initCamera()
      initScene()
      initLight()
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
        camera = new THREE.PerspectiveCamera(70, dom.offsetWidth / dom.offsetHeight, 0.01, 10)
        camera.position.x = 1
        camera.position.y = 2
        camera.position.z = 5
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initLight () {
        light = new THREE.DirectionalLight(0xff0000, 2)
        light.position.set(1, 1, 1)
        scene.add(light)
      }

      function initObject () {
        var geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20, 1, false)
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })

        mesh = new THREE.Mesh(geometry, material)

        var axesHelper = new THREE.AxesHelper(2)
        scene.add(mesh, axesHelper)
      }

      function animate () {
        renderer.clear()
        requestAnimationFrame(animate)
        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.02
        renderer.render(scene, camera)
      }
    }

  }
}
</script>
