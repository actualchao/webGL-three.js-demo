<script type="text/ecmascript-6">
/**
 *
 */
import * as THREE from 'three'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let flag = true
let renderer, camera, scene, model, controls, skeneton
let idleAction, runAction, walkAction
let idleWeight, walkWeight, runWeight
let mixer, actions, clock
let guiSetting
let singleMode, singleModeSize
const controlArr = []


export default {
  beforeDestroy () { flag = false },
  created () { flag = true },
  render: h => h('div', { ref: 'webgl', attrs: { id: 'webgl-container' } }),
  mounted () {
    const dom = this.$refs.webgl
    initThree()
    initObject()

    function initThree () {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(dom.offsetWidth, dom.offsetHeight)
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.shadowMap.enabled = true
      dom.appendChild(renderer.domElement)

      clock = new THREE.Clock()


      camera = new THREE.PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000)
      camera.position.set(1, 2, -3)
      camera.lookAt(0, 1, 0)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0.5, 0)

      // controls.autoRotate = true;

      controls.update()
      controls.enablePan = false
      controls.enableDamping = true


      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xa0a0a0)
      scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)


      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 20, 0)
      scene.add(hemiLight)

      var dirLight = new THREE.DirectionalLight(0xffffff)
      dirLight.position.set(-3, 10, -10)
      dirLight.castShadow = true
      dirLight.shadow.camera.top = 2
      dirLight.shadow.camera.bottom = -2
      dirLight.shadow.camera.left = -2
      dirLight.shadow.camera.right = 2
      dirLight.shadow.camera.near = 0.1
      dirLight.shadow.camera.far = 40
      scene.add(dirLight)

      var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }))
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true

      const axesHelper = new THREE.AxesHelper()
      scene.add(mesh)
        .add(axesHelper)
    }



    /**
     * 初始化模型/动画混合器
     */
    function initObject () {
      const loader = new GLTFLoader()
      loader.load('models/Soldier.glb', handleObject)

      function handleObject (gltf) {
        window.gltf = gltf
        model = gltf.scene
        scene.add(model)
        // 投射阴影
        model.traverse(object3D => {
          if (object3D.isMesh) {
            object3D.castShadow = true
          }
        })

        skeneton = new THREE.SkeletonHelper(model)
        skeneton.visible = false
        scene.add(skeneton)


        const animationClips = gltf.animations

        mixer = new THREE.AnimationMixer(model)

        idleAction = mixer.clipAction(animationClips[0])
        runAction = mixer.clipAction(animationClips[1])
        walkAction = mixer.clipAction(animationClips[3])

        actions = [idleAction, runAction, walkAction]

        window.actions = actions


        createPanel()
        activeAllActions()
        animate()
      }
    }


    /**
     * 创建gui 面板
     */
    function createPanel () {
      const dat = require('dat.gui')
      var panel = new dat.GUI({ name: 'my-GUI', width: 310 })

      guiSetting = {
        'show model': true,
        'show skeleton': false,
        'active all': activeAllActions,
        'deActive all': deActiveAllActions,

        'pause/continue': pauseContinue,
        'make single step': makeSingleStep,
        'modify step size': 0.05,

        'from idle to walk': prepareCrossFade.bind(null, idleAction, walkAction, 1),
        'from walk to run': prepareCrossFade.bind(null, walkAction, runAction, 1),
        'from idle to run': prepareCrossFade.bind(null, idleAction, runAction, 1),
        'from run to walk': prepareCrossFade.bind(null, runAction, walkAction, 1),
        'use default duration': true,
        'set duration': 1,



        'modify idle weight': 1.0,
        'modify run weight': 0.0,
        'modify walk weight': 0.0,
        'modify post weight': 0.0,

        'idle time scale': 1,
        'run time scale': 1,
        'walk time scale': 1,
        'post time scale': 1
      }



      var folder1 = panel.addFolder('Visibility')
      var folder2 = panel.addFolder('Activation/Deactivation')
      var folder3 = panel.addFolder('Pausing/Stepping')
      var folder4 = panel.addFolder('Crossfading')
      var folder5 = panel.addFolder('Blend Weights')
      var folder6 = panel.addFolder('General Speed')

      folder1.add(guiSetting, 'show model').onChange((v) => { model.visible = v })
      folder1.add(guiSetting, 'show skeleton').onChange((v) => { skeneton.visible = v })

      folder2.add(guiSetting, 'active all')
      folder2.add(guiSetting, 'deActive all')

      folder3.add(guiSetting, 'pause/continue')
      folder3.add(guiSetting, 'make single step')
      folder3.add(guiSetting, 'modify step size', 0.01, 1)

      controlArr.push(folder4.add(guiSetting, 'from idle to walk'))
      controlArr.push(folder4.add(guiSetting, 'from walk to run'))
      controlArr.push(folder4.add(guiSetting, 'from idle to run'))
      controlArr.push(folder4.add(guiSetting, 'from run to walk'))

      controlArr.forEach(function (control) {
        control.classList1 = control.domElement.parentElement.parentElement.classList
        control.classList2 = control.domElement.previousElementSibling.classList
        control.setDisabled = function () {
          control.classList1.add('no-pointer-events')
          control.classList2.add('control-disabled')
        }

        control.setEnabled = function () {
          control.classList1.remove('no-pointer-events')
          control.classList2.remove('control-disabled')
        }
      })


      folder4.add(guiSetting, 'use default duration')
      folder4.add(guiSetting, 'set duration', 0.2, 2)


      folder5.add(guiSetting, 'modify idle weight', 0.0, 1.0).onChange(v => { setWeight(idleAction, guiSetting['modify idle weight']) }).listen()
      folder5.add(guiSetting, 'modify run weight', 0.0, 1.0).onChange(v => { setWeight(runAction, guiSetting['modify run weight']) }).listen()
      folder5.add(guiSetting, 'modify walk weight', 0.0, 1.0).onChange(v => { setWeight(walkAction, guiSetting['modify walk weight']) }).listen()

      folder6.add(guiSetting, 'idle time scale', 0.0, 1.0).onChange(v => { setScale(idleAction, guiSetting['idle time scale']) })
      folder6.add(guiSetting, 'run time scale', 0.0, 1.0).onChange(v => { setScale(runAction, guiSetting['run time scale']) })
      folder6.add(guiSetting, 'walk time scale', 0.0, 1.0).onChange(v => { setScale(walkAction, guiSetting['walk time scale']) })


      folder1.open()
      folder2.open()
      folder3.open()
      folder4.open()
      folder5.open()
      folder6.open()
    }

    function activeAllActions () {
      setWeight(idleAction, guiSetting['modify idle weight'])
      setWeight(runAction, guiSetting['modify run weight'])
      setWeight(walkAction, guiSetting['modify walk weight'])

      actions.forEach(action => { action.play() })
    }

    function deActiveAllActions () {
      actions.forEach(action => { action.stop() })
    }

    function setWeight (animationAction, weight) {
      animationAction.enabled = true
      animationAction.setEffectiveTimeScale(1)
      animationAction.setEffectiveWeight(weight)
    }

    function setScale (animationAction, scale) {
      animationAction.setEffectiveTimeScale(scale)
    }

    function updateSettingWeight () {
      guiSetting['modify idle weight'] = idleWeight
      guiSetting['modify run weight'] = runWeight
      guiSetting['modify walk weight'] = walkWeight
    }

    function unPauseAllActions () {
      actions.forEach(function (action) {
        action.paused = false
      })
    }

    function makeSingleStep () {
      unPauseAllActions()

      singleMode = true
      singleModeSize = guiSetting['modify step size']
    }

    function pauseContinue () {
      if (singleMode) {
        singleMode = false
        return
      }
      actions.forEach(action => { action.paused = !action.paused })
    }

    function prepareCrossFade (start, to, defaultDuration) {
      singleMode = false
      unPauseAllActions()
      if (start === idleAction) {
        crossFadeIn(start, to, defaultDuration)
      } else {
        synchronizeCrossFade(start, to, defaultDuration)
      }
      crossFadeIn(start, to, defaultDuration)
    }

    function synchronizeCrossFade (start, to, defaultDuration) {
      mixer.addEventListener('loop', onLoopFinished)

      function onLoopFinished (event) {
        if (event.action === start) {
          mixer.removeEventListener('loop', onLoopFinished)

          crossFadeIn(start, to, defaultDuration)
        }
      }
    }


    function crossFadeIn (start, to, defaultDuration) {
      const duration = guiSetting['use default duration'] ? defaultDuration : guiSetting['set duration']
      setWeight(to, 1)
      to.time = 0
      start.crossFadeTo(to, duration, true)
    }

    function updataControlsDisable () {
      controlArr.forEach(control => {
        control.setDisabled()
      })

      if (idleWeight === 1) {
        controlArr[0].setEnabled()
        controlArr[2].setEnabled()
      }

      if (walkWeight === 1) {
        controlArr[1].setEnabled()
      }

      if (runWeight === 1) {
        controlArr[3].setEnabled()
      }
    }


    // 渲染
    function render () {
      controls.update()

      idleWeight = idleAction.getEffectiveWeight()
      walkWeight = walkAction.getEffectiveWeight()
      runWeight = runAction.getEffectiveWeight()

      updateSettingWeight()

      updataControlsDisable()

      var mixerUpdateDelta = clock.getDelta()

      if (singleMode) {
        mixerUpdateDelta = singleModeSize
        singleModeSize = 0
      }

      mixer.update(mixerUpdateDelta)

      renderer.render(scene, camera)
    }



    // 动画开始，窗口监控
    function animate () {
      flag && requestAnimationFrame(animate)
      render()
    }
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
}
</script>


<style lang="scss">
.no-pointer-events {
  pointer-events: none;
}

.control-disabled {
  color: #888;
  text-decoration: line-through;
}
</style>
