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

    // settings
    _soundVolume;
    _musicVolume;

    set soundVolume(value) {
        this._soundVolume = value;
        this.adjustVolume();
    }
    get soundVolume() { return this._soundVolume; }
    set musicVolume(value) {
        this._musicVolume = value;
        this.adjustVolume();
    }
    get musicVolume() { return this._musicVolume; }

    adjustVolume() {
        // update all sounds
        for (const key in this.assets.sounds) {
            const sound = this.assets.sounds[key];
            sound.adjustVolume();
        }
    }

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }
    get random() { return this._random; }

    get menuScene() { return this._menuScene; }
    set menuScene(value) {
        if (this._menuScene && this._menuScene.isActive) {
            this._menuScene.isActive = false;
            this._menuScene.unload();
        }
        this._menuScene = value;
    }

    get activeScene() { return (this._menuScene) ? (this._menuScene) : (this._mainScene); }

    constructor() {
        Game._instance = this;

        this._soundVolume = 1.0;
        this._musicVolume = 1.0;

        this._graphics = new GameGraphics();
        this._assets = new GameAssets(this);
        this._random = new Random(123); // we pick a static seed for consistent testing
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
            await this.assets.load();
            this.addEvents();

            this._mainScene = new MainGameScene(this);
            this._menuScene = new StartGameScene(this);
            await this._mainScene.loadLevelDesign(1);
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

            if (this._menuScene && this._menuScene.isClosed) {
                this._menuScene.isActive = false;
                await this._menuScene.unload();
                this._menuScene = null;
            }

            if (!this._menuScene) {
                // no menu scene, so main scene is active
                if (!this._mainScene.isActive) {
                    this._mainScene.isActive = true;
                }
            } else if (!this._menuScene.isActive) {
                this._menuScene.isActive = true;
                this._mainScene.isActive = false;
            }

            const scene = this.activeScene;
            if (!scene.isLoaded) {
                await scene.load();
            }
            await scene.draw();

            // continue
            window.requestAnimationFrame(requestAnimationFrame);
        };

        let handleMouseMoveEvent = (e) => {
            this.activeScene.handleMouseMoveEvent(e);
            this.activeScene.adjustPointer();
        };

        let handleClickEvent = (e) => {
            this.activeScene.handleClickEvent(e);
            e.preventDefault();
            e.stopPropagation();
        };

        let handleContextMenu = (e) => {
            this.activeScene.handleContextMenu(e);
            e.preventDefault();
        }

        this.graphics.canvas.addEventListener("mousemove", handleMouseMoveEvent);
        this.graphics.canvas.addEventListener("click", handleClickEvent);
        this.graphics.canvas.addEventListener("contextmenu", handleContextMenu);
        this.graphics.canvas.addEventListener("selectstart", () => false);
        this.graphics.canvas.addEventListener("mousedown", (e) => e.preventDefault());
        window.addEventListener("keydown", handleKeyDownEvent);
        window.requestAnimationFrame(requestAnimationFrame);
    }
}