import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';

export default function Home(props){

    useEffect(() => {
        const joinRoomButton = document.getElementById("join-button");
        const roomInput = document.getElementById("room-id");
        const room = roomInput.value;
        joinRoomButton.addEventListener("click", handleClick)
        function handleClick() {
            socket.emit('join-room', room, () => {
                alert("There are already 2 players in this room. Please select another room.")
            });
        }
        

        return (() => {
            joinRoomButton.removeEventListener("click", handleClick);
        })
    }, [])

    return (<>
        <h2>Welcome to Tic-Tac-Toe!</h2>
            <div>
                <label>To play with someone else, send this code to them<h3>{props.socketId}</h3></label>
            </div>
            <br />
            <div>
                <label>Or join Someone Else's Room: </label>
                <input type="text" id="room-id" />
                <button id="join-button">Join room</button>
            </div>
            <br />
            <div>
                <label> and then click </label>
                <Link to="/game">Play</Link>
            </div>
    </>)
}