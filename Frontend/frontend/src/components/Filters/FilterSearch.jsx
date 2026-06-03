import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FilterIcon, SearchIcon } from '../Icons';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Veg', value: 'veg' },
  { label: 'Non-Veg', value: 'non-veg' },
  { label: 'Dessert', value: 'dessert' },
];

function CategoryButtons({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-list">
      {categories.map(category => (
        <button
          type="button"
          key={category.value}
          className={`category-pill ${
            activeCategory === category.value ? 'is-active' : ''
          }`}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

function FilterSearch({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="filter-shell" aria-label="Menu filters and search">
      <div className="desktop-filter">
        <CategoryButtons
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      <Button className="filter-button mobile-only" onClick={() => setShowFilters(true)}>
        <FilterIcon />
        Filter By
      </Button>

      <div className="search-box">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search food"
          value={searchTerm}
          onChange={event => onSearchChange(event.target.value)}
          aria-label="Search food"
        />
      </div>

      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="bottom"
        className="filter-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter By</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CategoryButtons
            activeCategory={activeCategory}
            onCategoryChange={value => {
              onCategoryChange(value);
              setShowFilters(false);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default FilterSearch;
