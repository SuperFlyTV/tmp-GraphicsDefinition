
class Graphic extends HTMLElement {

  #baseUrl = ''
  #startTime = 0
  #playing = false
  #imageElement = null
  #textElement = null

  connectedCallback() {
    // Called when the element is added to the DOM
    // Note: Don't paint any pixels at this point, wait for load() to be called

  }

  async load(loadParams) {
    this.#baseUrl = loadParams.baseUrl

    if (loadParams.renderType !== 'realtime') throw new Error('Only realtime rendering is supported')

    this.textContent = 'Hello World!'

    // (we wait for the image to load to not return prematurely: )
    const image = await loadImage(this.#baseUrl + '/resources/thumbs-up.jpg')
    this.appendChild(image)
    this.#imageElement = image

    const elText = document.createElement('span')
    this.appendChild(elText)
    this.#textElement = elText

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
  async invokeAction (params) {

    const method = this[`_action_${params.method}`]
    if (!method || typeof method !== 'function') throw new Error(`Action not found: ${params.method}`)

    return method.call(this, params.payload)
  }
  async tick (_payload) {
    throw new Error('Non-realtime not supported!')
  }

  // --- Internal Properties ----------------------------------------------------------------------



  // --- Internal Actions -------------------------------------------------------------------------
  async _action_play(payload) {
    if (this.#playing) return // Is already playing
    this.#playing = true
    this.#startTime = Date.now()

    // Print the text
    if (typeof payload.text !== 'string') throw new Error('param "text" is required')
    this.#textElement.textContent = payload.text

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

    const image = new Image()
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
