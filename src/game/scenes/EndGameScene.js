import Scene from "./Scene";
import StartGameScene from "./StartGameScene";

export default class EndGameScene extends Scene {
    _bg;
    _lose;

    get isActive() { return super.isActive; }
    set isActive(value) {
        if (this.isActive != value) {
            const music = this._lose ? this.assets.sounds.death : this.assets.sounds.startGame;
            if (value)
                music.play();
            else
                music.pause();
        }
        super.isActive = value;
    }

    constructor(game, lose) {
        super(game);
        this._lose = lose;
    }

    async load() {

        const {
            bgWin,
            bgLose
        } = this.game.assets.images.endMenu;

        const {
            newgame1,
            newgame2,
            exit1,
            exit2
        } = this.game.assets.images.mainMenu;

        const {
            back1,
            back2
        } = this.game.assets.images.optionsMenu;

        this._bg = this._lose ? bgLose : bgWin;

        const newGame = this.createButton(700, 15, newgame1);
        newGame.addEventListener("hoverchange", (e) => newGame.setAsset(newGame.isHovered ? newgame2 : newgame1));
        newGame.addEventListener("click", (e) => {
            this.game._mainScene = null;
            this.close();
        });

        const back = this.createButton(700, 15 + (newgame1.height + 20) * 1, back1);
        back.addEventListener("hoverchange", (e) => back.setAsset(back.isHovered ? back2 : back1));
        back.addEventListener("click", (e) => {
            this.game.menuScene = new StartGameScene(this.game);
        });

        const exit = this.createButton(700, 15 + (newgame1.height + 20) * 2, exit1);
        exit.addEventListener("hoverchange", (e) => exit.setAsset(exit.isHovered ? exit2 : exit1));
        exit.addEventListener("click", (e) => {
            this.game.exit();
        });

        await super.load();
    }

    async _draw() {
        const bg = this._bg;
        this.graphics.drawImage(bg, 0, 0, bg.width, bg.height);
        await this.graphics.drawText(this.game.score.toString(), "70px serif", "white", 515, 460);
        this._drawButtons();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);
    }
}