import './style.scss'
import * as THREE from 'three'
import { useFrame, useScene, displayStats } from './library/three-helper'
import {
  waitUntil,
  wait,
  waitUntilContentLoaded,
  animateOvertime,
} from './library/task-helper'

const { scene, camera } = useScene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

let isCompleted = false
setTimeout(() => {
  isCompleted = true
}, 3000)
const main = async () => {
  await waitUntilContentLoaded()
  await animateOvertime((time) => {
    console.log(time / 3000)
    cube.rotation.x = THREE.MathUtils.degToRad((time / 3000) * 360)
  }, 3000)
}
main()

useFrame((context) => {
  const renderTarget = new THREE.WebGLRenderTarget(512, 512)
  context.renderer.setRenderTarget(renderTarget)
  context.renderer.render(scene, camera)
  context.renderer.setRenderTarget(null)
  context.renderer.render(scene, camera)
})
