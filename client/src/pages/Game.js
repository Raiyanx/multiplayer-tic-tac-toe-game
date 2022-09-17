import "./Game.css"
import React from "react"
import socket from "../socket"

const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6] 
]

class Game extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props)
        this.currentPlayer = ((this.props["firstplayer"])==="1");
        this.state={
            currentPlayer: ((this.props["firstplayer"])==="1"),
            currentPlayerCross: (((this.props["firstplayer"])==="1")?((this.props["cross"])==="1") : ((this.props["cross"])==="0"))
        }
        this.room = props["roomCode"];
        this.cross = (props["cross"]==="1");
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.isDraw = this.isDraw.bind(this);
        this.placeMark = this.placeMark.bind(this);
        this.swapTurns = this.swapTurns.bind(this);
//        this.setBoardHoverClass = this.setBoardHoverClass.bind(this);
        this.checkWin = this.checkWin.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handlerestartbutton = this.handlerestartbutton.bind(this);
    }

     

    placeMark(cell, currentClass){
        cell.classList.add(currentClass)
    }

    startGame(){
        this.setState((state,props) => ({
            currentPlayer: ((props["firstplayer"])==="1"),
            currentPlayerCross: (((props["firstplayer"])==="1")?((props["cross"])==="1") : ((props["cross"])==="0"))
        }))
        this.currentPlayer = ((this.props["firstplayer"])==="1");
        const cellElements = document.querySelectorAll('[data-cell]')
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(CIRCLE_CLASS)
            cell.removeEventListener('click', this.handleClick)
            cell.addEventListener('click', this.handleClick)
        })
//        this.setBoardHoverClass();
    }

    handleClick(e){
        console.log("Inside handleClick")
        if(!this.state.currentPlayer){
            alert("It is not your turn!");
        }
        else if(e.target.classList.contains(X_CLASS) || e.target.classList.contains(CIRCLE_CLASS)){
            alert("This cell is already filled!")
        }
        else{
            const cell = e.target
            const currentClass = this.state.currentPlayerCross ? X_CLASS : CIRCLE_CLASS
            this.placeMark(cell, currentClass)   
            socket.emit("trigger-click", this.room, cell.id);
            
            if(this.checkWin(currentClass)){
                this.endGame(false)
            } else if(this.isDraw()) {
                this.endGame(true)
            } else{
                this.swapTurns()
//                this.setBoardHoverClass()
                console.log("cell triggered");
            }
            
        }
    }
 
    endGame(draw) {
        const winningMessageElement = document.getElementById('winningMessage')
        const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
        if(draw){
            winningMessageTextElement.innerText = 'Draw!'
        } else {
            winningMessageTextElement.innerText = `${this.state.currentPlayerCross ? "X's" : "O's"} Wins!`
        }
        winningMessageElement.classList.add('show')
    }

    isDraw() {
        const cellElements = document.querySelectorAll('[data-cell]');
        return [...cellElements].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
        })
    }

    

    swapTurns() {
        console.log("swapping turns");
        this.setState((state,props) => ({
            currentPlayer: !state.currentPlayer,
            currentPlayerCross: !state.currentPlayerCross
        }))
        this.currentPlayer = !this.currentPlayer;
    }

    /*
    setBoardHoverClass(){
        const board = document.getElementById('board');
        board.classList.remove(X_CLASS)
        board.classList.remove(CIRCLE_CLASS)
        if(this.state.currentPlayerCross){
            board.classList.add(X_CLASS)
        }
        else{
            board.classList.add(CIRCLE_CLASS)
        }
    }
 */
    checkWin(currentClass) {
        const cellElements = document.querySelectorAll('[data-cell]');
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass)
            })
        })
    }

    handlerestartbutton(){
        const winningMessageElement = document.getElementById('winningMessage')
        winningMessageElement.classList.remove('show')
        this.startGame();
        socket.emit("restart-game", this.room);
    }
    
    componentDidMount(){

        

        this.startGame();
        const restartButton = document.getElementById("restartButton");
        restartButton.addEventListener('click', this.handlerestartbutton)
        socket.on("trigger-cell", id => {
            console.log("cell triggered here ");
            console.log(this.currentPlayer);
            if(!this.currentPlayer){
                const cell = document.getElementById(id);
                const currentClass = this.state.currentPlayerCross ? X_CLASS : CIRCLE_CLASS
                this.placeMark(cell, currentClass)    
                this.swapTurns()
//                this.setBoardHoverClass()
                
                if(this.checkWin(currentClass)){
                    this.endGame(false)
                } else if(this.isDraw()) {
                    this.endGame(true)
                } else{
                    console.log(this.state.currentPlayer);
                    console.log(this.state.currentPlayerCross);
                    console.log("cell trigger received");
                }
            }
        })
        socket.on("receive-restart-game", () => {
            const winningMessageElement = document.getElementById('winningMessage')
            winningMessageElement.classList.remove('show')
            this.startGame();
        })
    }
   
       

    render(){ 
        return(
            <>
            <div className="board" id="board">
                <div className="cell" id="0" data-cell></div>
                <div className="cell" id="1" data-cell></div>
                <div className="cell" id="2" data-cell></div>
                <div className="cell" id="3" data-cell></div>
                <div className="cell" id="4" data-cell></div>
                <div className="cell" id="5" data-cell></div>
                <div className="cell" id="6" data-cell></div>
                <div className="cell" id="7" data-cell></div>
                <div className="cell" id="8" data-cell></div>
            </div>
            <div className="winning-message" id="winningMessage">
                <div data-winning-message-text></div>
                <button id="restartButton">
                    Restart
                </button>
            </div>
        </>
        )}

}

export default Game;

/*

export default function Game(props){

    console.log(`roomCode = ${props.roomCode}`);
    console.log(`cross = ${props.cross}`);
    console.log(`firstPlayer = ${props.firstplayer}`);
    
    const X_CLASS = 'x'
    const CIRCLE_CLASS = 'circle'
    const WINNING_COMBINATIONS = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6] 
    ]

    const room = props["roomCode"];
    const cross = (props["cross"]==="1");
    const [currentPlayer, setCurrentPlayer] = useState(props["firstplayer"]==="1");
    const [currentPlayerCross, setCurrentPlayerCross] = useState((props["firstplayer"]==="1")?(props["cross"]==="1") : (props["cross"]==="0"));

    startGame()
    
    function startGame(){
        console.log("starting game");
        const cellElements = document.querySelectorAll('[data-cell]');
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(CIRCLE_CLASS)
            cell.removeEventListener('click', handleClick)
            cell.addEventListener('click', handleClick)
        })
        setBoardHoverClass()
        document.querySelector('[data-winning-message-text]').classList.remove('show')
    }

    function handleClick(e) {

        if(!(currentPlayer)){
            alert("It is not your turn!");
        }
        else{
            const cell = e.target
            const currentClass = cross ? X_CLASS : CIRCLE_CLASS
            placeMark(cell, currentClass)
            
            if(checkWin(currentClass)){
                endGame(false)
            } else if(isDraw()) {
                endGame(true)
            } else{
                swapTurns()
                setBoardHoverClass()
            }

            socket.emit("trigger-click", room, cell.id);
        }
    }

    function endGame(draw) {
        const winningMessageElement = document.getElementById('winningMessage')
        const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
        if(draw){
            winningMessageTextElement.innerText = 'Draw!'
        } else {
            winningMessageTextElement.innerText = `${currentPlayerCross ? "X's" : "O's"} Wins!`
        }
        winningMessageElement.classList.add('show')
    }

    function isDraw() {
        const cellElements = document.querySelectorAll('[data-cell]');
        return [...cellElements].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
        })
    }

    function placeMark(cell, currentClass){
        cell.classList.add(currentClass)
    }

    function swapTurns() {
        setCurrentPlayer(!currentPlayer);
        setCurrentPlayerCross(!currentPlayerCross);
    }

    function setBoardHoverClass(){
        const board = document.getElementById('board');
        board.classList.remove(X_CLASS)
        board.classList.remove(CIRCLE_CLASS)
        if(currentPlayerCross){
            board.classList.add(X_CLASS)
        }
        else{
            board.classList.add(CIRCLE_CLASS)
        }
    }

    function checkWin(currentClass) {
        const cellElements = document.querySelectorAll('[data-cell]');
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass)
            })
        })
    }

    socket.on("trigger-cell", id => {
        const cell = document.getElementById(id);
        const currentClass = currentPlayerCross ? X_CLASS : CIRCLE_CLASS
            placeMark(cell, currentClass)
            
            if(checkWin(currentClass)){
                endGame(false)
            } else if(isDraw()) {
                endGame(true)
            } else{
                swapTurns()
                setBoardHoverClass()
            }
    })



    return (<>
    <div className="board" id="board">
        <div className="cell" id="0" onClick={handleClick} data-cell></div>
        <div className="cell" id="1" onClick={handleClick} data-cell></div>
        <div className="cell" id="2" onClick={handleClick} data-cell></div>
        <div className="cell" id="3" onClick={handleClick} data-cell></div>
        <div className="cell" id="4" onClick={handleClick} data-cell></div>
        <div className="cell" id="5" onClick={handleClick} data-cell></div>
        <div className="cell" id="6" onClick={handleClick} data-cell></div>
        <div className="cell" id="7" onClick={handleClick} data-cell></div>
        <div className="cell" id="8" onClick={handleClick} data-cell></div>
    </div>
    <div className="winning-message" id="winningMessage">
        <div data-winning-message-text></div>
        <button id="restartButton" onClick={startGame}>
            Restart
        </button>
    </div>
    </>)
}

*/