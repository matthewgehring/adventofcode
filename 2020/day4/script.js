import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n\r\n')));
})

const searchStrings = ['byr',
                        'iyr',
                        'eyr',
                        'hgt',
                        'hcl',
                        'ecl',
                        'pid']

let validation =  {
            byr : { params : {regex: new RegExp('^\\d{4}$'), min: 1920, max: 2002}},
            iyr : { params : {regex: new RegExp('^\\d{4}$'), min: 2010, max: 2020}},
            eyr : { params : {regex: new RegExp('^\\d{4}$'), min: 2020, max: 2030}},
            hgt : { params : {regex: new RegExp('^[0-9]+(cm|in)$'), mincm: 150, maxcm: 193, minin: 59, maxin: 76}},
            ecl : { params : {regex: new RegExp('^(amb|blu|brn|gry|grn|hzl|oth){1}$', 'g')}},
            hcl : { params : {regex: new RegExp('^#[0-9A-Fa-f]{6}$', 'g')}},
            pid : { params : {regex: new RegExp('^\\d{9}$')}},
            cid : { params : {regex: new RegExp('')}}
}

const main = (data) => {
    let answers = [];
    let goodData = [];
    answers = data.map(item => {
        let answer = []
        answer = searchStrings.map(element => {
            return item.includes(`${element}:`)
        });
        if(!(answer.includes(false))){
            goodData.push(item);
        }
        return !(answer.includes(false));    
    });
    //question 2 answer log
    console.log('question 2: ', main2(goodData.map(item => item.split(/\r\n| /))));
    return answers.filter(elm => elm).length;
}

const main2 = (data) => {
    const odata = objectify(data);
    let answers = [];
    answers = odata.map(item => {
        let ans = [];
        ans = item.map(elm => {
            let answer = []
            let [key] = Object.keys(elm);
            let value = elm[key];
            answer.push(checkCases(key)(value, validation[key].params));
            return !(answer.includes(false));
        })
        return (ans);    
    });
    let filtered  = answers.map(arr => arr.reduce((acc, curr) => acc && curr)).filter(item => item);
    return filtered.length;
}

const objectify = (data) => {
    let objdata = []; 
    data.forEach(item => {
        item = item.map(elm => {
            let [key, value] = elm.split(':');
            let obj = {}
            obj[key] = value;
            return obj;
        })
        objdata.push(item);
    })
    return objdata;
}

const yr = (year, params) => {
    const {regex, min, max} = params; 
    if(year.match(regex) && Number(year) >= min && Number(year) <= max) return true;
    return false
}

const height = (h, params) => {
    const {regex, mincm, maxcm, minin, maxin} = params;
    const unit = h.slice(-2);
    const height = Number(h.slice(0,-2));
    if(h.match(regex)){
        if(unit === "cm" && height>=mincm && height <= maxcm ){
            return true;
        }

        if(unit === "in" && height>=minin && height <= maxin){
            return true;
        }
    }
    return false
}

const general = (val, params) => {
    const {regex} = params;
    if(val.match(regex)){
        return true;
    }
    return false;
}

const checkCases = (item) => {
    switch(item){
        case 'byr':
            return (year, params) => yr(year, params)
        case 'iyr':
            return (year, params) => yr(year, params)
        case 'eyr':
            return (year, params) => yr(year, params)
        case 'hgt':
            return (hgt, params) => height(hgt, params)
        case 'cid':
            return () => true
        default:
            return (val, params) => general(val, params)
    }
}