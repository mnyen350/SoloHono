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
            enemyCrab: await graphics.loadImage('/assets/enemycrab.png'),
            enemyCrab2: await graphics.loadImage('/assets/enemycrab2.png'),
            door: await graphics.loadImage('/assets/door.png'),
            goldpile: await graphics.loadImage('/assets/goldpile.png'),
            potionattack: await graphics.loadImage('/assets/potionattack.png'),
            potionhealth: await graphics.loadImage('/assets/potionhealth.png'),

            damage: {
                0: await graphics.loadImage('/assets/damage/0.png'),
                1: await graphics.loadImage('/assets/damage/1.png'),
                2: await graphics.loadImage('/assets/damage/2.png'),
                3: await graphics.loadImage('/assets/damage/3.png'),
                4: await graphics.loadImage('/assets/damage/4.png'),
                5: await graphics.loadImage('/assets/damage/5.png'),
                6: await graphics.loadImage('/assets/damage/6.png'),
                7: await graphics.loadImage('/assets/damage/7.png'),
                8: await graphics.loadImage('/assets/damage/8.png'),
                9: await graphics.loadImage('/assets/damage/9.png'),
                10: await graphics.loadImage('/assets/damage/10.png'),
            },

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
            },

            endMenu: {
                bgLose: await graphics.loadImage("/assets/endmenu/losebg.png"),
                bgWin: await graphics.loadImage("/assets/endmenu/winbg.png")
            },
        };

        this._sounds = {
            test: new GameAudio(this.game, '/assets/sounds/test.wav'),
            startGame: new GameAudio(this.game, '/assets/sounds/mainmenu.mp3', { loop: true, _isMusic: true }),
            mainGame: new GameAudio(this.game, '/assets/sounds/gamebgm.mp3', { loop: true, _isMusic: true }),
            attack: new GameAudio(this.game, '/assets/sounds/attack.mp3', { playbackRate: 2.0 }),
            money: new GameAudio(this.game, '/assets/sounds/money.mp3'),
            death: new GameAudio(this.game, '/assets/sounds/death.mp3')
        };

        console.log('All assets loaded!');
    }
}