import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';
import Css from './ArrayMethods.css';

function ArrayMethods() {
  return (
<ButtonGroup aria-label="Basic example">
  <Button variant="secondary" className="custom-btn">Filter</Button>
  <Button variant="secondary" className="custom-btn">Map</Button>
  <Button variant="secondary" className="custom-btn">Reduce</Button>
</ButtonGroup>
  );
}

export default ArrayMethods;