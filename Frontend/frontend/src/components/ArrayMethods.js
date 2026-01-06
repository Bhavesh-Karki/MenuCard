import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';
import './ArrayMethods.css';

function ArrayMethods({ menu, setFilteredMenu }) {
  const showVeg = () => {
    const vegItems = menu.filter(item => item.category === 'veg');
    setFilteredMenu(vegItems);
  };

  const showNonVeg = () => {
    const nonVegItems = menu.filter(item => item.category === 'non-veg');
    setFilteredMenu(nonVegItems);
  };

  const showDessert = () => {
    const dessertItems = menu.filter(item => item.category === 'dessert');
    setFilteredMenu(dessertItems);
  };

  const showAll = () => {
    setFilteredMenu(menu);
  };

  return (
    <div className="array-methods-container">
      <ButtonGroup aria-label="Basic example" className="button-group-custom">
        <Button variant="secondary" className="custom-btn" onClick={showAll}>
          All
        </Button>
        <Button variant="secondary" className="custom-btn" onClick={showVeg}>
          Veg
        </Button>
        <Button variant="secondary" className="custom-btn" onClick={showNonVeg}>
          Non-Veg
        </Button>
        <Button variant="secondary" className="custom-btn" onClick={showDessert}>
          Dessert
        </Button>
        <Button variant="secondary" className="custom-btn">
          Order History
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default ArrayMethods;
