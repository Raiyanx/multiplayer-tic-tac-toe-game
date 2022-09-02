import './App.css';
import { Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';


function App(props) {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Home  /> } />
        <Route path='game' element={ <Game /> } />
      </Routes>
    </div>
  );
}

export default App;
