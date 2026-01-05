// import logo from './logo.svg';
import './App.css';
import ArrayMethods from './components/ArrayMethods';
import Detail from './components/Detail';

function App() {
  return (
    <div className="App">
    <h1 style={{ color: "Black", fontSize: "32px", textAlign: "center", fontWeight: "bold", marginBottom: "20px", fontFamily: "Times New Roman"}}>
  MENU CARD
</h1>
      <hr />
      <ArrayMethods />
      <Detail />
    </div>
  );
}

export default App;
