// import logo from './logo.svg';
import './App.css';
import ArrayMethods from './components/ArrayMethods';
import Detail from './components/Detail';
import OrderHistory from "./components/OrderHistory";
import { useEffect, useState } from 'react';


function App() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);

  const [orders, setOrders] = useState([]);
const [showOrderHistory, setShowOrderHistory] = useState(false);

const fetchOrderHistory = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/orders");
    const data = await res.json();
    setOrders(data);
    setShowOrderHistory(true);
  } catch (err) {
    console.error("Order history error:", err);
  }
};

const hideOrderHistory = () => {
  setShowOrderHistory(false);
};


  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Lishanaik11/menu-backend/refs/heads/main/menu.json'
    )
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setFilteredMenu(data);
      })
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

  const handleOrderNow = (item) => {
    fetch("http://localhost:5000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,              // fixed user
        item_name: item.title,   
        price: item.price,
        quantity: 1,
      }),
    })
      .then(res => res.json())
      .then(() => {
        alert(`${item.title} added to order`);
      })
      .catch(err => {
        console.error("Order error:", err);
        alert("Failed to place order");
      });
  };

  return (
    <div className="App">
      <h1 style={{ color: "black", fontSize: "32px", textAlign: "center", fontWeight: "bold", marginBottom: "12px", fontFamily: "Times New Roman" }}>
        MENU CARD
      </h1>

      <hr className="menu-divider" />

      <ArrayMethods
  menu={menu}
  setFilteredMenu={setFilteredMenu}
  onOrderHistoryClick={fetchOrderHistory}
  onMenuClick={hideOrderHistory}
/>


{showOrderHistory ? (
  <OrderHistory orders={orders} />
) : (
  <Detail menu={filteredMenu} handleOrderNow={handleOrderNow} />
)}

    </div>
  );
}
export default App;