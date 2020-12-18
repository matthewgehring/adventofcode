import fs from 'fs';
import Queue from './Queue.js';
import Stack from './Stack.js';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    //change precendence for part1/part2
    console.log('question: ', main(data.split('\r\n')));
})

const main = (data) => {
    let sum = 0;
    data.forEach(line => {
        let postfix = shuntingYardAlgo(line);
        sum += Number(postfixEval(postfix));
    })
    return sum;
}

const shuntingYardAlgo = (l) => {
    let nums = new RegExp('[0-9]', 'g');
    let ops = new RegExp('[\+|-|\*]', 'g')
    let line = l.split('').filter(Boolean);
    let output = new Queue;
    let operators = new Stack;
    //change this for part1/part 2
    let precedence = {
        '+': 1,
        '*': 0,
    }
    for(let idx = 0; idx < line.length; idx++){
        if(line[idx].match(nums)){
            output.push(line[idx]);
        } else if(line[idx].match(ops)){
            while(!(operators.size()===0) && precedence[operators.peek()] > precedence[line[idx]] && !(operators.peek() === '(')){
                output.push(operators.pop());
            }
            operators.push(line[idx]);
        } else if(line[idx] === '('){
            operators.push(line[idx]);
        } else if(line[idx] === ')'){
            while(!(operators.peek() === '(')){
                output.push(operators.pop());
            }
            if((operators.peek() === '(')){
                operators.pop();
            }
        }
    }

    while(!(operators.size() === 0)){
        output.push(operators.pop());
    }
    return output;
}

const postfixEval = (postfix) => {
    let nums = new RegExp('[0-9]', 'g');
    let stack = new Stack();

    for(const token of postfix){
        if(token.match(nums)){
            stack.push(token);
        } else {
            let right = stack.pop();
            let left = stack.pop();
            stack.push(eval(`${left} ${token} ${right}`))
        }
    }

    return stack;
}