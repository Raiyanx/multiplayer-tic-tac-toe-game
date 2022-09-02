import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';
import "./Home.css";


export default function Home(){

    const code = makeCode(17);

    useEffect(() => {
        const joinRoomButton = document.getElementById("join-button");
        
        const createRoomButton = document.getElementById("create-button");
        const codeLabel = document.getElementById('share-code');
        const joinRoom = document.getElementById('join-room');
        const createRoom = document.getElementById('create-room');
        const play = document.getElementById('play');

        createRoomButton.addEventListener("click", createRoomButtonHandlEClick);
        function createRoomButtonHandlEClick() {
            codeLabel.classList.remove('hide');
            joinRoom.classList.add('hide');
            createRoom.classList.add('hide');

            play.classList.remove('hide');
            socket.emit('create-room', code);
        }

        joinRoomButton.addEventListener("click", joinRoomButtonHandleClick)
        function joinRoomButtonHandleClick() {

            const roomInput = document.getElementById("room-input");
            const room = roomInput.value;

            socket.emit('join-room', room, (num) => {
                if(num === 0){
                    alert("There are no such rooms");
                }
                else if(num === 1){
                    joinRoom.classList.add('hide');
                    createRoom.classList.add('hide');
                    play.classList.remove('hide');

                    alert(`You joined ${room}`);
                }
                else{
                    alert("There are already 2 people in this room");
                }
            });

           
        }

        return (() => {
            joinRoomButton.removeEventListener("click", joinRoomButtonHandleClick);
            createRoomButton.removeEventListener("click", createRoomButtonHandlEClick);
        })
    }, [code])

    return (<>
        <h2>Welcome to Tic-Tac-Toe!</h2>
            <div>
                <div id="create-room">
                    <label>Create a room: </label>
                    <button id="create-button">Create room</button>
                </div>
                <label className='hide' id="share-code">Share this code with your friend: <h3>{code}</h3></label>
            </div>
            <br />
            <div id="join-room">
                <label>Or join someone else's Room: </label>
                <input type="text" id="room-input" />
                <button id="join-button">Join room</button>
            </div>
            <br />
            <div className='hide' id="play">
                <Link to="/game">Play</Link>
            </div>
    </>)
}

function makeCode(length) {
    var code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for(let i=0; i<length; i++){
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
}