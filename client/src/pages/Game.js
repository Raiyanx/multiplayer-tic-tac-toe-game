import "./Game.css"
import GameScript from "./GameScript"
import { useEffect } from "react"


export default function Game(){

    useEffect(()=>{
        GameScript();
    },[])

    return (<>
    <div className="board" id="board">
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
        <div className="cell" data-cell></div>
    </div>
    <div className="winning-message" id="winningMessage">
        <div data-winning-message-text></div>
        <button id="restartButton">Restart</button>
    </div>
    </>)
}