import './App.css';
import { Game } from "./game";
import { useEffect } from "react";

function App() {
  function startGame() {
    console.log('hello');
    if (window.__GAME__) return;
    const game = window.__GAME__ = new Game();

    (async function () {
      await game.start();
    })();
  }

  return (
    <div className="App">
      <button onClick={startGame}>Start Game</button>
      <br></br>
      <canvas id="myCanvas" style={{"border": "1px solid black"}}>
      </canvas>
    </div>
  );
}

export default App;
