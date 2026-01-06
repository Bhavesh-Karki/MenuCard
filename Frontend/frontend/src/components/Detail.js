import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import pancakeImage from '../assets/pancake.jpeg';
import './Detail.css';

function Detail({ menu , handleOrderNow}) {
  return (
    <div className="detail-container">
      <div className="card-section">
        {menu.map(item => (
          <Card className="menu-card" key={item.id}>
            <Card.Img
              variant="top"
              src={item.image}
              className="card-image"
              alt={item.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = pancakeImage;
              }}
            />
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <p>Price: ${item.price}</p>
              <Button variant="primary" onClick={() => handleOrderNow(item)}>
              Order Now
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Detail;
