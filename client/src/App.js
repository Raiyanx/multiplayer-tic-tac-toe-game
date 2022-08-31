import './App.css';
import { Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';
import { useState } from 'react';

import { io } from "socket.io-client"

const socket = io('http://localhost:3000')

function App(props) {

  const [ socketId, setId ] = useState(null);

  socket.on('connect', () => {
    console.log(socket.id);
    setId(socket.id);
  })

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Home socketId = {socketId} /> } />
        <Route path='game' element={ <Game /> } />
      </Routes>
    </div>
  );
}

export default App;
