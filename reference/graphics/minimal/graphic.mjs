
class Graphic extends HTMLElement {

  connectedCallback() {
    // Called when the element is added to the DOM
    // Note: Don't paint any pixels at this point, wait for load() to be called
  }

  async load(loadParams) {

    if (loadParams.renderType !== 'realtime') throw new Error('Only realtime rendering is supported')

    // Display an image
    const image = document.createElement('img')
    image.src = loadParams.baseUrl + '/resources/thumbs-up.jpg'
    this.appendChild(image)

    // When everything is loaded we can return:
    return
  }
  async dispose (_payload) {
    this.innerHTML = ''
  }
  async getStatus (_payload) {
    return {}
  }
  async invoke (payload) {
    // No actions are implemented in this minimal example
  }
  async tick (_payload) {
    throw new Error('Non-realtime not supported!')
  }
}

export { Graphic }

// Note: The renderer will render the component
