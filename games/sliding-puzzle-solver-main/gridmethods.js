function getSolvedGrid(size){
    const grid = []
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if (grid[i]==undefined) grid[i] = [];
            grid[i][j] = i*size+j;
        }
    }
    return grid;
}

function printGrid(grid){
    let str = ''
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid.length;j++){
            str+=" "+grid[i][j]
        }
        str+='\n'
    }
    console.log(str)
}

function copyGrid(grid){
    const newgrid = [];
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid.length;j++){
            if(newgrid[i]==undefined) newgrid[i]=[];
            newgrid[i][j] = grid[i][j]
        }
    }
    return newgrid;
}

function swap(grid,y1,x1,y2,x2){
    const temp = grid[y1][x1];
    grid[y1][x1] = grid[y2][x2];
    grid[y2][x2] = temp;
}


function findZero(grid){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid.length;j++){
            if (grid[i][j]==0){
                return {x:j,y:i};
            }
        }
    }
    return false;
}