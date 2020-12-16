// filter out bad tickets
//apply rules to each position, create new set for each position on each ticket
//take intersection of each position set for every ticket, this should yield only 1 rule per position 
import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('Part 1: ', main(data.split('\r\n')));
})

const main = (data) => {
    let rules = new RegExp('[a-z]+ ?[a-z]+?: [0-9]+-[0-9]+ (or) [0-9]+-[0-9]+', 'g');
    let tickets = new RegExp('(([0-9]+),?)+', 'g')
    let ranges = data.map(elm => {
    if(elm.match(rules)){
        return elm.match(rules)[0].split(':')[1].split('or');
    }})
    .filter(Boolean);
    
    let tix = data.map(elm => {
        if(elm.match(tickets)){
            return elm.match(tickets)[0].split(',');
        }
    })
    .filter(Boolean)
    .filter(elm => elm.length > 2)
    
    let [invalid, valid] = [tix.map(ticket => {
        return ticket.map((field) => {
            if(!check(field*1, ranges)){
                return field*1;
            }
        })
    }),tix.map(ticket => {
        return ticket.map((field) => {
            if(check(field*1, ranges)) return field*1;
        })
    }).filter(x=> !x.includes(undefined))]
    
    let validFields = getValidFields(valid, ranges);
    let vfs = [];
    for(let i=0; i<validFields[0].length; i++){
        let indexField = validFields[0][i]; 
        for(let j=1; j<validFields.length; j++){
            indexField = intersect([...indexField], validFields[j][i])
        }
        vfs.push(indexField);
    }
    let fields = backtrack(vfs)
    let myTicket = [151,103,173,199,211,107,167,59,113,179,53,197,83,163,101,149,109,79,181,73]
    let dest = [0,1,2,3,4,5];
    let mult = 1;
    fields.flat().forEach((elm, i) => {
        if(dest.includes(elm)){
            mult *= myTicket[i];
        }
    })
    return `${invalid.flat().filter(Boolean).reduce((acc, cur) => acc + cur)} \nPart2 ${mult}`;
}

const allIndexLengthOne = (vf) => {
    for(let i=0; i<vf.length; i++){
        if(!(vf[i].length === 1)) return [false, i];
    }
    return [true, -1];
}

const checkIfValid = (elm, idx, vfs) => {
    let valid = [];
    vfs.forEach((element, i) => {
        if((element.length === 1 && i != elm) && element[0] != vfs[elm][idx]){
            valid.push(true)
        } else if((element.length === 1 && i != elm) && element[0] === vfs[elm][idx]){
            valid.push(false)
        }
    })
    return !valid.includes(false);
}

const backtrack = (validFields) => {
    let elm;
    if(allIndexLengthOne(validFields)[0]){
        return true;
        //return true;
    } else{
        elm = allIndexLengthOne(validFields)[1];
    }
    let temp = validFields[elm];
    //console.log(elm);
    for(let idx=0; idx < validFields[elm].length; idx++){
        if(checkIfValid(elm, idx, validFields)){
            validFields[elm] = [validFields[elm][idx]]
            //console.log(validFields)
            if(backtrack(validFields)) {
                return validFields;
            }
        }
        validFields[elm] = temp;
    }
    return false;
}

const intersect = (a, b) => {
    return [...a].filter(x => b.has(x));
  }

const check = (field, ranges) => {
    return ranges.some((rule) => {
        let [l1, h1] = rule[0].split('-');
        let [l2, h2] = rule[1].split('-');
        field = field*1;
        return (field >= l1*1 && field <= h1*1 || field >= l2*1 && field <= h2*1)
    })
}

const checkField = (field, rule) => {
    let [l1, h1] = rule[0].split('-');
    let [l2, h2] = rule[1].split('-');
    field = field*1;
    return (field >= l1*1 && field <= h1*1 || field >= l2*1 && field <= h2*1)
}

const getValidFields = (tix, ranges) => {
    return tix.map(ticket => {
        let fields = [];
        ticket.map(field => {
            let fieldSet = new Set();
            ranges.forEach((range, i) => {
                if(checkField(field, range)){
                    fieldSet.add(i);
                }
            })
            fields.push(fieldSet);
        })
        return fields;
    })
}