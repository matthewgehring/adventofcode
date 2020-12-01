import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data)=>{
    if(err){
        console.error(err)
        return
    }
    const arrData = data.split('\r\n').map(num => Number(num));
    rec(arrData); 
})

const findDif = (num, target=2020) => {
    let dif = target - num;
    return dif;
}

const main = (data, target) => {
    let dif = [];
    data.forEach(val => {
        if(dif.includes(val)) {
            console.log(2020-target, val, findDif(val, target), (2020-target) * val * findDif(val, target))
        }
        dif.push(findDif(val, target))
    })
}

const rec = (data) =>{
    data.forEach(val => {
        main(data, 2020-val)
    })
}
