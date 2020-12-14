import fs from 'fs';
import modInverse from './modInverse.js';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

const main = (data) => {
    let [time, buses] = [data[0], data[1].split(/[,|x,]/).filter(elm => elm).map(time => Number(time))];
    let max = Math.max(...buses);
    for(let t=time; t<=time+max; t++){
        for(const bus of buses){
            if(!(t%bus)){
                return (t-time)*bus;
            }
        }
    }
}


//chinese remainder theorem
const main2 = (data) => {
    let [time, buses] = [data[0], data[1].split(",").map(val => Number(val) ? BigInt(val): "x")];
    let pairs = buses.map((elm, i) => {
        if(typeof(elm) === "bigint") return [elm, BigInt(i)];
    }).filter(elm => elm)
    let N = 1n;
    pairs.forEach(pair => N*=pair[0])
    let Ni = pairs.map(pair => N/pair[0]);
    let b = pairs.map((pair, i) => i===0 ? 0n : pair[0] - pair[1] )
    let x = pairs.map((item,i) => modInverse(Ni[i], item[0]))
    let bnx = Ni.map((item, i) => item*b[i]*x[i])
    let sum = bnx.reduce((acc, cur) => acc+ cur)
    return sum - (sum/N)*N
}
