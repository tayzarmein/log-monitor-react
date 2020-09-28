import React from "react";
import LogTypeSelect from "../components/LogTypeSelect";
import { Container } from "react-bootstrap";

export default {
  component: LogTypeSelect,
  title: "LogTypeSelect",
};

export const Default = () => {
  return (
    <Container>
      <LogTypeSelect
      />
    </Container>
  );
};
