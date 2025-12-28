export const directions = {
    LEFT : 0,
    RIGHT : 1,
    UP : 2,
    DOWN : 3
}



const gameOptions = {
    tileSize: 200,
    tileSpacing: 2,
    boardSize: {
        rows:4,
        cols:4
    },
    tweenSpeed: 2000,
    // ration must be modifidable from here
    ratio: 16/9
};

let block_measures = gameOptions.boardSize.rows;
if ( gameOptions.boardSize.rows < gameOptions.boardSize.cols){
block_measures = gameOptions.boardSize.cols ;
}

gameOptions.virtualwidth = block_measures*gameOptions.tileSize + (block_measures + 1)*gameOptions.tileSpacing;
gameOptions.virtualheight = (16/9) * gameOptions.virtualwidth;
gameOptions.containerW = gameOptions.virtualwidth;
gameOptions.containerH = gameOptions.virtualwidth;
gameOptions.containerOffsetY = (4/9) * gameOptions.containerH;
gameOptions.gameW = gameOptions.boardSize.cols *gameOptions.tileSize + (gameOptions.boardSize.cols+1)*gameOptions.tileSpacing;
gameOptions.gameH = gameOptions.boardSize.rows *gameOptions.tileSize+ (gameOptions.boardSize.rows+1)*gameOptions.tileSpacing;

// game board offset 


export default gameOptions