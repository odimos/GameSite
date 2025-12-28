import gameOptions from "./gameconfig.js"
let { tileSize,tileSpacing,boardSize } = gameOptions

export default class Boot extends Phaser.Scene{
    constructor(config){
        super('Boot')
    }

    preload(){
        this.load.image('emptytile', 'assets/game/emptytile.png')

        this.load.spritesheet('tiles','assets/game/tiles.png',{
            frameWidth: tileSize,
            frameHeight: tileSize
        });

        this.load.audio('move','assets/sound/Jump_1.wav');
        this.load.audio('upgrade','assets/sound/Bubble_1.wav')
        this.load.audio('stack','assets/sound/Bubble_heavy_1.wav')

        this.load.image('restart', 'assets/interface/restart-text.png')
        this.load.image('restartImage', 'assets/interface/restartImage.png')

        this.load.image('emptyarea','assets/interface/area.png')
        this.load.image('emptyarea2','assets/interface/area2.png')

        this.load.image('sound_on','assets/interface/sound_on.png')
        this.load.image('sound_off','assets/interface/sound_off.png')

        this.load.bitmapFont('blackfont','assets/fonts/blackfont.png',
        'assets/fonts/blackfont.fnt');
        this.load.bitmapFont('whitefont','assets/fonts/Unnamed.png',
        'assets/fonts/Unnamed.fnt')
        
    }

    create(){
        this.scene.start('Play')
    }
}