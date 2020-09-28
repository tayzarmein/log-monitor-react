import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

export default function QuickButtons({onClick}) {
    return (
        <ButtonGroup>
            <Button variant="outline-primary" onClick={() => onClick({clickedBtnName: "oneDay"})}>Latest 1 Day</Button>
            <Button variant="outline-primary" onClick={() => onClick({clickedBtnName: "oneWeek"})}>Latest 1 Week</Button>
            <Button variant="outline-primary" onClick={() => onClick({clickedBtnName: "oneMonth"})}>Latest 1 Month</Button>
        </ButtonGroup>
    )
}