import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import pancakeImage from '../assets/pancake.jpeg';
import './Detail.css';

function Detail() {
  return (
    <div className="detail-container">
      {/* First Section */}
      <div className="card-section">
        <Card className="menu-card" id="1">
          <Card.Img variant="top" src="https://imgs.search.brave.com/EbDb081M9wHE_O2-BZgVNuK3osOjgPz2Vhu73YdrKPo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjUyOTk1NDM5MjMt/MzdkZDM3ODg3NDQy/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE0zeDhjR0Z1/WTJGclpYeGxibnd3/Zkh3d2ZIeDhNQT09" className="card-image" alt='pancake' />
          <Card.Body>
            <Card.Title>Delicious Pancake</Card.Title>
            <Card.Text>
              Pancake with syrup and butter. A delightful breakfast treat to start your day!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card" id="2">
        <Card.Img
        variant="top"
        src="https://raw.githubusercontent.com/john-smilga/javascript-basic-projects/master/08-menu/final/images/item-2.jpeg"
        className="card-image"
        alt="Burger"/>
        <Card.Body>
            <Card.Title>Burger</Card.Title>
            <Card.Text>
              Veg or Non-veg cheese burger with fresh lettuce and tomato. A tasty and satisfying meal!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card" id="3">
          <Card.Img variant="top" src="https://raw.githubusercontent.com/john-smilga/javascript-basic-projects/refs/heads/master/08-menu/final/images/item-10.jpeg" 
          className="card-image" 
          alt='Chicken'/>
          <Card.Body>
            <Card.Title>Chicken</Card.Title>
            <Card.Text>
              Grilled chicken with spices and herbs. A flavorful dish that's both healthy and delicious!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card" id="4">
          <Card.Img variant="top" src="https://imgs.search.brave.com/ectHTxT9ESItQhMnntN9qeuMcPBcPoxenBaUNt4wVOo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oeWZ1/bmZvb2RzLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NS9TdXBlci1Dcmlz/cHktQ29hdGVkLUZy/ZW5jaC1Gcmllc19I/aWdoLVJlcy0xLnBu/Zw" className="card-image" alt='french fries' />
          <Card.Body>
            <Card.Title>French Fries</Card.Title>
            <Card.Text>
              Crispy golden fries with the perfect amount of salt. The ultimate side dish for any meal!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>
      </div>

      {/* Second Section */}
      <div className="card-section" >
        <Card className="menu-card" id="5">
          <Card.Img variant="top" src="https://imgs.search.brave.com/q2oVlhIfOcly1-RhZ7QBMDnvbKmcTjU-kHIPqm6ovn0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZG9taW5vcy5jby5p/bi90aGVtZTIvZnJv/bnQvaW1hZ2VzL21l/bnUtaW1hZ2VzL215/LXBpenphbWFuaWEu/d2VicA" className="card-image" alt='pizza' />
          <Card.Body>
            <Card.Title>Pizza</Card.Title>
            <Card.Text>
              Freshly baked pizza with your favorite toppings. Hot, cheesy, and absolutely delicious!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card" id="6">
          <Card.Img variant="top" src="https://imgs.search.brave.com/j9f85j5w8T2-9_VmY536adsqAAFFLnrAPRbTGxDt1Q0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDEv/ODI2Lzk2MS9zbWFs/bC9zYXV0ZWVkLW1h/Y2Fyb25pLXBhc3Rh/LWluLXRoZS1wYW4t/ZnJlZS1waG90by5q/cGc" className="card-image" alt='pasta' />
          <Card.Body>
            <Card.Title>Pasta</Card.Title>
            <Card.Text>
              Creamy pasta with rich sauce and herbs. A comforting meal that warms your soul!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card"  id="7">
          <Card.Img variant="top" src="https://imgs.search.brave.com/avXk_mNo2RY05NRu185UZhtzgaB8fpJ8hH51CyokBTo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8x/Mi8xNi8wOS80MC9z/YWxhZC1wbGF0ZS0x/MDk1NjQ4XzY0MC5q/cGc" className="card-image" alt='salad' />
          <Card.Body>
            <Card.Title>Salad</Card.Title>
            <Card.Text>
              Fresh mixed greens with seasonal vegetables and dressing. Healthy and refreshing!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>

        <Card className="menu-card" id="8">
          <Card.Img variant="top" src="https://imgs.search.brave.com/IAQk1hEdb7aVC7i8Z0dupMCGmZySIkm8EWbyzDfAlzQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzU4LzEzLzAz/LzM2MF9GXzU1ODEz/MDMyM19HNTN6N0Fy/a2FiSlhydlNBUVlp/THhodXFOWE4weWVp/di5qcGc" className="card-image" alt='ice cream' />
          <Card.Body>
            <Card.Title>Ice Cream</Card.Title>
            <Card.Text>
              Creamy and smooth ice cream in various flavors. A sweet treat to satisfy your dessert cravings!
            </Card.Text>
            <Button variant="primary">Order Now</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Detail;