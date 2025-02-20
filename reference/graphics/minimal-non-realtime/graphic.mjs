class Graphic extends HTMLElement {
  connectedCallback() {
    // Called when the element is added to the DOM
    // Note: Don't paint any pixels at this point, wait for load() to be called
  }

  async load(loadParams) {
    if (
      loadParams.renderType !== "realtime" &&
      loadParams.renderType !== "non-realtime"
    )
      throw new Error(
        "This graphic only supports realtime and non-realtime rendering!"
      );

    this.elText = document.createElement("p");
    this.elText.style.fontSize = "24px";
    this.elText.style.fontFamily = "Arial";

    this.elText.innerHTML = "";
    this.appendChild(this.elText);

    if (loadParams.renderType === "realtime") {
      console.log("aaab");
      let startTime = performance.now();
      const updateFrame = () => {
        if (this.disposed) return;

        const timeSinceStart = performance.now() - startTime;
        this._updateText(timeSinceStart);

        window.requestAnimationFrame(updateFrame);
      };
      window.requestAnimationFrame(updateFrame);
    }

    // When everything is loaded we can return:
    return;
  }
  async dispose(_payload) {
    this.disposed = true;
    this.innerHTML = "";
  }
  async getStatus(_payload) {
    return {};
  }
  async invokeAction(params) {
    // No actions are implemented in this minimal example
  }
  async goToTime(payload) {
    this._updateText(payload.timestamp);
  }
  async setInvokeActionsSchedule(_payload) {
    // No actions are defined in this minimal example
  }

  _updateText(timestamp) {
    this.elText.innerHTML = `Time: ${Math.floor(timestamp) / 1000}`;
  }
}

export { Graphic };

// Note: The renderer will render the component
