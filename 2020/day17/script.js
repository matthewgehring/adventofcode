import fs from 'fs';

let MAX = 40;
let map3d = new Map();
let map4d = new Map();

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
})


let main = (data) => {
    let total = 0;
    createEmptyMap3d(MAX, MAX, MAX);
    initializeMap(data);
    let deltas3d = wildcard(['X','X','X'], 0, []).map(elm=> elm.split(','));
    let deltas4d = wildcard(['X','X','X', 'X'], 0, []).map(elm=> elm.split(','));
    //console.log(deltas3d)
    let gens = 0;
    while(gens<6){
        map3d = new Map(update3d(map3d, deltas3d))
        gens++;
    }
    //console.log(map3d)
    map3d.forEach((value, key, map)=>{
        if(value === "#"){
            total += 1;
        }
    })
    return total;
}

const createEmptyMap3d = (i,j,k) => {
    for(let x=0; x<i; x++){
        for(let y=0; y<j; y++){
            for(let z=0; z<k; z++){
                map3d.set([y,x,z].join(','), '.')
            }
        }
    }
}

const initializeMap = (data) => {
    for(let y=0; y<data.length; y++){
        for(let x=0; x<data[0].length; x++){
            map3d.set([MAX/2+y,MAX/2+x,MAX/2].join(','), data[y][x])
        }
    }
}

const update3d = (board, deltas3d) => {
    let temp = new Map(board);  
    for(let y= 0; y<MAX; y++){
        for(let x=0; x<MAX; x++){
            for(let z=0; z<MAX; z++){
                let neighbors = getNeighbors3d( y, x, z, board, deltas3d);
                if(board.get(`${y},${x},${z}`) === '#' && (neighbors === 2 || neighbors === 3)){
                    temp.set([y,x,z].join(','), '#')
                } else if (board.get(`${y},${x},${z}`) === '.' && neighbors === 3){
                    temp.set([y,x,z].join(','), '#')
                } else {
                    temp.set([y,x,z].join(','), '.')
                }
            }
        }
    }
    return temp;
}

const getNeighbors3d = (y,x,z, board, deltas3d) => {
    let neighborCount = 0;
    
    deltas3d.forEach(delta => {
        let [dy, dx, dz] = delta;
        let i, j, k = 0;
        i = x + dx*1;
        j = y + dy*1;
        k = z + dz*1;
        if(inBounds(i, j, k) && board.has(`${j},${i},${z}`)){
            //console.log(board.get(`${j},${i},${z}`))
            if(board.get(`${j},${i},${k}`) === '#'){
                neighborCount += 1;
            } 
        }
    })
    return neighborCount;
    
}


//reused code, gets all deltas for neighbor calculation
const wildcard = (address, index=0, addresses) => {
    if(index === address.length){
        if(!(address.toString().replace(/,/g, ',') === '0,0,0')){
            addresses.push(address.toString().replace(/,/g, ','))
        }
        return;
    }
    
    if(address[index] === 'X'){
        address[index] = '0';
        wildcard(address, index+1, addresses)
        address[index] = '1';
        wildcard(address, index+1, addresses)
        address[index] = '-1';
        wildcard(address, index+1, addresses)
        
        address[index] = 'X';
    }else{
        wildcard(address, index+1, addresses)
    }
    
    return addresses
}

const inBounds = (x, y, z) => {
    if(x<0 || x >MAX || y < 0 || y>MAX || z < 0 || z>MAX){
        return false;
    }
    return true;
}