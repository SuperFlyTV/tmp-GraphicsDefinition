import * as React from "react";
import { Table, Button, ButtonGroup, Form, Accordion, Row, Col } from "react-bootstrap";
import { pathJoin, graphicResourcePath } from "./lib/lib.js";
import { Renderer } from "./renderer/Renderer.js";

export function GraphicTester({ graphic, onExit }) {
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);

  const [graphicManifest, setGraphicManifest] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const canvasRef = React.useRef(null);
  const rendererRef = React.useRef(null);

  const onError = React.useCallback((e) => {
    setErrorMessage(`${e.message || e}`);
    console.error(e)
  }, []);

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

  React.useEffect(() => {

    if (settings.autoReloadInterval > 500) {
      let active = true
      let reloadInterval = 0
      const triggerReload = () => {
        rendererRef.current.clearGraphic()
        .then(() => {
          rendererRef.current.loadGraphic().catch(console.error)
        })
        .then(() => {
          if (active) {
            reloadInterval = setTimeout(() => {
              reloadInterval = 0
              if (active) triggerReload()
            }, settings.autoReloadInterval)
          }
        })
        .catch(onError)
      }
      triggerReload()
      return () => {
        if (reloadInterval) clearTimeout(reloadInterval)
        active = false
      }
    }
  }, [settings])

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
            <div>
              <Button onClick={onExit}>
                👈Go back
              </Button>
            </div>

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
            <div>
              <AutoReloadBar rendererRef={rendererRef} settings={settings} />
            </div>
            <div>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
            </div>
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

      const newValue = transform
        ? transform(event.target.value)
        : event.target.value;

      if (newValue === undefined) return
      settings[key] = newValue
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
              <Row>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Auto-reload interval (ms)</Form.Label>
                    <Form.Control
                      type="number"
                        value={`${settings.autoReloadInterval}`}
                        onChange={(e) =>
                          handleOnChange(e, "autoReloadInterval", (v) => {
                            const num = parseInt(v)
                            if (Number.isNaN(num)) return undefined
                            if (`${v}`[0] === '0') return v
                            return num
                          })
                        }
                    />
                    <Form.Text>
                      When Auto-reload is active, the graphic will be cleared and loaded
                      on an interval. To add Actions to the reload, shift-click on an action to add it.
                      <br />
                      (set to 0 to disable Auto-reload)
                      </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
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
  autoReloadInterval: 5000
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

function AutoReloadBar ({ rendererRef, settings }) {
  // const barRef = React.useRef(null)

  const [width, setWidth] = React.useState(0)
  const [message, setMessage] = React.useState(null)

  React.useEffect(() => {
    let active = true
    const triggerNextFrame = () => {
      if (!active) return

      // On each frame:
      window.requestAnimationFrame(() => {
        if (!active) return
        triggerNextFrame()

        if (!rendererRef.current) return

        const graphicState = rendererRef.current.graphicState
        const loadGraphicEndTime = rendererRef.current.loadGraphicEndTime || 0

        if (graphicState === 'pre-load') {
          setWidth(0)
          setMessage('Loading...')
        } else if (graphicState === 'post-load') {
          setMessage('Loaded')
          if (settings.autoReloadInterval) {
            setWidth(
              (Date.now() - loadGraphicEndTime) / settings.autoReloadInterval
            )
          } else {
            setWidth(0)
          }
        } else if (graphicState === 'pre-clear') {
          setMessage('Clearing...')
        } else if (graphicState === 'post-clear') {
          setMessage('Cleared')
          setWidth(0)
        } else if (graphicState === undefined) {
          // nothing
        } else {
          setMessage(`Unknown state: "${graphicState}"`)
        }
      })
    }
    triggerNextFrame()
    return () => {
      active = false
    }
  },[rendererRef, settings])
  return <div className="auto-reload-bar">
    <div className="auto-reload-bar_bar"
    style={{
      width: `${width*100}%`
    }}></div>
    <div className="auto-reload-bar_message">
      Status: {message}
    </div>
  </div>
}
