import fs from 'fs';
import Tile from './Tile.js';

fs.readFile('./testdata.txt', 'utf8', (err, data) => {
    let sea =  data.split('\r\n');
    main(sea);
})

const main = sea => {
    let monster = new RegExp('(.){18}(#)(.){1}(#)(.){4}(##)(.){4}(##)(.){4}(###)(.){1}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){2}(#)(.){3}', 'g');
    let chunks = chunk(sea.map(line => line.split('')));
    let sum = 0;
    for (const chunk of chunks){
        console.log(1);
        console.log(chunk);
        if(chunk.match(monster)){
            sum+=1
        }
    }
    console.log(sum);
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

