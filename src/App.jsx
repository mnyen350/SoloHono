import './App.css';
import { Game } from "./game";
import { useEffect } from "react";

function App() {

  useEffect(() => {

    if (!window.__GAME__) {
      console.log('Starting game!');
      const game = window.__GAME__ = new Game();

      (async function () {
        await game.start();
      })();
    }

  }, []);

  return (
    <div className="App">
      <canvas id="myCanvas" style={{"border": "1px solid black"}}>
      </canvas>
    </div>
  );
}

export default App;
