import React from "react";
import DateRangePicker from "../components/DateRangePicker";
import { Container } from "react-bootstrap";
import { sub } from "date-fns";

export default {
  component: DateRangePicker,
  title: "DateRangePicker",
};

export const Default = () => {
  return (
    <Container>
      <DateRangePicker
        dateRange={{
          startDatetime: new Date(),
          endDatetime: sub(new Date(), { days: 1 }),
        }}
        onChange={(dr) => console.log("clicked onChange. dr=", dr)}
      />
    </Container>
  );
};
