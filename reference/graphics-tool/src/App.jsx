import * as React from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import { Test } from "./Test";
import { fileHandler } from "./FileHandler";
import { serviceWorkerHandler } from "./ServiceWorkerHandler.js";
import { ListGraphics } from "./ListGraphics";
import { GraphicTester } from "./GraphicTester";
// import { getDefaultDataFromSchema } from './GDD/gdd/data.js'
// import { GDDGUI } from './GDD/gdd-gui.jsx'

// const SERVER_API_URL = 'http://localhost:8080'

export function App() {
  const [graphics, setGraphics] = React.useState(false);
  const [selectedGraphic, setSelectedGraphic] = React.useState(null);

  const [serviceWorker, setServiceWorker] = React.useState(null);
  const [serviceWorkerError, setServiceWorkerError] = React.useState(null);

  // TMP!!! Auto select a graphic:
  // React.useEffect(() => {
  //   if (graphics && !selectedGraphic) {
  //     const g = graphics.find((g) => !g.error);
  //     setSelectedGraphic(g);
  //   }
  // }, [graphics]);

  // Initialize Service Worker:
  React.useEffect(() => {
    if (!serviceWorker) {
      serviceWorkerHandler
        .init(fileHandler)
        .then((sw) => {
          setServiceWorker(sw);
        })
        .catch((e) => {
          setServiceWorker(null);
          setServiceWorkerError(e);
          console.error(e);
        });
    }
  }, [serviceWorker]);

  const onSelectGraphic = React.useCallback((graphic) => {
    setSelectedGraphic(graphic);
  }, []);

  if (!serviceWorker) {
    return (
      <div>
        <span>Initializing, please wait..</span>
        <div>
          {serviceWorkerError && (
            <span>Error: {serviceWorkerError.message}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <>

      {
      selectedGraphic ?
        <GraphicTester graphic={selectedGraphic} />
      :
      graphics ?
        <ListGraphics graphics={graphics} onSelect={onSelectGraphic} />
      :
      <div className="intial-hero">
          <div className="intial-hero-content">
            <div>
              <h1>Graphics DevTool</h1>
            </div>
            <div>
              <p>This is a tool for developing EBU HTML graphics.</p>
              <p>It reads Graphics from your local hard drive and displays them in this web page <br /> (nothing is sent to any servers).</p>

              <p>
                Begin by selecting a folder that contains Graphics in any subfolder.
              </p>
              <p>
                <Button
                  onClick={() => {
                    fileHandler
                      .init()
                      .then((graphics) => {
                        setGraphics(graphics);
                      })
                      .catch(console.error);
                  }}
                >
                  Open local folder
                </Button>
              </p>

              <p>
                (You can also find example graphics&nbsp;
                <a href="https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics">
                  here
                </a>!)
              </p>
              <p>Source code for this app can be found at
                <br />
                <a href="https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics-tool">
                  https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics-tool
                </a>
              </p>
            </div>
          </div>
      </div>
    }

    </>
  );
}
