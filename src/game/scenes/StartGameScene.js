import Scene from "./Scene";

export default class StartGameScene extends Scene {
    _bg;

    constructor(game) {
        super(game);
    }

    async load() {
        const text1 = await this.graphics.loadImage("/assets/mainmenu/text1.png");
        const text2 = await this.graphics.loadImage("/assets/mainmenu/text2.png");
        this._bg = await this.graphics.loadImage("/assets/mainmenu/bg.png");

        const btn = this.createButton(100, 100, text1);
        btn.addEventListener("hoverchange", (e) => btn.isHovered ? btn.setAsset(text2) : btn.setAsset(text1));
        btn.addEventListener("click", (e) => {
            this.close();
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