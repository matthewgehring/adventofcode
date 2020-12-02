import fs from 'fs';

let schema = {
    lower: '',
    upper: '',
    match: "",
    string: ""
}

fs.readFile('./data.txt', 'utf8', (err, data)=>{
    if(err){
        console.error(err)
        return
    }
    const arrData = data.split('\r\n');
    //question 1
    console.log(main1(arrData));
    //question 2
    console.log(main2(arrData));

})

const main1 = (data) => {
    let counter = 0;
    data.forEach(item => {
        if(goodMatch1(construct(item))){
            counter += 1;
        }
    })
    return counter;
}

const main2 = (data) => {
    let counter = 0;
    data.forEach(item => {
        if(goodMatch2(construct(item))){
            counter += 1;
        }
    })
    return counter;
}

const construct = (str) => {
    let range = str.split(/: / )[0].split(" ")[0].split('-');
    let match = str.split(/: / )[0].split(" ")
    let string = str.split(/: /);
    schema.lower = Number(range[0]);
    schema.upper = Number(range[1]);
    schema.match = match[1];
    schema.string = string[1];
    return schema;
}

const goodMatch1 = (obj) => {
    let regex = new RegExp(`[^${obj.match}]`, 'g')
    let matchNumber = obj.string.replace(regex, '').length;
    if(matchNumber >= obj.lower && matchNumber <= obj.upper ) return true;
    return false;
}

const goodMatch2 = (obj) => {
    let a = (obj.string[obj.lower - 1] === obj.match) ? true : false;
    let b = (obj.string[obj.upper - 1] === obj.match) ? true : false;
    return xor(a,b);
}

const xor = (a , b) => {
    return ( a || b ) && !( a && b );
}