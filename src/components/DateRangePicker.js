import React, { useState } from "react";
import { Form, Row, Col, FormGroup } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import QuickButtons from "./QuickButtons";

export default function ({ dateRange, onChange, onClickQuickButtons }) {
  return (
    <FormGroup>
      <FormGroup>
        <legend>Enter Datetime Range: </legend>
        <Form.Row>
          <Col sm={3} md={3}>
            <Form.Label>Start Datetime</Form.Label>
          </Col>
          <Col sm lg={3}>
            <div>
              <DateTimePicker
                value={dateRange ? dateRange.startDatetime : new Date()}
                onChange={(dt) => {
                  const newDateRange = { ...dateRange };
                  newDateRange.startDatetime = dt;
                  if (onChange) onChange(newDateRange);
                }}
              />
            </div>
          </Col>
          <div className="w-100 d-none d-sm-block"></div>
          <Col sm={3} md={3}>
            <Form.Label>End Datetime</Form.Label>
          </Col>
          <Col sm lg={3}>
            <div>
              <DateTimePicker
                value={dateRange ? dateRange.endDatetime : new Date()}
                onChange={(dt) => {
                  const newDateRange = { ...dateRange };
                  newDateRange.endDatetime = dt;
                  if (onChange) onChange(newDateRange);
                }}
              />
            </div>
          </Col>
        </Form.Row>
      </FormGroup>
      <QuickButtons onClick={onClickQuickButtons} />
    </FormGroup>
  );
}
