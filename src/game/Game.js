import AssetManager from "./AssetManager";
import GameGraphics from "./GameGraphics";
import MainGameScene from "./MainGameScene";
import StartGameScene from "./StartGameScene";

export default class Game {
    static get Width() { return 79; }
    static get Height() { return 35; }

    _graphics;
    _assets;
    _mainScene;
    _menuScene;

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }
    get activeScene() { return (this._menuScene) ? (this._menuScene) : (this._mainScene); }

    constructor() {
        this._graphics = new GameGraphics();
        this._assets = new AssetManager();
        this._mainScene = new MainGameScene(this);
        this._menuScene = new StartGameScene(this);
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
            this.activeScene.handleKeyDownEvent(e);
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