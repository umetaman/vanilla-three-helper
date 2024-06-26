export class CancellationToken {
  private _isRequested: boolean = false

  public get isRequested() {
    return this._isRequested
  }

  public request() {
    this._isRequested = true
  }

  public throwIfCancellationRequested() {
    if (this._isRequested) {
      throw new Error('OperationCanceled')
    }
  }
}

export class CancellationTokenEmpty extends CancellationToken {
  public static readonly instance = new CancellationTokenEmpty()
  public get isRequested() {
    return false
  }
}

export const delay = (
  ms: number,
  cancellationToken: CancellationToken = CancellationTokenEmpty.instance,
) =>
  new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      if (cancellationToken.isRequested) {
        reject(new Error('Promise Operation is cancceled.'))
      }
      resolve()
    }, ms)
  })

export const delayFrame = (
  cancellationToken: CancellationToken = CancellationTokenEmpty.instance,
) =>
  new Promise<void>((resolve, reject) => {
    const id = requestAnimationFrame(() => {
      cancelAnimationFrame(id)
      if (cancellationToken.isRequested) {
        reject(new Error('Promise Operation is cancceled.'))
      }
      resolve()
    })
  })

export const waitUntil = (
  predictor: () => boolean,
  cancellationToken: CancellationToken = CancellationTokenEmpty.instance,
) => {
  return new Promise<void>((resolve, reject) => {
    const frame = () => {
      if (cancellationToken.isRequested) {
        reject(new Error('Promise Operation is cancceled.'))
      }
      if (predictor()) {
        resolve()
      } else {
        requestAnimationFrame(frame)
      }
    }
    frame()
  })
}

let isContentLoaded = false
document.addEventListener('DOMContentLoaded', () => {
  isContentLoaded = true
})

export const waitUntilContentLoaded = () => {
  return waitUntil(() => isContentLoaded)
}

export const animateOvertime = (
  callback: (deltaTime: number) => void,
  duration: number,
  cancellationToken: CancellationToken = CancellationTokenEmpty.instance,
) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = performance.now()
    const frame = () => {
      const deltaTime = Math.max(0, performance.now() - startTime)
      if (cancellationToken.isRequested) {
        reject(new Error('Promise Operation is cancceled.'))
      }
      if (deltaTime >= duration) {
        callback(duration)
        resolve()
      } else {
        callback(deltaTime)
        requestAnimationFrame(frame)
      }
    }
    requestAnimationFrame(frame)
  })
}
