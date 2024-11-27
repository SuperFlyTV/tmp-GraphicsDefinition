import * as React from 'react'
import { GDDGUI } from './GDD/gdd-gui.jsx'
import { getDefaultDataFromSchema } from './GDD/gdd/data.js'

export function GDDExample() {


    // const [schema, setSchema] = React.useState(initialSchemaStr);
    const schema = {
        title: "One-line GFX Template",
        type: "object",
        properties: {
          f0: {
            type: "string",
            maxLength: 50,
            minLength: 1,
            default: "Hello world!",
          },
          f1: {
            type: "string",
            maxLength: 80,
            default: "I'm alive!",
          },
        },
    }
    const initialData = getDefaultDataFromSchema(schema);

    const [data, setData] = React.useState(initialData);


    const onDataSave = (d) => {
        const dataStr = JSON.stringify(d);
        setData(JSON.parse(dataStr));
        localStorage.setItem("data", dataStr);
    };

    return <div className="gdd-gui">
        <GDDGUI schema={schema} data={data} setData={onDataSave} />
    </div>
}
