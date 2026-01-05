import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Detail.css';

function Detail({ menu }) {
  return (
    <div className="detail-container">
      <div className="card-section">
        {menu.map(item => (
          <Card className="menu-card" key={item.id}>
            <Card.Img variant="top" src={item.image} className="card-image" />
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <p>Price: ${item.price}</p>
              <Button variant="primary">Order Now</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Detail;
