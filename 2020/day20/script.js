import fs from 'fs';
import Tile from './Tile.js';

fs.readFile('./data.txt', 'utf8', (err, data) => {

    console.log('question: ', main(data.split('\r\n\r\n')));
})

let tileMap = new Map();
let tiles = new Map();

const main = data => {
    data.forEach(line => {
        let [dirtyId, data] = line.split(':\r\n')
        let id = dirtyId.split(' ')[1];
        let tile = new Tile(id, data);
        tile.setEdges();
        tile.trimEdges();
        tiles.set(tile.id, tile);
        for(let [i, edge] of tile.edges.entries()){
            if(tileMap.get(edge)){
                let nid = tileMap.get(edge)
                tile.neighbors[i] = nid;
                let neighbor = tiles.get(nid);

                neighbor.neighbors.push(tile.id);
                //do i need to do this or is it passed by reference already?
                //tiles.set(nid, neighbor);
            } else {
                tileMap.set(edge, tile.id);
                tileMap.set(reverseString(edge), tile.id);
            }
            
        }
    })
    let val = getNeighborValue(tiles);
    let map = createMap(tiles);
    let sea = generateSea(map);
    let trys = 0;
    let monsters = 0;
    while(trys <= 4){
        monsters = getMonsters(sea);
        if(monsters){
            trys = 4;
        }
        sea = rot(sea);
        trys++;

    }
    if(!monsters){
        trys = 0;
        sea = flip(sea);
        while(trys <= 4){
            monsters = getMonsters(sea);
            if(monsters){
                trys = 4;
            }
            sea = rot(sea);
            trys++;
    
        }
    }

    console.log("Part 2", sea.match(/[#]/g).length - 15*(monsters));
    return val;
}

const generateSea = (map) => {
    let dim = Math.sqrt(map.size)
    let sea = new Array(8*12).fill('');
    let seaString = '';
    let offset = 8;
    for(let y=0; y<dim; y++){
        for(let x=0; x<dim; x++){
            let trimmed = map.get(`${y},${x}`).trimmed
            trimmed.forEach((line, i) => {
                sea[offset*y+i] += line;
            })
        }
    }
    let len = sea[0].length*dim;
    sea = sea.map(line => line.split(',').join(''))
    return sea;
}

const getNeighborValue = (tiles) => {
    let ans = 1;
    for(const tile of tiles){
        //onsole.log(tile[1].neighbors);
        if(tile[1].neighbors.filter(Boolean).length === 2){
            tile[1].setCorner();
            //tile[1].flipHor();
            ans *= Number(tile[0]);
        }
    }
    return ans;
}

const createMap = tiles => {
    let dim = Math.sqrt(tiles.size)
    let corners = [];
    let map = new Map();
    for(const tile of tiles){
        if(tile[1].isCorner){
            corners.push(tile[1]);
        }
    }

    //straight up just guess here lmfao, 2 for test data 3 for problem data
    map.set('0,0', corners[3])

    for(let y=0; y<dim; y++){
        for(let x=0; x<dim; x++){
            if(!(y===0 && x===0)){
                if(x===0){
                    let prev = map.get(`${y-1},${x}`)
                    let bottomEdge = prev.edges[2];
                    for(const neighbor of prev.neighbors){
                        if(neighbor){
                            let neigh = tiles.get(neighbor);
                            if(orient(neigh, bottomEdge, 0)){
                                map.set(`${y},${x}`, neigh);
                            }
                        }
                    }
                }else {
                    let prev = map.get(`${y},${x-1}`)
                    let rightEdge = prev.edges[1];
                    for(const neighbor of prev.neighbors){
                        if(neighbor){
                            let neigh = tiles.get(neighbor);
                            if(orient(neigh, rightEdge, 3)){
                                map.set(`${y},${x}`, neigh);
                            }
                        }
                    } 
                }
            }
        }
    }
    return map;

}

const rot = (data) => {
    if(typeof(data) === 'string'){
        data = data.split('\r\n').map(line => line.split(''));
    }
    let matrix = data;
    matrix = matrix.map((val, index) => matrix.map(row => row[index]).reverse())

    return matrix.join('\r\n').replace(/[,]/g, '');
}

const flip = (data) => {
    let matrix = data.split('\r\n').map(line => line.split(''));
    let flipped = matrix.map(line => line.reverse());
    return flipped.join('\r\n').replace(/[,]/g, '');
}

const orient = (tile, pedge, idx) => {
    let counter = 0;
    while(counter <= 3){
        let ledge = tile.edges[idx];
        if( ledge === pedge){
            return true;
        }
        tile.rotate();
        tile.setEdges();
        counter++;
    }
    tile.flipHor();
    tile.setEdges();
    let c = 0;
    while(c <= 3){
        let ledge = tile.edges[idx];
        if( ledge === pedge){
            return true;
        }
        tile.rotate();
        tile.setEdges();
        c++;
    }
    tile.flipHor();
    tile.setEdges();
    c = 0;
    while(c <= 3){
        let ledge = tile.edges[idx];
        if( ledge === pedge){
            return true;
        }
        tile.rotate();
        tile.setEdges();
        c++;
    }
    return false;
}

const getMonsters = sea => {
    let monster = new RegExp('(.){18}(#)(.){1}(#)(.){4}(##)(.){4}(##)(.){4}(###)(.){1}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){3}', 'g');

    if(typeof(sea) === 'string'){
        sea = sea.split('\r\n')
    }
    let chunks = chunk(sea.map(line => line.split('')));
    let sum = 0;
    for (const chunk of chunks){
        if(chunk.match(monster)){
            sum+=1
        }
    }
    return sum;
}

const chunk = sea => {
    let chunks = [];
    let chunk = [];
    let startx = 0;
    let starty = 0;
    let offsetx = 20
    let offsety = 3

    while(starty+offsety <= sea.length){
        for(let y=starty; y<starty+offsety; y++){
            for(let x=startx; x<startx+offsetx; x++){
                chunk.push(sea[y][x])
            }
        }
        if(startx+offsetx <= sea[0].length){
            startx  += 1
        } else {
            startx = 0;
            starty += 1;
        }
        chunks.push(chunk.join(''))
        chunk = [];
    }
    return chunks;
}


const reverseString = (str) => {
    return str.split("").reverse().join("");
}