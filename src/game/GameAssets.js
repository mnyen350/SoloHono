import GameAudio from "./GameAudio";

export default class GameAssets {
    _images;
    _sounds;
    _game;

    get game() { return this._game; }
    get images() { return this._images; }
    get sounds() { return this._sounds; }

    constructor(game) {
        this._game = game;
    }

    async load() {
        console.log('Loading assets...');
        const graphics = this.game.graphics;

        this._images = {
            //
            attackButton: await graphics.loadImage('/assets/attack.png'),
            //
            floor: await graphics.loadImage('/assets/floor.png'),
            wall: await graphics.loadImage('/assets/wall.png'),
            path: await graphics.loadImage('/assets/path.png'),
            blackspace: await graphics.loadImage('/assets/blackspace.png'),
            player: await graphics.loadImage('/assets/player.png'),
            enemy: await graphics.loadImage('/assets/enemy.png'),
            door: await graphics.loadImage('/assets/door.png'),

            mainMenu: {
                bg: await graphics.loadImage("/assets/mainmenu/bg.png"),
                loadgame1: await graphics.loadImage("/assets/mainmenu/loadgamev1.png"),
                loadgame2: await graphics.loadImage("/assets/mainmenu/loadgamev2.png"),
                newgame1: await graphics.loadImage("/assets/mainmenu/newgamev1.png"),
                newgame2: await graphics.loadImage("/assets/mainmenu/newgamev2.png"),
                exit1: await graphics.loadImage("/assets/mainmenu/exitv1.png"),
                exit2: await graphics.loadImage("/assets/mainmenu/exitv2.png"),
                options1: await graphics.loadImage("/assets/mainmenu/optionsv1.png"),
                options2: await graphics.loadImage("/assets/mainmenu/optionsv2.png")
            },

            optionsMenu: {
                bg: await graphics.loadImage("/assets/optionsmenu/bg.png"),
                plus1: await graphics.loadImage("/assets/optionsmenu/plusv1.png"),
                plus2: await graphics.loadImage("/assets/optionsmenu/plusv2.png"),
                minus1: await graphics.loadImage("/assets/optionsmenu/minusv1.png"),
                minus2: await graphics.loadImage("/assets/optionsmenu/minusv2.png"),
                back1: await graphics.loadImage("/assets/optionsmenu/backv1.png"),
                back2: await graphics.loadImage("/assets/optionsmenu/backv2.png")
            }
        };

        this._sounds = {
            test: new GameAudio(this.game, '/assets/sounds/test.wav'),
            startGame: new GameAudio(this.game, '/assets/sounds/mainmenu.mp3', { loop: true, _isMusic: true }),
            mainGame: new GameAudio(this.game, '/assets/sounds/gamebgm.mp3', { loop: true, _isMusic: true }),
            attack: new GameAudio(this.game, '/assets/sounds/attack.mp3')
        };

        console.log('All assets loaded!');
    }
}