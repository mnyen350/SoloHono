import NotImplementedError from "../NotImplementedError";

class SceneButton extends EventTarget {
    _isHovered;
    _x;
    _y;
    _asset;
    _defaultAsset;
    _isVisible;

    get isHovered() { return this._isHovered; }
    get asset() { return this._asset; }
    get x() { return this._x; }
    get y() { return this._y; }

    get isVisible() { return this._isVisible; }
    set isVisible(value) { this._isVisible = value; }

    constructor(x, y, defaultAsset) {
        super();
        this._isHovered = false;
        this._x = x;
        this._y = y;
        this._defaultAsset = defaultAsset;
        this._asset = defaultAsset;
        this._isVisible = true;
    }

    setAsset(asset) {
        this._asset = asset ? asset : this.defaultAsset;
    }

    isOverlap(x, y) {
        const btn = this;
        return (x >= btn.x && y >= btn.y) &&
            (x <= (btn.x + btn.asset.width)) &&
            (y <= (btn.y + btn.asset.height))
    }
}

export default class Scene {
    _game;
    _graphics;
    _assets;
    _needRedraw;
    _mouse;
    _buttons = [];
    _isClosed;
    _isActive;
    _isLoaded;
    _showPointer;

    get game() { return this._game; }
    get graphics() { return this._game.graphics; }
    get assets() { return this._game.assets; }
    get random() { return this._game.random; }
    get mouse() { return this._mouse; }

    get isClosed() { return this._isClosed; }

    get isActive() { return this._isActive; }
    set isActive(value) { this._isActive = value; }

    get isLoaded() { return this._isLoaded; }

    constructor(game) {
        this._game = game;
        this._needRedraw = true;
        this._mouse = { x: 0, y: 0 };
        this._buttons = [];
        this._isClosed = false;
        this._isActive = false;
        this._isLoaded = false;
        this._showPointer = false;
    }

    close() {
        this._isClosed = true;
    }

    async load() {
        this._isLoaded = true;
    }
    async unload() {}
    async updateActiveScene(isActive) {}

    _draw() {
        throw new NotImplementedError();
    }
    redraw() { this._needRedraw = true; }
    draw() {
        if (this._needRedraw) {
            //const start = new Date().getTime();
            this._draw();
            //console.log('drawing time: ', new Date().getTime() - start);
            this._needRedraw = false;
        }
    }

    handleKeyDownEvent(e) {}

    handleContextMenu(e) {}

    handleMouseMoveEvent(e) {
        this._showPointer = false;
        this.mouse.x = Math.max(Math.min(this.graphics.width, e.offsetX), 0);
        this.mouse.y = Math.max(Math.min(this.graphics.height, e.offsetY), 0);
        this._handleButtons();
    }

    adjustPointer() {
        if (this._showPointer) {
            this.graphics.canvas.classList.add("pointer");
        } else {
            this.graphics.canvas.classList.remove("pointer");
        }
    }

    handleClickEvent(e) {
        const btn = this._buttons.find(b => b.isVisible && b.isOverlap(e.offsetX, e.offsetY));
        if (btn)
            btn.dispatchEvent(new CustomEvent("click", { detail: { originalEvent: e } }));
    }

    _drawButtons() {
        for (const btn of this._buttons.filter(b => b.isVisible)) {
            const asset = btn.asset;
            this.graphics.drawImage(asset, btn.x, btn.y, asset.width, asset.height);
        }
    }
    _handleButtons() {
        let anyHovered = false;

        for (const btn of this._buttons.filter(b => b.isVisible)) {
            const isHovered = btn.isOverlap(this.mouse.x, this.mouse.y);
            if (isHovered !== btn.isHovered) {
                btn._isHovered = isHovered;
                btn.dispatchEvent(new CustomEvent("hoverchange", { detail: { oldValue: !isHovered, newValue: isHovered } }));
                this.redraw(); // request a redraw
            }
            anyHovered = anyHovered || isHovered;
        }

        this._showPointer = this._showPointer || anyHovered;
    }

    createButton(x, y, asset) {
        let btn = new SceneButton(x, y, asset);
        this._buttons.push(btn);
        return btn;
    }
}