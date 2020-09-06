<script type="text/ecmascript-6">
/**
 *
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
      let renderer
      let camera
      let scene
      let intersected
      // const group = new THREE.Object3D()
      const raycaster = new THREE.Raycaster()
      // const mouse = new THREE.Vector2()

      let mouseX = 0
      let mouseY = 0

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
        camera = new THREE.PerspectiveCamera(70, dom.offsetWidth / dom.offsetHeight, 0.01, 100)
        camera.position.x = 0
        camera.position.y = 2
        camera.position.z = 10
        camera.lookAt(0, 0, 0)
      }

      function initScene () {
        scene = new THREE.Scene()

        const light1 = new THREE.DirectionalLight(0xffffff, 1)
        light1.position.set(10, 10, 10).normalize()
        const light2 = new THREE.DirectionalLight(0xffffff, 1)
        light2.position.set(-10, 10, 10).normalize()
        scene.add(light1).add(light2)

        window.addEventListener('mousemove', onMouseMove, false)
      }

      function onMouseMove (event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouseX = ((event.clientX - 200) / dom.offsetWidth) * 2 - 1
        mouseY = -(event.clientY / dom.offsetHeight) * 2 + 1
      }
      function initObject () {
        for (let i = 0; i < 200; i++) {
          const geometry = new THREE.BoxGeometry(Math.random(), Math.random(), Math.random())
          geometry.computeVertexNormals()
          const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()), side: THREE.DoubleSide })
          const mesh = new THREE.Mesh(geometry, material)

          mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)

          scene.add(mesh)
        }
        // scene.add(group)
        // scene.add(group)

        console.log(scene)
      }

      let oldColor
      function animate () {
        requestAnimationFrame(animate)

        // console.log({ x: mouseX, y: mouseY })

        raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera)
        var intersects = raycaster.intersectObjects(scene.children)
        const object = intersects[0]
        if (object) {
          // eslint-disable-next-line eqeqeq
          if ((intersected && intersected.object.uuid) != object.object.uuid) {
            console.log(123)
            if (intersected) {
              intersected.object.material.color = new THREE.Color(parseInt(`0x${oldColor}`))
            }
            intersected = object
            oldColor = object.object.material.color.getHex()
            console.log(oldColor)
            object.object.material.color.set(0xff0000)
          } else {
            // intersected = null
          }
        }

        scene.rotation.y += 0.001

        renderer.render(scene, camera)
      }
    }

  }
}
</script>
