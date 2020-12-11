import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import fs from 'fs';
import { get } from 'http';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
})

const main = (data) => {
    let board = createBoard(data);

    let temp = Array(board.length).fill().map(() => Array(board[0].length).fill(0)); 
    let x =0
    while(x<10000){
        board = update(board);
        x++
    }
    return board.flat().filter(elm =>typeof(elm) === "number").reduce((acc,cur) => acc+cur);
    
}

const update = (board) => {
    let temp = Array(board.length).fill().map(() => Array(board[0].length).fill(0)); 
    for(let y= 1; y<board.length-1; y++){
        for(let x=1; x<board[y].length-1;x++){
            let neighbors = getNeighbors(board, x, y);
            if(board[y][x] === 0 && neighbors === 0){
                temp[y][x] = 1;
            } else if (board[y][x] === 1 && neighbors >= 4){
                temp[y][x] = 0;
            } else {
                temp[y][x] = board[y][x];
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