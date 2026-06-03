import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import fallbackImage from '../../assets/pancake.jpeg';
import { StarIcon } from '../Icons';

function FoodCard({ item, onAddToCart }) {
  return (
    <Card className="food-card">
      <div className="food-image-wrap">
        <Card.Img
          src={item.image}
          alt={item.title}
          onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
        <span className="food-category">{item.category}</span>
      </div>

      <Card.Body>
        <div className="food-card-heading">
          <Card.Title>{item.title}</Card.Title>
          <span className="food-rating">
            <StarIcon />
            {Number(item.rating || 4.5).toFixed(1)}
          </span>
        </div>
        <Card.Text>{item.description}</Card.Text>
        <div className="food-card-footer">
          <strong>Rs. {item.price}</strong>
          <Button onClick={() => onAddToCart(item)}>Add to Cart</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default FoodCard;
