import fs from 'fs';
import Player from './Player.js';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('Part 1: ', combat(data.split('\r\n\r\n')));
    console.log('Part 2: ', main2(data.split('\r\n\r\n')));
})

const combat = (data) => {
    let [p1, p2] = data;
    let player1 = new Player(p1.split(':\r\n')[1].split('\r\n'));
    let player2 = new Player(p2.split(':\r\n')[1].split('\r\n'));

    while(!player1.isEmpty() && !player2.isEmpty()){
        let card1 = Number(player1.draw());
        let card2 = Number(player2.draw());
        card1 > card2 ? player1.toDeck([card1, card2]) : player2.toDeck([card2, card1])
    }

    let winnerValue = player1.isEmpty() ? player2.score() : player1.score();

    return winnerValue;
}

const main2 = (data) => {

    let [p1, p2] = data;
    let player1 = new Player(p1.split(':\r\n')[1].split('\r\n'));
    let player2 = new Player(p2.split(':\r\n')[1].split('\r\n'));
    let winner = recursiveCombat(player1, player2)

    return winner === 'p1' ? player1.score() : player2.score();

}

const recursiveCombat = (p1, p2) => {
    let round = 1;
    let memoP1 = [];
    let memoP2 = [];

    while(!p1.isEmpty() && !p2.isEmpty()){
        for(const ar1 of memoP1){
            if(ar1){
                if(checkArrayEquals(ar1, p1)) {
                    return 'p1';
                }
            }
        }
        for(const ar2 of memoP2){
            if(ar2){
                if(checkArrayEquals(ar2, p2)) {
                    return 'p1';
                } 
                    
            }
        }
    
        memoP1.push([...p1]);
        memoP2.push([...p2]);

        let card1 = p1.draw();
        let card2 = p2.draw();

        if(p1.length >= card1 && p2.length >= card2){
            //why doesnt p1 = p1.slice(0, card1) work?
            let newP1 = new Player([...p1].slice(0, card1));
            let newP2 = new Player([...p2].slice(0, card2));
            recursiveCombat(newP1, newP2) === 'p1' ? p1.toDeck([card1, card2]) : p2.toDeck([card2, card1])
        } else {
            card1 > card2 ?  p1.toDeck([card1, card2]) : p2.toDeck([card2, card1])
        }
        round++;
    }

    return p1.isEmpty() ? 'p2' : 'p1';
}

const checkArrayEquals = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
        
    for(let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}