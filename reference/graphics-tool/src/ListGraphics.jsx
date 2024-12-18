import * as React from 'react'
import { Table, Button } from 'react-bootstrap'

export function ListGraphics({ graphics, onSelect }) {

    return <div>
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Path</th>
                    <th>Errors</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    graphics.map((graphic, i) => {
                        return <tr key={graphic.path}>
                            <td>{graphic.path}</td>
                            <td>{graphic.error}</td>
                            <td>
                                <Button onClick={() => onSelect(graphic)}>Select</Button>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </Table>


    </div>
}
