import gameOptions,{directions} from "./gameconfig.js"
let { tileSize,tileSpacing,boardSize, tweenSpeed } = gameOptions

export function createContainers(){
    // first container
    const container = this.add.container(0,gameOptions.containerOffsetY)
    container.setSize(gameOptions.containerW,gameOptions.containerH)
    let bg_filler = this.add.rectangle(0, 0, gameOptions.containerW, gameOptions.containerH, 
        Phaser.Display.Color.GetColor(240, 240, 240))
    .setOrigin(0,0)
    container.add(bg_filler)

    // second container
    let xCenter = (container.width-gameOptions.gameW)/2;
    let yCenter = (container.height-gameOptions.gameH)/2;
    const tightcontainer = this.add.container(xCenter,gameOptions.containerOffsetY+yCenter)
    tightcontainer.setSize(gameOptions.gameW,gameOptions.gameH)

    return tightcontainer
}

export function createInterface(){

    let fullWidth = this.container.width;
    let restartPos = {
        x: fullWidth-gameOptions.tileSpacing,
        width: fullWidth/4
    }
    let soundPos = {
        x:0}

    const restart = this.add.sprite(restartPos.x,
        gameOptions.containerOffsetY-10,'restart').setOrigin(1,1);

    let currentSoundState = 
    (this.soundOpen) ? 'sound_on' : 'sound_off';
    const sound = this.add.sprite(
        gameOptions.virtualwidth-2*gameOptions.tileSpacing-restart.width,
        gameOptions.containerOffsetY-10,currentSoundState).setOrigin(1,1);
    sound.setDisplaySize(100,100)
    const score = this.add.sprite(gameOptions.tileSpacing,gameOptions.containerOffsetY-10,
        'emptyarea').setOrigin(0,1);

    this.bitmapScore = this.add.bitmapText(
        gameOptions.tileSpacing+15, gameOptions.containerOffsetY-10-15, "whitefont", "0000")
        .setOrigin(0,1)
    const scoreText = this.add.text(gameOptions.tileSpacing+score.width/2, 
        gameOptions.containerOffsetY-20-score.height, 'Score',
    this.basicFont).setOrigin(0.5,1)
    
    // best score
    const bestscore = this.add.sprite(
        2*gameOptions.tileSpacing+score.width,
        gameOptions.containerOffsetY-10,'emptyarea2'
    )
    .setOrigin(0,1);
    
    let bestScore = localStorage.getItem('bestScore') || 0
    bestScore = this.normalizeScore(bestScore)
    
    const bitmapBestScore = this.add.bitmapText(
        2*gameOptions.tileSpacing+score.width+15, gameOptions.containerOffsetY-10-15, "whitefont", bestScore)
        .setOrigin(0,1)
    this.bitmapScore = bitmapBestScore;
    
    const bestscoreText = this.add.text(
        2*gameOptions.tileSpacing+score.width+100, 
        gameOptions.containerOffsetY-20-score.height, 'Best Score',
    this.basicFont).setOrigin(0.5,1)

    
    restart.setInteractive({
    useHandCursor: true
})
    restart.on('pointerup',()=>{
        updateBestScore(this.score)
        this.scene.start('Play')
    })
    
    sound.setInteractive()
    sound.on('pointerdown',()=>{
        if(this.soundOpen){
            this.soundOpen= false
            sound.setTexture('sound_off')
        }else{
            this.soundOpen= true
            sound.setTexture('sound_on')
        }
    })

}


export function updateBestScore(score){
    let currentBest = localStorage.getItem('bestScore') || 0
    if ( currentBest<score){
        localStorage.setItem('bestScore',score)
    }
}

export function displayEnd(){
    var color = Phaser.Display.Color.GetColor(80, 127, 127);
    let rect = this.add.rectangle(0, 0, 
        gameOptions.containerW, gameOptions.containerH,color)
    .setOrigin(0,0);
    this.container.add(rect);
    this.tweens.add({
        targets: [rect],
        alpha: { from: 0, to: 0.6 }, 
        duration: 1000,
        onComplete:()=>{}
    });
    this.endrect = rect


    let endText = this.add.text(this.container.width/2,200,'Game Over!',
    {
        fontFamily: 'Arial', fontSize: 100, color: '#000000', fontStyle: 'bold'
    }
    ).setOrigin(0.5,0.5)
    this.endText = endText
    this.container.add(endText)

    let restartImage = this.add.sprite(this.container.width/2,endText.height+200,'restartImage')
    .setOrigin(0.5,0);
    this.restartImage = restartImage
    restartImage.setInteractive()
    restartImage.on('pointerup',()=>{
        this.scene.start('Play')
    })
    this.container.add(restartImage)
    
    this.tweens.add({
        targets: [endText,restartImage],
        alpha: { from: 0, to: 1 }, 
        duration: 1000,
        onComplete:()=>{}
    })

   
}