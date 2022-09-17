import './App.css';
import Game from './pages/Game';
import { code } from './variables';
import { useState } from 'react';
import socket from './socket';

function App() {

  const [ cross, setCross ] = useState("1");
  const [ room, setRoom ] = useState(code);
  const [ first, setFirst ] = useState("1");
  const [ gameVisible, setGameVisible ] = useState(false);

  function handleSetCross(event){
    setCross(event.target.value)
  }

  function handleSetFirst(event){
    setFirst(event.target.value);
  }

  function createButtonFirstClick(event) {
    hide(document.getElementById("create-room-first"));
    hide(document.getElementById("join-room"));
    unhide( document.getElementById("create-room-second"));
  }

  function createButtonSecondClick(event) {
    event.preventDefault();
    const shareCode = document.getElementById("share-code");

    hide(document.getElementById("create-room-second"))
    unhide(shareCode);

    setRoom(code);

    socket.emit("create-room", room, cross, first);

    console.log(`Your room is: ${room}`);
    console.log(`Your symbol is ${cross==="1" ? "X" : "O"}`);
    console.log(`Your turn is ${first==="1" ? "first" : "second"}`);

  }

  function joinRoomButtonClick(event){
    event.preventDefault();
    const roomInput = document.getElementById("room-input");

    setRoom(roomInput.value)

    socket.emit("join-room", roomInput.value, (num, crossval, firstval) => {
      if(num === 0){
        alert("There are no such rooms");
      }
      else if(num === 1){
        console.log(`crossval = ${crossval}`);
        console.log(`firstval = ${firstval}`)
        setFirst((firstval==="1" ? "0" : "1")); 
        setCross((crossval==="1" ? "0" : "1"))
        console.log(`first is ${first}`);
        console.log(`cross is ${cross}`)
        const joinRoom = document.getElementById("join-room");

        alert(`You joined ${room}`);
        hide(document.getElementById("create-room"));
        hide(joinRoom);
        setGameVisible(true);
        socket.emit("joined-room", room);
        console.log("emited joined-room");
        console.log(`Your room is: ${room}`);
        console.log(`Your symbol is ${cross==="1" ? "X" : "O"}`);
        console.log(`Your turn is ${first==="1" ? "first" : "second"}`);
      }
      else{
        alert("There are already 2 people in this room");
      }
    })
  }

  socket.on("confirmed-joined-room", id => {
      console.log("confirmed-joined-room");
  //    alert(`${id} joined your room`)
      hide(document.getElementById("create-room"));
      setGameVisible(true);
  })


  
  return (
    <div className="App">
      <h2>Welcome to Tic-Tac-Toe!</h2>
          
          <div id="create-room">
            <div id="create-room-first">
              <label>Create a room: </label>
              <button id="create-button-first" onClick={createButtonFirstClick}>Create room</button>
            </div>
            <div className='hide' id='create-room-second'>
              <form onSubmit={createButtonSecondClick}>
                <label>Choose your symbol: </label>
                <select id="symbol" value={cross} onChange={handleSetCross}>
                  <option value="1">X</option>
                  <option value="0">O</option>
                </select>
              
                <br />

                <label>Play as: </label>
                <select id="first-player" value={first} onChange={handleSetFirst}>
                  <option value="1">First Player</option>
                  <option value="0">Second Player</option>
                </select>

                <br />

                <input type="submit" value="Create Room"  id="create-button-second" />
              </form>

            </div>
            <div className="hide" id="share-code">

              <label>Share this code with your friend: <h3>{code}</h3></label>
              
            </div>
          </div>


          <div id="join-room">
            <form onSubmit={joinRoomButtonClick}>
              <label>Or join someone else's Room: </label>
              <input type="text" id="room-input"  onChange={e => setRoom(e.target.value)} />
              <input type="submit" value="Join room" id="join-button" />
            </form>
          </div>

      <div id="game">
        {gameVisible ? 
        <Game 
          roomCode= {room}
          cross= {cross}
          firstplayer= {first}
        /> : null}
      </div>


    </div>
  );
}

function hide(elem){
  elem.classList.add('hide');
}

function unhide(elem){
  elem.classList.remove('hide');
}

export default App;
