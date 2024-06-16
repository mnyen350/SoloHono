import './App.css';
import { Game } from "./game";
import { useEffect } from "react";

function App() {
  function startGame(e) {
    //console.log(e);
    if (Game.Instance) {
      const game = Game.Instance;
      game.exit();
      e.target.innerHTML = "Start";
    }
    else {
      const game = new Game();
      game.start();
      e.target.innerHTML = "Stop";
    }
  }

  return (
    <div className="App">
      <div>
        <button onClick={startGame} style={{ "marginBottom": "10px" }}>Start</button>
        <br></br>
        <canvas id="myCanvas">
        </canvas>
      </div>
    </div>
  );
}

export default App;
