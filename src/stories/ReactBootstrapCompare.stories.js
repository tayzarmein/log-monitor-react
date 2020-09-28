import React from 'react';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.css';


export default {
  title: 'ReactBootstrapCompare',
  component: Component,
};

function Component() {
  return (
    <div>
      <h1>Component</h1>
    </div>
  )
}

function PlainBootStrap()  {
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Oh snap! You got an error!</strong> 
      <p className=".text-danger"> 
        Change this and that and try again.
      </p>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

function ReactBootstrap() {
  return (
    <Alert dismissible variant="danger">
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>
        Change this and that and try again.
      </p>
    </Alert>
  )
}

export const PlainBootStrapView = () => <PlainBootStrap />;
export const ReactBootstrapView = () => <ReactBootstrap />;

