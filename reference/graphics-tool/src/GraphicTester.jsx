import * as React from "react";
import { Table, Button, ButtonGroup, Form, Accordion } from "react-bootstrap";
import { pathJoin } from "./lib/lib.js";

export function GraphicTester({ graphic }) {
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);

  const [graphicManifest, setGraphicManifest] = React.useState(null);

  // This URL prefix causes the service-worker to intercept the requests and serve the file from the local file system:
  const urlPrefix = pathJoin("http://LOCAL/", graphic.path);

  // Load the graphic manifest:
  React.useEffect(() => {
    if (!graphicManifest) {
      fetch(pathJoin(urlPrefix, "manifest.json")).then(async (r) => {
        const manifest = await r.json();

        setGraphicManifest(manifest);
      });
    }
  }, []);

  // console.log('settings', settings)
  console.log("graphic", graphic);

  return (
    <div className="graphic-tester card">
      <div className="card-body">
        <div className="settings">
          <Settings
            settings={settings}
            onChange={(newSettings) => {
              setSettings(newSettings);
            }}
          />
        </div>
        <div
          className="graphic-canvas"
          style={{
            width: settings.width,
            height: settings.height,
          }}
        >
          <img
            src={pathJoin(
              "http://LOCAL/",
              graphic.path,
              "resources/thumbs-up.jpg"
            )}
          ></img>
        </div>
      </div>
    </div>
  );
}

function Settings({ settings, onChange }) {
  settings = JSON.parse(JSON.stringify(settings));

  const handleOnChange = React.useCallback(
    (event, key, transform) => {
      // console.log('handleOnChange', event.target.value, key)

      settings[key] = transform
        ? transform(event.target.value)
        : event.target.value;

      onChange(settings);
    },
    [settings, onChange]
  );

  return (
    <div>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Settings</Accordion.Header>
          <Accordion.Body>
            <div>{JSON.stringify(settings)}</div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Renderer Type</Form.Label>
                <Form.Select
                  value={`${settings.realtime ? "1" : "0"}`}
                  onChange={(e) =>
                    handleOnChange(e, "realtime", (v) => v === "1")
                  }
                >
                  <option value="1">Real Time</option>
                  <option value="0">Non Real Time</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Width</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.width}
                  onChange={(e) => handleOnChange(e, "width")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.height}
                  onChange={(e) => handleOnChange(e, "height")}
                />
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
const DEFAULT_SETTINGS = {
  realtime: true,
  width: 1280,
  height: 720,
};

// function Graphic
