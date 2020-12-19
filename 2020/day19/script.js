import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    //change precendence for part1/part2
    console.log('question: ', main(data.split('\r\n\r\n')));
})

const main = data => {
    let [rules, strings] = data;
    let ruleMap = new Map();
    rules.split('\r\n').forEach(rule => {
        let [key, value] = rule.split(':');
        ruleMap.set(key, value.trim().replace(/"/g, ''));
    });
    let exp = regExBuilder(ruleMap, ruleMap.get('0').split(''));
    console.log(exp);
    let reg = new RegExp(exp, 'g');
    let counter = 0;
    strings.split('\r\n').forEach(string => {
        if(string.match(reg)){
            counter += 1;
        }
    })
    return counter;
}

const regExBuilder = (ruleMap, arr) => {
    let nums = new RegExp('[0-9]+', 'g');
    let ops = new RegExp('[\(|\)|\|]', 'g')

    if(!(arr.join('').match(nums))){
        let expression = '^'+arr.join('') + '$';
        return expression;
    }

    let answer = [];
    
    for(let x=0; x<arr.length; x++){
        if(arr[x].match(nums)){
            let value = arr[x].match(nums)[0];
            if(ruleMap.get(value).match(nums)){
                answer.push(`(${ruleMap.get(value)})`);
            } else{
                answer.push(ruleMap.get(value));
            }
        } else if(arr[x] === '(' || arr[x]===')'|| arr[x]==='|' || arr[x]==='a'|| arr[x]==='b'){
            answer.push(arr[x])
        }
        //answer.push(arr[x]);
    }

//regExBuilder(ruleMap, answer.join('').split(''));
    return regExBuilder(ruleMap, answer.join('').split(''));

}