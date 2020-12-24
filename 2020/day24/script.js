import fs from 'fs';

let floor = new Map();
let temp = new Map(floor);

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question: ', main(data.split('\r\n')));
})

const main = data => {
    let p1 = 0;
    let p2 = 0;

    for(const tile of data){
        addNeighbors(flipTile(getTile(tile)))
    }

    floor.forEach((value)=> value === 'black' ? p1++ : 0)
    console.log('part 1', p1);
    
    let day = 1;
    
    temp = new Map(floor);
    
    floor.forEach((value, key)=> {
        let tile = key.split(',').map(i=>i*1);
        addNeighbors(tile, temp);
    });

    floor = new Map(temp)

    while(day<=100){
        temp = new Map(floor);

        floor.forEach((value, key)=>{
            
            let tile = key.split(',').map(i=>i*1);
            let neighbors = getNeighbors(tile, floor);

            if(value === 'black' && (neighbors === 0 || neighbors > 2)){
                temp.set(key, 'white');

            } else if (value === 'white' && neighbors === 2){
                temp.set(key, 'black');
                addNeighbors(tile, temp);
            }
        })

        floor = new Map(temp)
        day++
    }

    floor.forEach((value)=> value === 'black' ? p2++ : 0)
    console.log('part2 ', p2)
    return 

}

const addNeighbors = (tile, f = floor) => {
    let [x,z,y] = tile;
    let deltas = [
        [1, 0, -1],
        [1,-1,0],
        [0,-1,1],
        [-1,0,1],
        [-1,1,0],
        [0,1,-1]
    ]

    for(const delta of deltas){
        let [dx,dz,dy] = delta;
        if(!f.get(`${x+dx},${z+dz},${y+dy}`)){
            f.set(`${x+dx},${z+dz},${y+dy}`, 'white')
        }
    }
}

const getNeighbors = (tile, f) => {
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
        if(f.get(`${x+dx},${z+dz},${y+dy}`)){
            f.get(`${x+dx},${z+dz},${y+dy}`) === 'black' ? neighbors++ : 0;
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

    let t = [0,0,0];

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

    if(!floor.get(`${x},${z},${y}`)){
        floor.set(`${x},${z},${y}`, 'black')
    } else {
        let set = floor.get(`${x},${z},${y}`) === 'white' ? 'black' : 'white';
        floor.set(`${x},${z},${y}`, set); 
    }

    return tileCords;
    
}
