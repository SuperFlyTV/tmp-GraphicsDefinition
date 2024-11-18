
class Graphic extends HTMLElement {

  #baseUrl = ''
  #startTime = 0
  #playing = false
  #imageElement = null

  connectedCallback() {
    // Called when the element is added to the DOM
    this.textContent = 'Hello World!';
  }

  async load(loadParams) {


    this.#baseUrl = loadParams.baseUrl

    if (loadParams.renderType !== 'realtime') throw new Error('Only realtime rendering is supported')

    // (we wait for the image to load to not return prematurely: )
    const image = await loadImage(this.#baseUrl + '/resources/thumbs-up.jpg')
    this.appendChild(image)
    this.#imageElement = image

    // When everything is loaded we can return:
    return
  }
  async dispose (_payload) {
    this.innerHTML = ''
    this.#playing = false
    this.#imageElement = null
  }
  async getStatus (_payload) {
    return {
      // TBD
    }
  }
  async invoke (payload) {

    const method = this[`_action_${payload.method}`]
    if (!method || typeof method !== 'function') throw new Error(`Action not found: ${payload.method}`)

    return method.call(this, payload.payload)
  }
  async tick (_payload) {
    throw new Error('Non-realtime not supported!')
  }

  // --- Internal Properties ----------------------------------------------------------------------



  // --- Internal Actions -------------------------------------------------------------------------
  async _action_play(_payload) {
    if (this.#playing) return // Is already playing
    this.#playing = true
    this.#startTime = Date.now()

    // Start the animation
    const animateFrame = () => {
      if (this.#playing === false) return // Stop playing

      const rotation = (this._getTime() * 0.1) % 360
      this.#imageElement.style.transform = `rotate(${rotation}deg)`
      window.requestAnimationFrame(animateFrame)
    }

    window.requestAnimationFrame(animateFrame)
  }
  async _action_stop(_payload) {
    this.#playing = false
  }
  // --- Helper methods ---------------------------------------------------------------------------
  _getTime() {
    return Date.now() - this.#startTime
  }
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {

    const image = new Image();
    image.onload = () => {
      resolve(image)
    }
    image.onerror = (err) => {
      reject(err)
    }
    image.src = url
  })
}

export { Graphic }

// Note: The renderer will render the component
