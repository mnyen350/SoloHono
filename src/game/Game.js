import GameAssets from "./GameAssets";
import GameGraphics from "./GameGraphics";
import Random from "./Random";
import MainGameScene from "./scenes/MainGameScene";
import StartGameScene from "./scenes/StartGameScene";

export default class Game {
    static _instance;

    static get Instance() { return this._instance; }
    static get Width() { return 79; }
    static get Height() { return 35; }

    _graphics;
    _assets;
    _random;
    _mainScene;
    _menuScene;

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }
    get random() { return this._random; }
    get activeScene() { return (this._menuScene) ? (this._menuScene) : (this._mainScene); }

    constructor() {
        Game._instance = this;

        this._graphics = new GameGraphics();
        this._assets = new GameAssets();
        this._random = new Random(123); // we pick a static seed for consistent testing
        this._mainScene = new MainGameScene(this);
        this._menuScene = new StartGameScene(this);
    }

    isMovable(x, y, empty) {
        return this._mainScene.isMovable(x, y, empty);
    }

    tryMoveObject(obj, dstX, dstY) {
        return this._mainScene.tryMoveObject(obj, dstX, dstY);
    }

    async start() {
        try {
            await this.graphics.load();
            await this.assets.load(this._graphics);
            await this._menuScene.load();
            await this._mainScene.load();
            await this._mainScene.loadLevel(1);
            this.addEvents();
        } catch (ex) {
            console.log('Failed to start game');
            console.error(ex);
        }
    }

    addEvents() {
        let handleKeyDownEvent = (e) => {
            //const start = new Date().getTime();
            this.activeScene.handleKeyDownEvent(e);
            //console.log('kd', new Date().getTime() - start);
        };

        let requestAnimationFrame = async(timeStamp) => {
            if (this._menuScene && this._menuScene.isClosed)
                this._menuScene = null;

            const scene = this.activeScene;
            await scene.draw();

            // continue
            window.requestAnimationFrame(requestAnimationFrame);
        };

        let handleMouseMoveEvent = (e) => {
            this.activeScene.handleMouseMoveEvent(e);
        };

        let handleClickEvent = (e) => {
            this.activeScene.handleClickEvent(e);
        };

        this.graphics.canvas.addEventListener("mousemove", handleMouseMoveEvent);
        this.graphics.canvas.addEventListener("click", handleClickEvent);
        window.addEventListener("keydown", handleKeyDownEvent);
        window.requestAnimationFrame(requestAnimationFrame);
    }
}