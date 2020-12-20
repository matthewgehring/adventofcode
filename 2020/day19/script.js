import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {

    console.log('question: ', main(data.split('\r\n\r\n')));
})

const main = data => {
    let [rules, strings] = data;
    let ruleMap = new Map();
    rules.split('\r\n').forEach(rule => {
        let [key, value] = rule.split(':');
        ruleMap.set(key, value.trim().replace(/"/g, ''));
    });
    let exp = regExBuilder(ruleMap, ruleMap.get('0').split(' '));
    exp = exp.split(' ').join('');
    let reg = new RegExp(exp, 'g');
    let counter = 0;
    strings.split('\r\n').forEach(string => {
        if(string.match(reg)){
            counter += 1;
        }
    })
    return counter;
}

const regExBuilder = (ruleMap, arr, count = 0) => {
    let num = new RegExp('[0-9]+', 'g');
    let nums = new RegExp('^[0-9]+$', 'g');
    let ops = new RegExp('[\(|\)|\|]', 'g');

    if(!(arr.join('').match(num))){
        console.log(arr.length);
        let expression = '^'+arr.join('') + '$';
        return expression;
    }

    let answer = [];
    
    for(let x=0; x<arr.length; x++){
        if(arr[x].match(nums)){
            if((arr[x] === '8' || arr[x]=== '11') && count < 10){
                let value = arr[x].match(nums)[0];
                if(ruleMap.get(value).match(num)){
                    answer.push(`( ${ruleMap.get(value)} )`);
                } else{
                    answer.push(ruleMap.get(value));
                }
            } else if (arr[x] === '8' || arr[x]=== '11'){
                continue;
            } else {
                let value = arr[x].match(nums)[0];
                if(ruleMap.get(value).match(num)){
                    answer.push(`( ${ruleMap.get(value)} )`);
                } else{
                    answer.push(ruleMap.get(value));
                }
            }
        } else if(arr[x] === '(' || arr[x]===')'|| arr[x]==='|' || arr[x]==='a'|| arr[x]==='b'){
            answer.push(arr[x])
        }
    }
    
    return regExBuilder(ruleMap, answer.join(' ').split(' '), count + 1);

}