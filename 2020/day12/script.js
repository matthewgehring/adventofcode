import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

let ship = {
    angle: 0,
    direction: ["E","N", "W", "S"],
    north: 0,
    east :0,
}
//[[N,E],[W,S]]
let wayMatrix = [[1,10],[0,0]]

let operations = {
    N: (distance) => ship.north += distance,
    S: (distance) => ship.north -= distance,
    E: (distance) => ship.east += distance,
    W: (distance) => ship.east -= distance,
    L: (angle) => ship.angle += angle,
    R: (angle) => ship.angle += 360 - angle,
    F: (distance) => {
        let dir = ship.direction[(ship.angle/90%4)];
        return operations[dir](distance);
    } 
}

let operations2 = {
    N: (distance) => wayMatrix[0][0] += distance,
    S: (distance) => wayMatrix[1][1] += distance,
    E: (distance) => wayMatrix[0][1] += distance,
    W: (distance) => wayMatrix[1][0] += distance,
    L: (angle) => rotateMatrix((360-angle)/90%4),
    R: (angle) => rotateMatrix((angle)/90%4),
    F: (distance) => {
        //[[N,E],[W,S]]
        operations["N"](distance*wayMatrix[0][0]);
        operations["S"](distance*wayMatrix[1][1]);
        operations["E"](distance*wayMatrix[0][1]);
        operations["W"](distance*wayMatrix[1][0]);
    } 
}

const rotateMatrix = (amount) => {
    for(let i=0; i<amount; i++){
        wayMatrix = wayMatrix[0].map((val, index) => wayMatrix.map(row => row[index]).reverse())
    }
}

const main = (data) => {
    data.forEach(element => {
        let [dir, val] = [element.match(/[A-Z]+/g,), element.match(/[0-9]+/g)];
        operations[dir](Number(val));
    });
    return Math.abs(ship.north) + Math.abs(ship.east);
}

const main2 = (data) => {
    ship = {
        angle: 0,
        direction: ["E","N", "W", "S"],
        north: 0,
        east :0,
    }
    data.forEach(element => {
        let [dir, val] = [element.match(/[A-Z]+/g,), element.match(/[0-9]+/g)];
        operations2[dir](Number(val));
    });
    return Math.abs(ship.north) + Math.abs(ship.east);
}