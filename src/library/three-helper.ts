import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export interface ThreeContext {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  frameEvents: EventFrame[]
}

export interface FrameContext {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
}

export type EventFrame = (context: FrameContext) => void

export const createScene = (parentElement?: HTMLElement): ThreeContext => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!!parentElement) {
    parentElement.appendChild(renderer.domElement)
  } else {
    document.body.appendChild(renderer.domElement)
  }
  const clock = new THREE.Clock()
  clock.autoStart = true

  const onWindowResized = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResized)

  // Frame
  const frameEvents: EventFrame[] = []
  const frameLoop = () => {
    window.stats.begin()
    frameEvents.forEach((event) => event({ scene, camera, renderer, clock }))
    window.stats.end()
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(frameLoop)

  return { scene, camera, renderer, clock, frameEvents }
}

// グローバル変数を宣言する
declare global {
  interface Window {
    threeContext: ThreeContext
    stats: Stats
  }
}

window.threeContext = createScene()
window.stats = new Stats()
window.stats.showPanel(0)
document.body.appendChild(window.stats.dom)

export const useScene = () => {
  return window.threeContext
}

export const useFrame = (event: EventFrame) => {
  window.threeContext.frameEvents.push(event)
}

export const displayStats = (active: boolean) => {
  if (active) {
    document.body.appendChild(window.stats.dom)
  } else {
    document.body.removeChild(window.stats.dom)
  }
}
