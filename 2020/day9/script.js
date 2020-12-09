import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
    console.log('question 2: ', main2(data.split('\r\n')));
})

const main = (data) => {
    const nums = data.map(elm => Number(elm));
    return checkForTwoSum(nums);
}

const main2 = (data) => {
    const nums = data.map(elm => Number(elm));
    let checkVal = main(nums);
    let ans = CheckForSegSum(nums, checkVal);
    return Math.min(...ans) + Math.max(...ans);
}

const checkForTwoSum = (data, plen=26) => {
    for(let index=0; index < data.length-plen; index++) {
        let [pre, val] = getSegment(data, index, plen+index);
        if(!(twoSum(pre, val))){
            return val;
        }
    };
    return false;
}

const CheckForSegSum = (data, checkVal) => {
    for(let plength=3; plength<data.length-plength; plength++){
        for(let index=0; index < data.length-plength; index++) {
            let [pre, val] = getSegment(data, index, plength+index);
            let sum = pre.reduce((acc, cur) => acc+cur);
            if(sum === checkVal){
                return pre;
    
           }
        };
    }
    return false;
}

const getSegment = (data, start, plen = 26) => {
    const preamble = data.slice(start, plen)
    const val = preamble.pop()
    return [preamble, val];
}

const twoSum = (arr, target) => {
    
    // Object is a hashmap with O(1) for property access
    // Key === array's element, value === index of that element
    const traversedNumbers = {};
  
    return arr.reduce(
      (acc, val, idx, array) => {
       
        // Look up whether we did already traversed the value we need
        const complimentIndex = target - val;
        
        if (traversedNumbers[complimentIndex] !== undefined) {
          // mutate the array to early break array reducing
          array.splice(1);
          return true; //[traversedNumbers[complimentIndex], idx];
        }
        
        traversedNumbers[val] = idx;
        return false;
      },
      // Initial accumulator value;
      [null, null]
    );
  };