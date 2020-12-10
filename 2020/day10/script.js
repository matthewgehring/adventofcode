import { triggerAsyncId } from 'async_hooks';
import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n'))[0]);
    console.log('question 2: ', main(data.split('\r\n'))[1]);
})

const main = (data) => {
    data.push(0);
    let nums = bubbleSort(data.map(num => Number(num)));
    nums.push(3+Math.max(...nums))
    console.log(nums);
    return [getSeparation(nums), getPaths(nums)]//, getCombinations(nums)];
}

const getSeparation = (nums) => {
    let separations = {
        one: 0,
        two: 0,
        three: 0
    }
    nums.forEach((elm, index, arr) => {
        if(elm+1 === arr[index+1]){
            separations.one+=1;
        } else if(elm+3 === arr[index+1]){
            separations.three+=1;
        }
    });
    return separations.one*separations.three;
}


//taken from reddit
const getPaths = (input) => {
    let countArr = [1];
	let iterate = (index, joltDif) => (input[index - joltDif] >= (input[index] - 3) ) ? countArr[index - joltDif] : 0;
	for(let i=1;i<input.length;i++){
		let count = iterate(i, 1) + iterate(i, 2) + iterate(i, 3);
		countArr.push(count);
    }
    return countArr[countArr.length-1]
}

const isValid = (data) => {
    for(let index=0; index<data.length-1; index++){
        let elm = data[index];
        if(!(elm+1 === data[index+1] || elm+2 === data[index+1] || elm+3 === data[index+1])){
            return false;
        }
    }
    return true;
}

const bubbleSort = (arr) => {
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