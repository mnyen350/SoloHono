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
      <canvas id="myCanvas" width="400" height="400">
      </canvas>
    </div>
  );
}

export default App;
