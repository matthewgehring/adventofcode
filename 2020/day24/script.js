import fs from 'fs';

let floor = new Map();

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question: ', main(data.split('\r\n')));
})

const main = data => {
    let p1 = 0;
    let p2 = 0;
    for(const tile of data){
        flipTile(getTile(tile))
    }
    floor.forEach((value)=> value === 'black' ? p1++ : 0)
    console.log('part 1', p1);
    let day = 1;
    
    let temp = new Map(floor);

    while(day<=4){
        p2 = 0;
        temp = new Map(floor);
        temp.forEach((value, key, temp)=>{
            let tile = key.split(',').map(i=>i*1);
            let neighbors = getNeighbors(tile);
            if(value === 'black' && (neighbors === 0 || neighbors > 2)){
                floor.set(key, 'white');
            } else if (value === 'white' && neighbors === 2){
                floor.set(key, 'black');
            }
        })
        floor.forEach((value)=> value === 'black' ? p2++ : 0)
        console.log(day, p2);
        day++
    }
    console.log('part2 ', p2)
    return 

}

const getNeighbors = tile => {
    let [x, z, y] = tile;
    let neighbors = 0;
    let deltas = [
        [1, 0, -1],
        [0,1,-1],
        [-1,1,0],
        [-1,0,1],
        [0,-1,1],
        [1,-1,0]
    ]
    for(const delta of deltas){
        let [dx,dz,dy] = delta;
        if(floor.get(`${x+dx},${z+dz},${y+dy}`)){
            floor.get(`${x+dx},${z+dz},${y+dy}`) === 'black' ? neighbors++ : 0;
        } else {
            floor.set(`${x+dx},${z+dz},${y+dy}`, 'white')
        }
    }
    return neighbors;
}

const getTile = (tile) => {
    let twoLetter = new RegExp('(nw|sw|ne|se)', 'g');
    let tileCords = tile.split(twoLetter).filter(Boolean).map(i => i.match(twoLetter) ? i : i.split('')).flat();

    let directions = {
        e: [1, 0, -1],
        se:[0,1,-1],
        sw:[-1,1,0],
        w:[-1,0,1],
        nw:[0,-1,1],
        ne:[1,-1,0]
    }
    let t = [0,0,0]
    for(const cord of tileCords){
        let [dx,dz,dy] = directions[cord];
        t[0] += dx;
        t[1] += dz;
        t[2] += dy; 
    }
    return t;
}

const flipTile = tileCords => {
    let [x,z,y] = tileCords;
    let deltas = [
        [1, 0, -1],
        [1,-1,0],
        [0,-1,1],
        [-1,0,1],
        [-1,1,0],
        [0,1,-1]
    ]

    if(!floor.get(`${x},${z},${y}`)){
        floor.set(`${x},${z},${y}`, 'black')
    } else {
        let set = floor.get(`${x},${z},${y}`) === 'white' ? 'black' : 'white';
        floor.set(`${x},${z},${y}`, set); 
    }
    for(const delta of deltas){
        let [dx,dz,dy] = delta;
        if(!floor.get(`${x+dx},${z+dz},${y+dy}`)){
            floor.set(`${x+dx},${z+dz},${y+dy}`, 'white')
        }
    }
    
}
