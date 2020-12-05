import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

const main = (data) => {
    let ids = getIds(data);
    return bubbleSort(ids).pop();
}

const main2 = (data) => {
    let ids = getIds(data);
    let sorted = bubbleSort(ids);
    let jump = sorted.filter((item, index, sorted) => !(item + 1 === sorted[index+1])).shift();
    return jump + 1

}

const getIds = (data) => {
    let cords = data.map(string => {
        return [recursion(string.split(''),['F','B'], [0, 127]), recursion(string.slice(-3).split(''),['L','R'], [0, 7])]
    })
    let ids = cords.map(rcs => {
        let [row, col] = rcs;
        return row * 8 + col;
    })
    return ids;
}

const recursion = (string, chars, bounds) => {
    let [low, high] = bounds;
    let [lower, upper] = chars;
    let char = string.shift()
    if(!(chars.includes(char))) return high
    if(char === lower) {
        high = Math.floor((low+high)/2);
    } else if(char === upper){
        low = Math.ceil((low+high)/2);
    }
    return recursion(string, chars, [low, high] )
}

function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(arr[j-1]>arr[j]){
            var temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
         }
      }
    }
    return arr;
 }