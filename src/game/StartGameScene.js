import Scene from "./Scene";

class SceneButton {
    isHovered;
    x;
    y;
    normalAsset;
    hoverAsset;

    get asset() { return this.isHovered ? this.hoverAsset : this.normalAsset; }

    constructor(x, y, normalAsset, hoverAsset) {
        this.isHovered = false;
        this.x = x;
        this.y = y;
        this.normalAsset = normalAsset;
        this.hoverAsset = hoverAsset;
    }
}

export default class StartGameScene extends Scene {
    constructor(game) {
        super(game);
    }

    async load() {
        const text1 = await this.graphics.loadImage("/assets/mainmenu/text1.png");
        const text2 = await this.graphics.loadImage("/assets/mainmenu/text2.png");

        const btn = this.createButton(100, 100, text1);
        btn.addEventListener("hoverchange", (e) => e.detail.newValue ? btn.setAsset(text2) : btn.setAsset(text1));
        btn.addEventListener("click", (e) => {
            this.close();
        });
    }

    async _draw() {
        //const test = this.graphics.createCanvas();
        //const ctx = test.getContext('2d');
        //ctx.font = "48px serif";
        //ctx.strokeText("Hello world", 10, 50);

        const bg = await this.graphics.loadImage("/assets/mainmenu/bg.png");
        await this.graphics.drawImage(bg, 0, 0, bg.width, bg.height);
        await this._drawButtons();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);
    }
}