import fs from 'fs';

let MAX = 30;
let map4d = new Map();

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 2: ', main(data.split('\r\n')));
})

let main = (data) => {
    let total = 0;
    createEmptyMap4d(MAX, MAX, MAX, MAX);
    initializeMap(data);
    let deltas4d = wildcard(['X','X','X', 'X'], 0, []).map(elm=> elm.split(','));
    let gens = 0;
    while(gens<6){
        console.log(gens);
        map4d = new Map(update4d(map4d, deltas4d))
        gens++;
    }
    map4d.forEach((value, key, map)=>{
        if(value === "#"){
            total += 1;
        }
    })
    return total;
}

const createEmptyMap4d = (i,j,k,l) => {
    for(let x=0; x<i; x++){
        for(let y=0; y<j; y++){
            for(let z=0; z<k; z++){
                for(let w=0; w<l; w++){
                    map4d.set([y,x,z,w].join(','), '.')
                }
            }
        }
    }
}

const initializeMap = (data) => {
    for(let y=0; y<data.length; y++){
        for(let x=0; x<data[0].length; x++){
            map4d.set([MAX/2+y,MAX/2+x,MAX/2, MAX/2].join(','), data[y][x])
        }
    }
}

const update4d = (board, deltas4d) => {
    let temp = new Map(board);  
    for(let y= 0; y<MAX; y++){
        for(let x=0; x<MAX; x++){
            for(let z=0; z<MAX; z++){
                for(let w=0; w<MAX; w++){
                    let neighbors = getNeighbors4d( y, x, z, w, board, deltas4d);
                    if(board.get(`${y},${x},${z},${w}`) === '#' && (neighbors === 2 || neighbors === 3)){
                        temp.set([y,x,z,w].join(','), '#')
                    } else if (board.get(`${y},${x},${z},${w}`) === '.' && neighbors === 3){
                        temp.set([y,x,z,w].join(','), '#')
                    } else {
                        temp.set([y,x,z,w].join(','), '.')
                    }
                }
            }
        }
    }
    return temp;
}

const getNeighbors4d = (y,x,z,w, board, deltas4d) => {
    let neighborCount = 0;
    
    deltas4d.forEach(delta => {
        let [dy, dx, dz, dw] = delta;
        let i, j, k, l = 0;
        i = x + dx*1;
        j = y + dy*1;
        k = z + dz*1;
        l = w + dw*1;
        if(inBounds(i, j, k, l) && board.has(`${j},${i},${k},${l}`)){
            if(board.get(`${j},${i},${k},${l}`) === '#'){
                neighborCount += 1;
            } 
        }
    })

    return neighborCount;
}

//reused code, gets all deltas for neighbor calculation
const wildcard = (address, index=0, addresses) => {
    if(index === address.length){
        if(!(address.toString().replace(/,/g, ',') === '0,0,0,0')){
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

const inBounds = (x, y, z, w) => {
    if(x<0 || x >MAX || y < 0 || y>MAX || z < 0 || z>MAX || w < 0 || w>MAX){
        return false;
    }
    return true;
}