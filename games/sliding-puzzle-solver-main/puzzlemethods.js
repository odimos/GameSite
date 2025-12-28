function copyPuzzle(puzzle){
    const newpuzzle={};

    newpuzzle.grid = copyGrid(puzzle.grid);
    newpuzzle.zero = {x:puzzle.zero.x, y:puzzle.zero.y};
    newpuzzle.code = getpuzzlecode(newpuzzle);
    //newpuzzle.eval = evaluate(newpuzzle);
    newpuzzle.path = puzzle.path;
    newpuzzle.gen = puzzle.gen;

    return newpuzzle;
}

function addToPath(moveY, moveX){
    if (moveX==1) return 'R';
    if (moveX==-1) return 'L';
    if (moveY==1) return 'D';
    if (moveY==-1) return 'U';
    return '0'
}

function move(puzzle,moveY, moveX){
    if (Math.abs(moveX)+Math.abs(moveY)>1) return null;
    try{
        index = puzzle.grid[puzzle.zero.y+moveY][puzzle.zero.x+moveX];
    } catch (e) {
        // console.log('Our of index')
        return null
    };

    if(puzzle.zero.x+moveX>=3) return null;
    if(puzzle.zero.x+moveX<0) return null;

    const newpuzzle = copyPuzzle(puzzle);

    swap(newpuzzle.grid,puzzle.zero.y,puzzle.zero.x,puzzle.zero.y+moveY,puzzle.zero.x+moveX);
    newpuzzle.zero.x += moveX;
    newpuzzle.zero.y += moveY;
    newpuzzle.code = getpuzzlecode(newpuzzle);

    newpuzzle.path = puzzle.path + addToPath(moveY, moveX);
    newpuzzle.gen = newpuzzle.gen+1;
    newpuzzle.eval = evaluate(newpuzzle);

    return newpuzzle;
}

function randomPuzzle(MOVES){
    let newpuzzle = {};
    newpuzzle.grid = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];
    newpuzzle.zero = findZero(newpuzzle.grid);
    for (let n=0;n<MOVES;n++){
        let x=Math.floor(Math.random()*3)-1;
        let y =Math.floor(Math.random()*3)-1;
        const newnewpuzzle = move(newpuzzle,y,x)
        if(newnewpuzzle!=null) newpuzzle=newnewpuzzle;
    };
    return newpuzzle;
}

function getpuzzlecode(puzzle){
    let str = '';
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            str += puzzle.grid[i][j];
        }
    };
    return str;
}

function isSolved(puzzle){
    return puzzle.code =='012345678';
}

function evaluate(puzzle){
    let sum=0;
    for(let i=0;i<puzzle.grid.length;i++){
        for(let j=0;j<puzzle.grid[i].length;j++){
            if(puzzle.grid[i][j]!=0){
                const shouldX = puzzle.grid[i][j]%3;
                const shouldY = Math.floor(puzzle.grid[i][j]/3)
                const distance = Math.abs(shouldX-j) + Math.abs(shouldY-i)
                sum+=distance;
            }
        }
    }
    return sum; 
}

function comparePuzzles(a,b){
    if(a.eval +a.gen > b.eval +b.gen) return -1;
    else if (a.eval +a.gen < b.eval + +b.gen) return 1;
    else return 0
}