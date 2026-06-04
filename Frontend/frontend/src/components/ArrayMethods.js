import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';
import './ArrayMethods.css';

function ArrayMethods({ menu, setFilteredMenu, onOrderHistoryClick, onMenuClick }) {
  const showAll = () => {
    setFilteredMenu(menu);
    onMenuClick();
  };

  const showVeg = () => {
    setFilteredMenu(menu.filter(item => item.category === "veg"));
    onMenuClick();
  };

  const showNonVeg = () => {
    setFilteredMenu(menu.filter(item => item.category === "non-veg"));
    onMenuClick();
  };

  const showDessert = () => {
    setFilteredMenu(menu.filter(item => item.category === "dessert"));
    onMenuClick();
  };

  const showDrinks = () => {
    setFilteredMenu(menu.filter(item => item.category === "drinks"));
    onMenuClick();
  };

  return (
    <div className="array-methods-container">
    <ButtonGroup className="button-group-custom">
      <Button onClick={showAll} className='custom-btn' variant='secondary'>All</Button>
      <Button onClick={showVeg} className='custom-btn' variant='secondary'>Veg</Button>
      <Button onClick={showNonVeg} className='custom-btn' variant='secondary'>Non-Veg</Button>
      <Button onClick={showDessert} className='custom-btn' variant='secondary'>Dessert</Button>
      <Button onClick={showDrinks} className='custom-btn' variant='secondary'>Drinks</Button>
      <Button onClick={onOrderHistoryClick} className='custom-btn' variant='secondary'>Order History</Button>
    </ButtonGroup>
    </div>
  );
}


export default ArrayMethods;
