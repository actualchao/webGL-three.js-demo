<script type="text/ecmascript-6">
/**
 *
 */
import * as THREE from 'three'
import { ParallaxBarrierEffect } from 'three/examples/jsm/effects/ParallaxBarrierEffect'

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
      document.addEventListener('mousemove', onDocumentMouseMove, false)

      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      // let mesh
      let textureCube
      let effect

      const spheres = []

      let mouseX = 0
      let mouseY = 0

      let windowHalfX = dom.offsetWidth / 2
      let windowHalfY = dom.offsetHeight / 2

      initThree()
      initCamera()
      initScene()
      initObject()
      animate()

      function initThree () {
        renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        // renderer.setSize(dom.offsetWidth, dom.offsetHeight)
        dom.appendChild(renderer.domElement)

        effect = new ParallaxBarrierEffect(renderer)
        effect.setSize(dom.offsetWidth || 2, dom.offsetHeight || 2)

        window.addEventListener('resize', onWindowResize, false)
      }
      function initCamera () {
        camera = new THREE.PerspectiveCamera(60, dom.offsetWidth / dom.offsetHeight, 0.01, 100)
        camera.position.z = 3
        camera.focalLength = 3
      }

      function initScene () {
        var path = '/three-page/images/cobeBack/'
        var format = '.jpg'
        var urls = [
          path + 'p1' + format, path + 'p3' + format,
          path + 'top' + format, path + 'bottom' + format,
          path + 'p4' + format, path + 'p2' + format
        ]

        textureCube = new THREE.CubeTextureLoader().load(urls)

        scene = new THREE.Scene()
        scene.background = textureCube
      }

      function initObject () {
        var geometry = new THREE.SphereBufferGeometry(0.1, 32, 16)
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube })

        for (var i = 0; i < 200; i++) {
          var mesh = new THREE.Mesh(geometry, material)

          mesh.position.x = Math.random() * 10 - 5
          mesh.position.y = Math.random() * 10 - 5
          mesh.position.z = Math.random() * 10 - 5

          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1

          scene.add(mesh)

          spheres.push(mesh)
        }
      }

      function onWindowResize () {
        windowHalfX = dom.offsetWidth / 2
        windowHalfY = dom.offsetHeight / 2

        camera.aspect = dom.offsetWidth / dom.offsetHeight
        camera.updateProjectionMatrix()

        effect.setSize(dom.offsetWidth, dom.offsetHeight)
      }

      function onDocumentMouseMove (event) {
        mouseX = (event.clientX - windowHalfX) / 100
        mouseY = (event.clientY - windowHalfY) / 100
      }

      function animate () {
        flag && requestAnimationFrame(animate)

        var timer = 0.0001 * Date.now()

        camera.lookAt(scene.position)
        camera.position.x += (mouseX - camera.position.x) * 0.05
        camera.position.y += (-mouseY - camera.position.y) * 0.05

        for (var i = 0, il = spheres.length; i < il; i++) {
          var sphere = spheres[i]

          sphere.position.x = 5 * Math.cos(timer + i)
          sphere.position.y = 5 * Math.sin(timer + i * 1.1)
        }

        effect.render(scene, camera)
      }
    }

  }
}
</script>
