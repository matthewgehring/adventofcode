import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n\r\n')));
    console.log('question 2: ', main2(data.split('\r\n\r\n')));
})

const main = (data) => {
    let sets = data.map(element => {
        let set = new Set();
        let cleaned = element.split('\r\n').map(letter => letter.split('')).flat();
        cleaned.map(letter => {
            if(letter){set.add(letter)}
        })
        return set.size;
    });
    return sets.reduce((acc, cur)=>acc+= cur)
}

const main2 = (data) => {
    let arrs = data.map(element => {
        let valid = []
        let arr = element.split('\r\n').map(letter =>  letter.split(''));
        if(arr.length === 1) return arr[0].length;
        arr[0].forEach(element => {
            if(includesQuestion(arr, element)){
                valid.push(element)
            }
        });
        return valid.length;
    })
    return arrs.reduce((acc, cur)=>acc + cur)
}

const includesQuestion = (array, item) => {
    let trutharr = array.map(elm => elm.includes(item))
    return !(trutharr.includes(false));
}