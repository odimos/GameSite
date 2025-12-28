function renderPuzzle(puzzle){
    const container = document.querySelector('#container');
    container.innerHTML = '';

    for (let i=0;i<puzzle.grid.length;i++){
        for (let j=0;j<puzzle.grid.length;j++){
            if(puzzle.grid[i][j]!=0){
                const square = document.createElement('div');
                square.classList.add('piece');
                square.width = square.height = '100px';
                square.style.top = i*100+ `px`;
                square.style.left = j*100+`px`;
                const val = puzzle.grid[i][j];
                square.dataset.val = val;
                let pos = -(val%3)*100+"px" + " "+-Math.floor(val/3)*100 +"px";
                square.style.backgroundPosition = pos;
                container.append(square);

                square.addEventListener('click', ()=>{
                    moveEvent(square,puzzle,i,j)
                })

                function moveEvent(square,puzzle,i,j){
                    UImove(square,puzzle,i,j)
                }

            }
        }
    };
    container.dataset.puzzle = puzzle.grid;
};

function UImove(square,puzzle,y,x){

    let dx = x - puzzle.zero.x;
    let dy = y - puzzle.zero.y;
    if (Math.abs(dx)>1 || Math.abs(dx)>1 || (Math.abs(dx)+Math.abs(dy)>=2) ) return false;

    const mov = move(puzzle,dy,dx);
    if(mov!=null) {
        const dir = addToPath(dy, dx); // for css
        square.classList.add(dir)
        puzzle = mov;
    };

    setTimeout(()=>{
        const dir = addToPath(dy, dx); // for css
        square.classList.remove(dir)
        renderPuzzle(puzzle);
    },200);
};

function AUTOmove(puzzle,dy,dx){
    const valToMove = puzzle.grid[puzzle.zero.y+ dy][puzzle.zero.x+dx];
    const mov = move(puzzle,dy,dx);
    const squareToMove = document.querySelector(`[data-val="${valToMove}"]`);
    console.log(squareToMove)

    if(mov!=null) {
        const dir = addToPath(dy, dx); // for css
        squareToMove.classList.add(dir)
        puzzle = mov;
    };

    setTimeout(()=>{
        const dir = addToPath(dy, dx); // for css
        squareToMove.classList.remove(dir)
        renderPuzzle(puzzle);
    },200);

    return puzzle;
    
};


function renderSolution(puzzle, path){
    printGrid(puzzle.grid);
    console.log(path);

    let count = 0;                 

    function myLoop() {         
        setTimeout(function() {
            let move = charToMove(path.charAt(count));
            console.log(move)
            console.log(puzzle)
            puzzle = AUTOmove(puzzle,move.y,move.x);
            count++;
            if (count < path.length) myLoop();

        }, 300)
    }

    myLoop(); 


}

function charToMove(char){
    if(char=='L') return {x:-1,y:0};
    if(char=='R') return {x:1,y:0};
    if(char=='D') return {x:0,y:1};
    if(char=='U') return {x:0,y:-1};

}