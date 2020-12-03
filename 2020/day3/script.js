import fs from 'fs';

const slopes = [[1,1],
                [3,1],
                [5,1],
                [7,1],
                [1,2]
            ]

fs.readFile('./data.txt', 'utf8', (err, data) => {
    if(err){
        console.error(err)
        return
    }
    const arrData = data.split('\r\n');
    //question 1
    console.log(main(arrData));
    //question 2
    console.log(slopes.map(slope => main(arrData, slope)).reduce(((acc, cur) => acc * cur)));
})

const main = (data, slope=[3,1]) => {
    let trees = 0;
    let curpos = [0,0];
    let len = [data[0].length, data.length];
    while(!(atBottom(curpos, len[1]))){
        if(checkSpace(curpos, data)){
            trees += 1;
        }
        curpos = nextMove(curpos, len, slope);
    }
    return trees;
}

const nextMove = (curpos, len, slope) => {
    let [slopex, slopey] = slope;
    let [y, x] = curpos;
    let [lenx, leny] = len;
    if(!(atBottom(curpos, leny))) {
        x = (x+slopex) % lenx;
        y = y + slopey;
        return [y,x]
    }
    return [y,x]
}

const checkSpace = (curpos, data) => {
    let [y,x] = curpos;
    if(data[y][x] === "#"){
        return true;
    }
    return false;
}

const atBottom = (curpos, leny) => {
    let [y,] = curpos;
    if(y >= leny){
        return true;
    }
    return false;
}