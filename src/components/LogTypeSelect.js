import React from "react";
import { Form } from "react-bootstrap";

export default function LogTypeSelect() {
    return (
        <Form.Group>
            <legend>Select the type of Log</legend>
            {/* <Form.Label>Logtype</Form.Label> */}
            <Form.Control as="select">
                <option value="all">All</option>
                <option value="newgenlog">New Gen</option>
                <option value="oldgenlog">Old Gen</option>
            </Form.Control>
        </Form.Group>
    )
}