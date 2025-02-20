class Graphic extends HTMLElement {
  connectedCallback() {
    // Called when the element is added to the DOM
    // Note: Don't paint any pixels at this point, wait for load() to be called
  }

  async load(loadParams) {
    if (loadParams.renderType !== "realtime")
      throw new Error("Only realtime rendering is supported by this graphic");

    const elText = document.createElement("p");
    elText.innerHTML = "Hello world!";
    this.appendChild(elText);

    // When everything is loaded we can return:
    return;
  }
  async dispose(_payload) {
    this.innerHTML = "";
  }
  async getStatus(_payload) {
    return {};
  }
  async invokeAction(params) {
    // No actions are implemented in this minimal example
    // params.method, params.payload
    // if (params.method === 'play') this.elIframe.contentWindow.play()

    this.elIframe.contentWindow[params.method](params.payload);
  }
  async goToTime(_payload) {
    throw new Error("Non-realtime not supported!");
  }
  async setInvokeActionsSchedule(_payload) {
    throw new Error("Non-realtime not supported!");
  }
}

export { Graphic };

// Note: The renderer will render the component
