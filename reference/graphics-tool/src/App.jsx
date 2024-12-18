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

  // TMP:
  React.useEffect(() => {
    if (graphics && !selectedGraphic) {
      const g = graphics.find((g) => g.error === null);
      setSelectedGraphic(g);
    }
  }, [graphics]);

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
    <div className="container-md">
      <div>
        <h1>Graphics DevTool</h1>
      </div>

      {graphics ? (
        <ListGraphics graphics={graphics} onSelect={onSelectGraphic} />
      ) : (
        <div>
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
        </div>
      )}
      <div>
        {selectedGraphic && <GraphicTester graphic={selectedGraphic} />}
      </div>
    </div>
  );
}
