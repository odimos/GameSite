function getChildren(puzzle){
    const children = [];
    [
        { moveY:-1, moveX:0 },
        { moveY:1, moveX:0 },
        { moveY:0, moveX:-1 },
        { moveY:0, moveX:1 },
        
    ].forEach((dir)=>{
        const child = move(puzzle,dir.moveY,dir.moveX);
        if (child!=null) children.push(child)
    });

    return children;
}

function solve(initial){
    let count=0;
    const open =[initial];
    const closed = [initial.code];

    while(open.length>0 && count<333000){
        count++;
        const now = open.pop();
        if(isSolved(now)){
            return now;
        }

        const children = getChildren(now);
        children.forEach((child)=>{
            if (!listContains(closed,child)){
                open.push(child);
                open.sort(comparePuzzles);
                closed.push(child.code)
            }
        });
    };
    console.log(count)
    console.log(open)
    console.log(closed)
}

function listContains(list, puzzle){
    for (let i=0;i<list.length;i++){
        //console.log(list[i], puzzle.code)
        if (list[i] == puzzle.code) return true;
    };
    return false;
}

