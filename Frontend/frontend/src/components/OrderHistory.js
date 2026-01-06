import Button from 'react-bootstrap/Button';
import './ArrayMethods.css';

function OrderHistory({ onClick }) {
  const handleClick = onClick || (() => {});

  return (
    <div className="order-history-container">
      <Button variant="secondary" className="custom-btn" onClick={handleClick}>
        Order History
      </Button>
    </div>
  );
}

export default OrderHistory;

