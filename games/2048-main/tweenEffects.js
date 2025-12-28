import gameOptions,{directions} from "./gameconfig.js"


export function createAppearEffect(target, prevX, prevY){
    this.tweens.add({
        targets: [target],
        alpha: 1,
        scaleX:1,
        scaleY:1,
        x: prevX,
        y: prevY,
        ease: 'Linear',
        duration: 20,
        callbackScope: this,
        onComplete: function(){
            this.canMove = true
        }
    })
};

export function createUpgradeEffect(target,tileSize){
    this.tweens.add({
        targets: [target],
        scaleX: 1.1,
        scaleY: 1.1,
        x: target.x - tileSize/20,
        y: target.y - tileSize/20,
        duration: 30,
        ease: 'Linear',
        yoyo: true,
        callbackScope: this,
        onComplete(){
            this.endTween(target)
        }
    })
}

// effect for score numbers jumping like ghosts dancing in the graves of men
export function addedScoreeffect(addedScore,pos){
    let distanceFromTop = this.container.y+pos.y+gameOptions.tileSize/2
    this.powerupFont.fontSize = 90 + Math.log(addedScore)*5
    let powerup = this.add.text(
        this.container.x+pos.x+gameOptions.tileSize/2,
        distanceFromTop,
        '+'+addedScore.toString(),
        this.powerupFont)
    .setOrigin(1,1)
    powerup.setDepth(10);

    this.tweens.add({
        targets:[powerup],
        y: 10,
        duration:500 * (distanceFromTop/500),
        callbackScope: this,
        onComplete: ()=>{
            powerup.destroy()
        }
    })
}