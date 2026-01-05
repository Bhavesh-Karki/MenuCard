// import logo from './logo.svg';
import './App.css';
import ArrayMethods from './components/ArrayMethods';
import Detail from './components/Detail';
import { useEffect, useState } from 'react';


function App() {
    const [menu, setMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);

      useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Lishanaik11/menu-backend/refs/heads/main/menu.json'
    )
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setFilteredMenu(data); // show all initially
      })
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

    return (
    <div className="App">
    <h1 style={{ color: "Black", fontSize: "32px", textAlign: "center", fontWeight: "bold", marginBottom: "20px", fontFamily: "Times New Roman"}}>
  MENU CARD
</h1>
      <hr />
      <ArrayMethods menu={menu} setFilteredMenu={setFilteredMenu} />
      <Detail menu={filteredMenu} />
    </div>
  );
}

export default App;
