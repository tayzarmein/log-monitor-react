import React from 'react';
import Button from 'react-bootstrap/Button';

export default {
  title: 'BootstrapButton',
  component: Button,
};

export const Default = () => <Button onClick={() => console.log(window.ReactBootstrap)}>Hello Button</Button>;

