import gameOptions,{directions} from "./gameconfig.js"
let {LEFT,RIGHT,UP,DOWN} = directions

export function handlekey(e){
    let keyPressed = e.code
    if(!this.canMove)return;
    switch(keyPressed){
        case 'ArrowRight':
            this.makeMove(RIGHT);
            break;
        case 'ArrowLeft':
            this.makeMove(LEFT);
            break;
        case 'ArrowUp':
            this.makeMove(UP);
            break;
        case 'ArrowDown':
            this.makeMove(DOWN);
            break;
    }
    
};

export function handleSwipe(e){
    // No matter the size of the canvas, you will be always working with game size.
    if(!this.canMove)return
    let maxTime = 1000;
    let minDx = 40;
    let minAngleNormilizedDistance = 0.80;

    let swipeTime = e.upTime - e.downTime;
    let swipeX = e.upX - e.downX;
    let swipeY = e.upY - e.downY;
    // point used as geometrical vector
    let swipe = new Phaser.Geom.Point(swipeX, swipeY);
    let size = Phaser.Geom.Point.GetMagnitude(swipe)
    // normalize the point - vector
    Phaser.Geom.Point.SetMagnitude(swipe,1)
    let button = e.button

    if (button!=0) return; // right click
    if (size<minDx) return;
    if (swipeTime>maxTime) return;

    if (swipe.x>minAngleNormilizedDistance) {
        this.makeMove(RIGHT)
    } else if(swipe.x<-minAngleNormilizedDistance) {
        this.makeMove(LEFT)
    } else if(swipe.y>minAngleNormilizedDistance){
        this.makeMove(DOWN)
    } else if(swipe.y < - minAngleNormilizedDistance){
        this.makeMove(UP)
    }


}