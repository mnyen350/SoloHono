import GameAssets from "./GameAssets";
import GameGraphics from "./GameGraphics";
import Random from "./Random";
import EndGameScene from "./scenes/EndGameScene";
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
    _damages;

    // settings
    _soundVolume;
    _musicVolume;

    _exited;
    _removeEvents;

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

    get player() { return this._mainScene.player; }

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }
    get random() { return this._random; }
    get damages() { return this._damages; }
    get score() {

        // maybe score should be more than just gold?
        // enemies killed? idk.
        if (this._mainScene && this._mainScene._player)
            return this._mainScene._player.gold;

        return 0;
    }

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
        window.__GAME__ = this;

        this._soundVolume = 1.0;
        this._musicVolume = 0.1;
        this._damages = [];
        this._exited = false;

        this._graphics = new GameGraphics();
        this._assets = new GameAssets(this);
        this._random = new Random(123); // we pick a static seed for consistent testing
    }

    isMovable(x, y, empty) {
        return this._mainScene.isMovable(x, y, empty);
    }

    deleteObject(obj) {
        this._mainScene.deleteObject(obj);
    }

    tryMoveObject(obj, dstX, dstY) {
        return this._mainScene.tryMoveObject(obj, dstX, dstY);
    }

    isAdjacentObjects({ x, y }, { x: x2, y: y2 }) {
        let dx = Math.abs(x - x2);
        let dy = Math.abs(y - y2);
        return (dx <= 1) && (dy <= 1);
    }

    async start() {
        try {
            await this.graphics.load();
            await this.assets.load();
            this.addEvents();

            this._menuScene = new StartGameScene(this);
            //this._menuScene = new EndGameScene(this, true);

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

            if (this._exited == 1) {
                this._exited = 2;
                return;
            }

            // new to create the scene
            if (!this._mainScene) {
                this._damages = [];
                this._mainScene = new MainGameScene(this);
                await this._mainScene.loadLevelDesign(1);
            }

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

            if (!this._menuScene && this.damages.length > 0) {
                const now = Date.now();
                const d = this.damages[0];

                if (!d.firstDrawTime) {
                    d.firstDrawTime = now;
                    this.assets.sounds.attack.play();
                }

                if ((now - d.firstDrawTime) >= 1000) {
                    this.damages.shift(); // remove first
                    this._mainScene.redraw();
                }
            }

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

        let selectstart = () => false;
        let mousedown = (e) => e.preventDefault();

        this.graphics.canvas.addEventListener("mousemove", handleMouseMoveEvent);
        this.graphics.canvas.addEventListener("click", handleClickEvent);
        this.graphics.canvas.addEventListener("contextmenu", handleContextMenu);
        this.graphics.canvas.addEventListener("selectstart", selectstart);
        this.graphics.canvas.addEventListener("mousedown", mousedown);
        window.addEventListener("keydown", handleKeyDownEvent);

        this._removeEvents = () => {
            this.graphics.canvas.removeEventListener("mousemove", handleMouseMoveEvent);
            this.graphics.canvas.removeEventListener("click", handleClickEvent);
            this.graphics.canvas.removeEventListener("contextmenu", handleContextMenu);
            this.graphics.canvas.removeEventListener("selectstart", selectstart);
            this.graphics.canvas.removeEventListener("mousedown", mousedown);
            window.removeEventListener("keydown", handleKeyDownEvent);
        };

        window.requestAnimationFrame(requestAnimationFrame);
    }

    exit() {
        console.log('exiting');

        this._exited = 1; // start exit seq

        for (const sound of Object.values(this.assets.sounds)) {
            sound.pause();
        }

        this.graphics.canvas.classList.remove("pointer");
        this._removeEvents();

        let clearGraphics = () => {
            if (this._exited != 2) { // wait for animation frame loop to die
                setTimeout(clearGraphics, 100);
                return;
            }

            const white = this.graphics.createCanvas();
            const ctx = white.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, white.width, white.height);
            this.graphics.drawCanvas(white, 0, 0, white.width, white.height);
        }

        clearGraphics();
        window.__GAME__ = null;
    }
}