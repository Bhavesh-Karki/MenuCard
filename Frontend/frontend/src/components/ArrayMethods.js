import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';
import Css from './ArrayMethods.css';

function ArrayMethods() {
  return (
    <div className="array-methods-container">
      <ButtonGroup aria-label="Basic example" className="button-group-custom">
        <Button variant="secondary" className="custom-btn">Veg</Button> {/* use filter method here  */}
        <Button variant="secondary" className="custom-btn">Non-veg</Button> {/* use map method in this  */}
        <Button variant="secondary" className="custom-btn">Dessert</Button> {/* use reduce method here */}
      </ButtonGroup>
    </div>
  );
}

export default ArrayMethods;