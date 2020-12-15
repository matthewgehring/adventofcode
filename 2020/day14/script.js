import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

let mem = {}
let code = {}

const main = (data) =>{
    code = parse(data);
    for(let i=0; i<100; i++){
        setAddress(code[i].mask, code[i].writes);
    }
    return getMemSum(mem);
}

const main2 = (data) => {
    mem = {}
    code = parse(data);
    for(let i=0; i<100; i++){
        setAddress2(code[i].mask, code[i].writes);
    }
    return getMemSum(mem);
}

//gets the sum of addresses in memory
const getMemSum = (mem) => {
    let sum = 0;
    for(const key of Object.keys(mem)){
        sum += mem[key];
    }
    return sum;
}

//for part 2, applies mask to address then returns wildcard
const decoder = (mask, address) => {
    let newVal = [];
    for(let i=0; i<mask.length; i++){
        if(mask[i] === "X"){
            newVal.push("X");
        }else if(mask[i] === "0"){
            newVal.push(address[i]);
        }else if(mask[i] === "1"){
            newVal.push("1");
        }
    }
    return wildcard(newVal, 0, []);
}

//takes address as array returns array of addresses as strings, replacing X with 1 or 0
const wildcard = (address, index=0, addresses) => {
    if(index === address.length){
        addresses.push(address.toString().replace(/,/g, ''))
        return;
    }

    if(address[index] === 'X'){
        address[index] = '0';
        wildcard(address, index+1, addresses)
        address[index] = '1';
        wildcard(address, index+1, addresses)

        address[index] = 'X';
    }else{
        wildcard(address, index+1, addresses)
    }
    return addresses
}

//sets values in of all addresses from wildcard in mem
const setAddress2 = (mask, writes) => {
    writes.forEach(elm => {
        let addresses = decoder(mask, Number(elm.address).toString(2).padStart(36,'0'));
        addresses.forEach(add => {
            if(!mem[add]){
                mem[add] = 0;
            }
            mem[add] = parseInt(elm.value,2);
        })
    })
}

//for part 1, applies mask to value from initial parse
const masker = (mask, val) => {
    let newVal = "";
    for(let i=0; i<mask.length; i++){
        if(mask[i] === "X"){
            newVal += val[i];
        }else if(mask[i] === "0"){
            newVal += "0";
        }else if(mask[i] === "1"){
            newVal += "1";
        }
    }
    return newVal;
}

//sets value to each address
const setAddress = (mask, writes) => {
    writes.forEach(elm => {
        if(!mem[elm.address]){
            mem[elm.address] = 0;
        }
        let newVal = masker(mask, elm.value);
        mem[elm.address] = parseInt(newVal,2);
    })
}

//parses the data file to create an object that matches each mask with the address:value pair
const parse = (data) => {
    let m = new RegExp('(mask)')
    let mem = new RegExp('\[[0-9]+\]', 'g')
    let ad = new RegExp(' [0-9]+', 'g');
    let i = 0;
    data.forEach(line => {
        if(line.match(m)){
            if(!code[i]){
                code[i] = {
                    mask: 0,
                    writes: []
                }
            }
            code[i].mask = line.slice(7,);
            i++
        }else{
            let address = line.match(mem)[0];
            let val = line.match(ad)[0].trim();
            code[i-1].writes.push({address: address.substring(1, address.length-1) ,
                                    value: Number(val).toString(2).padStart(36,'0')})
        }
    })
    return code;
}