
<template>
  <div ref="webgl" id="webgl-container">

  </div>
</template>

<script type="text/ecmascript-6">
import * as THREE from 'three'

export default {
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const dom = this.$refs.webgl
      let renderer
      let camera
      let scene
      let mesh

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
        camera = new THREE.PerspectiveCamera(70, dom.offsetWidth / dom.offsetHeight, 0.01, 10)
        camera.position.x = 0
        camera.position.y = 2
        camera.position.z = 2
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()
      }

      function initObject () {
        var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
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
