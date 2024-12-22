import * as React from 'react'
import { Table, Button } from 'react-bootstrap'

export function ListGraphics({ graphics, onSelect }) {

    return <div className='container-md'>
        <div className='list-graphics card'>


            <div>
                <h2>Select Graphic</h2>
            </div>

            {
                graphics.length > 0 ?
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Name</th>
                            <th>ID-Version</th>
                            <th>Issues</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            graphics.map((graphic, i) => {

                                const errorLines = graphic.error ? graphic.error.split('\n') : []
                                return <tr key={graphic.path}>
                                    <td>{graphic.path}</td>
                                    <td>{graphic.manifest.name}</td>
                                    <td>{graphic.manifest.id}-{graphic.manifest.version}</td>
                                    <td><ul>{errorLines.map((str, i) => {
                                        return <li key={i}>{str}</li>
                                    })}</ul></td>
                                    <td>
                                        <Button onClick={() => onSelect(graphic)}>Select</Button>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
                :
                <div>
                    <p>No graphics found in any the selected folder nor its subfolders</p>
                    <p>Reload the page to try again</p>
                </div>
            }


        </div>
    </div>
}
