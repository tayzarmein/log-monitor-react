import React from "react";
import { Form, Button } from "react-bootstrap";

export default function GclogUpload({onUpload, onSelected, selectedFile}) {

  return (
    <Form.Group>
      <legend>Upload GC Log file?</legend>
      <Form.Control type='file' onChange={(f) => onSelected(f.target.files[0])}></Form.Control>
      <Button onClick={() => onUpload()} className="mt-3">Upload</Button>
    </Form.Group>
  );
}
