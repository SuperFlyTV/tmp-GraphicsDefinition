import * as React from "react";
import { Table, Button, ButtonGroup, Form, Accordion } from "react-bootstrap";
import { pathJoin, graphicResourcePath } from "./lib/lib.js";
import { Renderer } from "./renderer/Renderer.js";

export function GraphicTester({ graphic }) {
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);

  const [graphicManifest, setGraphicManifest] = React.useState(null);

  const canvasRef = React.useRef(null);
  const rendererRef = React.useRef(null);

  React.useLayoutEffect(() => {

    if (!rendererRef.current) {
      if (canvasRef.current) {
        rendererRef.current = new Renderer(canvasRef.current);
        rendererRef.current.setGraphic(graphic)
      }
    }
  }, [])

  React.useEffect(() => {
    rendererRef.current.setGraphic(graphic)
  }, [graphic])

  // Load the graphic manifest:
  React.useEffect(() => {
    if (!graphicManifest) {
      fetch(graphicResourcePath(graphic.path, "manifest.json")).then(async (r) => {
        const manifest = await r.json();

        setGraphicManifest(manifest);
      });
    }
  }, []);

  // console.log('settings', settings)
  // console.log("graphic", graphic);

  return (
    <>
      <div className="container-md">
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
            <div className="control">
              <Control
                rendererRef={rendererRef}
              />
            </div>

          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="graphic-tester-render card">
          <div className="card-body">
            <div
              ref={canvasRef}
              className="graphic-canvas"
              style={{
                width: settings.width,
                height: settings.height,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
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

function Control({ rendererRef }) {

  // React.useEffect(() => {
  //   rendererRef.current.loadGraphic().catch(console.error)
  // }, [])
  return (
    <div>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Graphics Control</Accordion.Header>
          <Accordion.Body>

            <div>
              <Button onClick={() => {
                rendererRef.current.loadGraphic().catch(console.error)
              }}>
                Load Graphic
              </Button>
              <Button onClick={() => {
                rendererRef.current.clearGraphic().catch(console.error)
              }}>
                Clear Graphic
              </Button>
            </div>
            <div>

            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}


function GraphicsAction({ serverApiUrl, serverData, renderer, graphic, renderTarget, actionId, action }) {




  const initialData = action.schema ? getDefaultDataFromSchema(action.schema) : {}
  const schema = action.schema

  const [data, setData] = React.useState(initialData);

  const onDataSave = (d) => {
      setData(
          JSON.parse(JSON.stringify(d))
      )
  }


  return <div>

      <div>
          {
              schema && <GDDGUI schema={schema} data={data} setData={onDataSave} />
          }
      </div>
      <Button onClick={() => {
          // Invoke action:

          fetch(`${serverApiUrl}/serverApi/v1/renderers/renderer/${renderer.id}/target/${renderTarget.id}/invoke`, {
              method: "POST",
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  target: { graphic: {id: graphic.id, version: graphic.version } },
                  action: {
                      method: actionId,
                      payload: data
                  }
               }),
          }).then((response) => {
              if (response.status >= 300) throw new Error(`HTTP response error: [${response.status}] ${JSON.stringify(response.body)}`)
          }).catch(console.error)




      }}>{action.label}</Button>
  </div>
}

