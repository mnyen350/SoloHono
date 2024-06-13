import OptionsScene from "./OptionsScene";
import Scene from "./Scene";

export default class StartGameScene extends Scene {
    _bg;

    get isActive() { return super.isActive; }
    set isActive(value) {
        if (this.isActive != value) {
            const music = this.assets.sounds.startGame;
            if (value)
                music.play();
            else
                music.pause();
        }
        super.isActive = value;
    }

    constructor(game) {
        super(game);
    }

    async load() {

        const {
            bg,
            loadgame1,
            loadgame2,
            newgame1,
            newgame2,
            exit1,
            exit2,
            options1,
            options2
        } = this.game.assets.images.mainMenu;

        this._bg = bg;

        const newGame = this.createButton(700, 15, newgame1);
        newGame.addEventListener("hoverchange", (e) => newGame.setAsset(newGame.isHovered ? newgame2 : newgame1));
        newGame.addEventListener("click", (e) => {
            this.close();
        });

        const loadGame = this.createButton(700, 15 + (newgame1.height + 20) * 1, loadgame1);
        loadGame.addEventListener("hoverchange", (e) => loadGame.setAsset(loadGame.isHovered ? loadgame2 : loadgame1));
        loadGame.addEventListener("click", (e) => {

        });

        const options = this.createButton(700, 15 + (newgame1.height + 20) * 2, options1);
        options.addEventListener("hoverchange", (e) => options.setAsset(options.isHovered ? options2 : options1));
        options.addEventListener("click", (e) => {
            console.log('options clicked');
            this.game.menuScene = new OptionsScene(this.game);
        });

        const exit = this.createButton(700, 15 + (newgame1.height + 20) * 3, exit1);
        exit.addEventListener("hoverchange", (e) => exit.setAsset(exit.isHovered ? exit2 : exit1));
        exit.addEventListener("click", (e) => {

        });

        await super.load();
    }

    _draw() {
        const bg = this._bg;
        this.graphics.drawImage(bg, 0, 0, bg.width, bg.height);
        this._drawButtons();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);
    }
}