import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default {
  title: 'ReactBootstrapDropdownButton',
  component: DropdownButton,
};

export const Default = () => {
return (
    <DropdownButton title="My Name" >
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>)
};

