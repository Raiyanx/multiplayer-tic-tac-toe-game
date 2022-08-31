import { Link } from 'react-router-dom';

export default function Home(props){
    return (<>
        <h2>Welcome to Tic-Tac-Toe!</h2>
        <form>
            <div>
                <label>To play with someone else, send them this code <h3>{props.socketId}</h3> and then click </label>
                <Link to="/game">Play</Link>
            </div>
            <br />
            <div>
                <label>Or join Someone Else's Room: </label>
                <input type="text" />
                <button>Join room</button>
            </div>
        </form>
    </>)
}