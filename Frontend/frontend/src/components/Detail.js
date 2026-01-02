import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

function Detail() {
  return (
    <div className="d-flex justify-content-around">
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Delicious Pancake</Card.Title>
          <Card.Text>
            Pancake with syrup and butter. A delightful breakfast treat to start your day!
          </Card.Text>
          <Button variant="primary">Order Now</Button>
        </Card.Body>
      </Card>

<br />
    <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Milkshake </Card.Title>
          <Card.Text>
            A creamy and refreshing milkshake made with fresh ingredients. Perfect for any time of the day!
          </Card.Text>
          <Button variant="primary">Order Now</Button>
        </Card.Body>
      </Card>


      

      {/* <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="primary" xs={6} />
        </Card.Body>
      </Card> */}
    </div>
  );
}

export default Detail;