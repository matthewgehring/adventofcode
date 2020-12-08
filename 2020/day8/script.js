import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    main2(data.split('\r\n'));
})

const main = (data) => {
    let instructions = getInstructions(data);
    return checkIfCyclic(instructions);
}

const checkIfCyclic = (instructions) => {
    let usedPointers = new Set();
    let pointer = 0;
    let accumulator = 0;
    while(!(usedPointers.has(pointer))){
        usedPointers.add(pointer)
        let [acc, point] = evaluate(instructions[pointer], pointer)
        accumulator += acc;
        pointer = point
        if(pointer === instructions.length) {
            console.log("question 2: ", accumulator);
            return false
        }
    }
    return accumulator;
}

const main2 = (data) => {
    let instructions = getInstructions(data);
    instructions.some((element, i, a) => {
        if(a[i][0] === "jmp"){
            a[i][0] = "nop";
            if(!checkIfCyclic(a)){
                return true;
            }
            a[i][0] = "jmp"
        } else if(a[i][0] === "nop"){
            a[i][0] = "jmp";
            if(!checkIfCyclic(a)){
                return true;
            }
            a[i][0] = "nop"
        } 
    });
}

const getInstructions = (data) => {
    let instructions = data.map(line => line.split(' '))
    return instructions
}

const evaluate = (instruction, pointer) => {
    let [inst, val] = instruction;
    if(inst === "acc"){
        return [Number(val), pointer+1]
    } else if(inst === "jmp"){
        return [0, pointer+=Number(val)]
    }
    return [0, pointer+1]
}