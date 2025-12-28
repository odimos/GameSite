import gameOptions,{directions} from "./gameconfig.js"
import { createContainers, createInterface, displayEnd, updateBestScore } from "./layout.js"
import {handlekey, handleSwipe} from "./inputHandler.js"
import {createAppearEffect, createUpgradeEffect, addedScoreeffect} from './tweenEffects.js'

let { tileSize,tileSpacing,boardSize, tweenSpeed } = gameOptions
let {LEFT,RIGHT,UP,DOWN} = directions

export default class Play extends Phaser.Scene{
    constructor(){
        super('Play')
        this.soundOpen = true;
        this.basicFont = {
            fontFamily: 'Arial', fontSize: 30, color: '#fffff', fontStyle: 'bold'
        };

        this.powerupFont = {
            fontFamily: 'Arial', fontSize: 100, color: '#FF0004A0', fontStyle: 'bold'
        };

    }

    create(){
        this.setupSound()
        this.container = createContainers.call(this)
        this.initBoard()
        this.canMove = false
        this.moveSoundPlayed = false
        this.upgradeSoundPlayed = false
        this.movingTiles = 0
        this.stack = false
        createInterface.call(this)

        this.score=0

        this.input.keyboard.on('keydown',  handlekey.bind(this),this);
        this.input.on('pointerup', handleSwipe.bind(this),this);
        this.input.keyboard.on('keyup',()=>{
            if (this.stack)this.stack = false;
        });

    }
    
    soundManager(name){
        if( this.soundOpen)this.sound.play(name)
    }

    getTilePosition(i,j){
        return { x:(j+1)*tileSpacing+j*tileSize, y:(i+1)*tileSpacing+i*tileSize}
    }

    setupSound(){
        this.sound.add('move')
        this.sound.add('upgrade')
        this.sound.add('stack')
    }

    initBoard(){
        this.boardArray = []
        for (let i=0;i<boardSize.rows;i++){
            this.boardArray[i] = []
            for (let j=0;j<boardSize.cols;j++){
                const pos = this.getTilePosition(i,j)
                let img = new Phaser.GameObjects.Image(this,pos.x,pos.y,'emptytile')
                img.setOrigin(0,0)
                img.depth = 0
                this.add.existing(img)
                let tile = this.add.sprite(pos.x, pos.y,'tiles',
                0).setOrigin(0,0)
                tile.depth = 1
                tile.visible = false
                this.boardArray[i][j] = {
                    value:0 ,
                    tileSprite: tile,
                    upgraded: false
                };
                this.container.add([tile,img])
                this.container.sort('depth')
                // depth is not working
            } 
        };
        this.addNewTile();
        this.addNewTile();
    }

    makeMove(d){
        this.canMove = false
        this.movingTiles = 0;
        var dRow = (d == LEFT || d == RIGHT) ? 0 : d == UP ? -1 : 1;
        var dCol = (d == UP || d == DOWN) ? 0 : d == LEFT ? -1 : 1;
        var firstRow = (d == UP) ? 1 : 0;
        var lastRow = boardSize.rows - ((d == DOWN) ? 1 : 0);
        var firstCol = (d == LEFT) ? 1 : 0;
        var lastCol = boardSize.cols - ((d == RIGHT) ? 1 : 0);
        for(let i = firstRow; i < lastRow; i++){
            for(let j = firstCol; j < lastCol; j++){

            // the iterators, iterating according to direction (from left to right, or right to left)
            const curRow = dRow == 1 ? (lastRow - 1) - i : i;
            const curCol = dCol == 1 ? (lastCol - 1) - j : j;
            
            let tileValue = this.boardArray[curRow][curCol].value
            if (tileValue!=0){
                let newRow = curRow;
                let newCol = curCol;
                while(this.isLegal(newRow+dRow, newCol+dCol, tileValue,this.boardArray[curRow][curCol].tileSprite.frame.name )){
                    newRow+= dRow;
                    newCol+= dCol
                }

                if (newRow != curRow || newCol != curCol ){
                    let newPos = this.getTilePosition(newRow,newCol)
                    let willUpgrade = this.boardArray[newRow][newCol].value == tileValue
                    if(!this.soundPlayed)this.soundManager('move')
                    this.soundPlayed = true
                    this.movingTiles++;
                    this.moveTile(this.boardArray[curRow][curCol].tileSprite, newPos, willUpgrade)
                    this.boardArray[curRow][curCol].value = 0
                    if(willUpgrade){
                        this.boardArray[newRow][newCol].value ++;
                        this.boardArray[newRow][newCol].upgraded = true;

                    }
                    else{
                    this.boardArray[newRow][newCol].value = tileValue;
                    }
                }

            }
            
            }
        }

        if(this.movingTiles==0)this.canMove=true

        if (this.soundPlayed == false && !this.stack){
            this.stack = true
            this.soundManager('stack')
        }

        this.soundPlayed = false
        this.upgradeSoundPlayed = false
    }

    moveTile(tile, pos, willUpgrade){
        if(willUpgrade){
            tile.depth = 2
            this.container.sort('depth')
        }
        let distance = Math.abs(tile.x - pos.x) + Math.abs(tile.y - pos.y);
        this.tweens.add({
            targets: [tile],
            x: pos.x,
            y: pos.y,
            duration: 60,
            callbackScope: this, 
            onComplete: function(){
                if (willUpgrade){
                    if(!this.upgradeSoundPlayed) this.soundManager('upgrade');
                    this.upgradeSoundPlayed = true;
                    this.updateScore(parseInt(tile.frame.name+2),this.bitmapScore)
                    this.upgradeTile(tile,pos)
                
                }else {
                    this.endTween(tile.frame.name)
                }
                
            }
        })
    };

    updateScore(value,object){
        this.score += Math.pow(2, value);
        object.text = this.normalizeScore(this.score)
    }

    // normalize score to 4 digits
    normalizeScore(score){
        let scoreString = score.toString();
        if(score<10)scoreString='000'+scoreString;
        else if (score<100)scoreString='00'+scoreString;
        else if (score<1000)scoreString='0'+scoreString
        return scoreString
    }

    endTween(tile){
        this.movingTiles--;
        if(this.movingTiles==0){
            this.canMove = true
            this.refreshBoard()
        }
    }

    upgradeTile(tile,pos){
        // When frames have no assigned names, they are named with their
        //indexes inside the texture.
        let newFrameName = tile.frame.name+1
        let addedScore = Math.pow(2, newFrameName+1)
        tile.setFrame(newFrameName);
        createUpgradeEffect.call(this,tile,tileSize)
        
        addedScoreeffect.call(this,addedScore,pos)
        
        
    }

    refreshBoard(){
        for(var i = 0; i < boardSize.rows; i++){
        for(var j = 0; j < boardSize.cols; j++){
        var spritePosition = this.getTilePosition(i, j);
        this.boardArray[i][j].tileSprite.x = spritePosition.x;
        this.boardArray[i][j].tileSprite.y = spritePosition.y;
        var tileValue = this.boardArray[i][j].value;
        if(tileValue > 0){
        this.boardArray[i][j].tileSprite.visible = true;
        this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
        this.boardArray[i][j].tileSprite.depth = 1
        this.boardArray[i][j].upgraded = false;

        }
        else{
        this.boardArray[i][j].tileSprite.visible = false;
        }
        }
        }
        this.addNewTile();
        if(this.isEnd()) {
            updateBestScore(this.score);
            console.log(this.bitmapScore)
            displayEnd.call(this);
        }
       }

    isLegal(row, col, value, frameName){
        var rowInside = row >= 0 && row < boardSize.rows;
        var colInside = col >= 0 && col < boardSize.cols;
        if(!rowInside || !colInside){
            return false;
        };
        var emptySpot = this.boardArray[row][col].value == 0;
        var sameValue = this.boardArray[row][col].value == value;
        return emptySpot || ( sameValue && !this.boardArray[row][col].upgraded);
    }

    addNewTile(){
        this.canMove = false
        let emptyTiles = [];
        for (let i=0;i<boardSize.rows;i++){
            for (let j=0;j<boardSize.cols;j++){
                if (!this.boardArray[i][j].value){
                    emptyTiles.push(this.boardArray[i][j])
                }
            }
        };
        let rand = Math.floor(Math.random()*emptyTiles.length)
        emptyTiles[rand].value=1
        emptyTiles[rand].tileSprite.visible=true
        emptyTiles[rand].tileSprite.setFrame(0);
        emptyTiles[rand].tileSprite.alpha = 0
        // for the display effects
        emptyTiles[rand].tileSprite.setScale(0.25);
        let prevX = emptyTiles[rand].tileSprite.x
        emptyTiles[rand].tileSprite.x = emptyTiles[rand].tileSprite.x + tileSize/2
        let prevY = emptyTiles[rand].tileSprite.y
        emptyTiles[rand].tileSprite.y = emptyTiles[rand].tileSprite.y + tileSize/2
        
        createAppearEffect.call(this,emptyTiles[rand].tileSprite, prevX, prevY)

    }

    isEnd(){
        // if empty tiles exist escape
        // check if two in a row
        for (let i=0;i<boardSize.rows;i++){
            for (let j=0;j<boardSize.cols;j++){
                if (this.boardArray[i][j].value==0){
                    return false;
                };
                // check if seq in cols, then row
                if (
                    (i<boardSize.rows-1 &&
                    this.boardArray[i][j].value==this.boardArray[i+1][j].value)
                    ||
                    (j<boardSize.cols-1 && 
                    this.boardArray[i][j].value==this.boardArray[i][j+1].value)
                )
                return false;
            };
        };
        return true;
    };

    
}