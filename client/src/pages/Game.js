import "./Game.css"
import GameScript from "./GameScript"
import { useEffect } from "react"

export default function Game(){

    useEffect(()=>{
        GameScript();
    },[])

    return (<>
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
    </>)
}