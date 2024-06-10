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
        this._bg = await this.graphics.loadImage("/assets/mainmenu/bg.png");

        const loadgame1 = await this.graphics.loadImage("/assets/mainmenu/loadgamev1.png");
        const loadgame2 = await this.graphics.loadImage("/assets/mainmenu/loadgamev2.png");

        const newgame1 = await this.graphics.loadImage("/assets/mainmenu/newgamev1.png");
        const newgame2 = await this.graphics.loadImage("/assets/mainmenu/newgamev2.png");

        const exit1 = await this.graphics.loadImage("/assets/mainmenu/exitv1.png");
        const exit2 = await this.graphics.loadImage("/assets/mainmenu/exitv2.png");

        const options1 = await this.graphics.loadImage("/assets/mainmenu/optionsv1.png");
        const options2 = await this.graphics.loadImage("/assets/mainmenu/optionsv2.png");

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

        });

        const exit = this.createButton(700, 15 + (newgame1.height + 20) * 3, exit1);
        exit.addEventListener("hoverchange", (e) => exit.setAsset(exit.isHovered ? exit2 : exit1));
        exit.addEventListener("click", (e) => {

        });
    }

    _draw() {
        //const test = this.graphics.createCanvas();
        //const ctx = test.getContext('2d');
        //ctx.font = "48px serif";
        //ctx.strokeText("Hello world", 10, 50);

        const bg = this._bg;
        this.graphics.drawImage(bg, 0, 0, bg.width, bg.height);
        this._drawButtons();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);
    }
}