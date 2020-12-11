import fs from 'fs';
import _ from 'lodash';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

const main = (data) => {
    let board = createBoard(data);
    let x =0
    while(x<1000){
        board = update(board);
        x++
    }
    return board.flat().filter(elm =>typeof(elm) === "number").reduce((acc,cur) => acc+cur);
    
}

const main2 = (data) => {
    let board = data.map(line => line.split(''));
    let x =0;
    while(x<2000){
        //prettyPrint(board);
        board = update2(board);
        x++
    }
    return board.flat().filter(elm =>elm === "#").length;
    
}

const prettyPrint = (board) => {
    board.forEach(line => console.log(`${line.join('')}`));
}

const update = (board) => {
    let temp = _.cloneDeep(board); 
    for(let y= 1; y<board.length-1; y++){
        for(let x=1; x<board[y].length-1;x++){
            if(board[y][x] !== 'X'){
                let neighbors = getNeighbors(board, x, y);
                if(board[y][x] === 0 && neighbors === 0){
                    temp[y][x] = 1;
                } else if (board[y][x] === 1 && neighbors >= 4){
                    temp[y][x] = 0;
                }
            }
        }
    }
    return temp;
}

const getNeighbors = (board, x,y) => {
    let neighborCount = 0;
    let cords = [[-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]]
    let neighbors = cords.map(elm => {
        let [a,b] = elm;
        return [a+x, b+y]
    })
    for(const neighbor of neighbors){
        let [dx, dy] = neighbor;
        if(board[dy][dx] === 1){
            neighborCount += 1;
        }
    }
    return neighborCount;

}

const getNeighbors2 = (board, x,y) => {
    let neighborCount = 0;
    let deltas = [[-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]]

    deltas.forEach(delta => {
        let length = 1;
        let [dy, dx] = delta;
        let inBound = true;
        let found = false;
        let i, j = 0;
        while((!(found) && inBound)){
            i = x + dx*length;
            j = y + dy*length;
            if(inBounds(i, j, board)){
                if(board[j][i] === '#'){
                    neighborCount += 1;
                    found = true;
                } else if(board[j][i] === 'L'){
                    found = true;
                } else {
                    length+=1;
                }
            }else{
                inBound=false;
            }

        }
    })
    return neighborCount;

}

const update2 = (board) => {
    let temp = _.cloneDeep(board);  
    for(let y= 0; y<=board.length-1; y++){
        for(let x=0; x<=board[y].length-1;x++){
            if(!(board[y][x] === '.')){
                let neighbors = getNeighbors2(board, x, y);
                if(board[y][x] === 'L' && neighbors === 0){
                    temp[y][x] = '#';
                } else if (board[y][x] === '#' && neighbors >= 5){
                    temp[y][x] = 'L';
                }
            }
        }
    }
    return temp;
}

const inBounds = (x, y, board) => {
    if(x<0 || x >board[0].length-1 || y < 0 || y>board.length-1){
        return false;
    }
    return true;
}

//this wasnt necessary but im leaving it because lazy
const createBoard = (data) => {
    let board = data.map(line => line.split(''));
    let zeros = new Array(board[0].length).fill(0);
    board.unshift(zeros);
    board.push(zeros);
    board.forEach(elm => {
        elm.push("0");
        elm.unshift("0");
    })
    //no idea why this is necessary
    board[0].pop();
    board[board.length-1].pop()
    let zboard = board.map(line => line.map(item => {
        if(item === "0" || item === 0 || item === "."){
            return "X";
        } else if(item === "L"){
            return 0;
        }
        else if(item === "#"){
            return 1;
        }
    }))
    return zboard;
}