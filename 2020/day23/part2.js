//not my algorithm, turned someones python algorithm into JS
/*Learned a few things here, array indicies can be used somewhat like pointers between arrays, rather than just
as a pointer to a value in the given array. This solution is like a linked list
where one array holds the values of the cups and the other array allows you to access the next cup in order
given the value of the cup you're interested in. 
All of this allows for quick accessing of cup values and their next cups without having to iterate through an entire array every turn multiple times */

//faster than Math.max/min but unncessary
// const arrayMin = (arr) => {
//     return arr.reduce((p, v) => {
//       return ( p < v ? p : v );
//     });
//   }
  
// const arrayMax = (arr) => {
//     return arr.reduce((p, v) => {
//       return ( p > v ? p : v );
//     });
//   }

const  range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }


const crabcups = (labels, moves=100, cupcount=9) => {
    //next will store the next cup, it will also be filled such that next[i] = i+1;
    let next = range(1, cupcount+1);
    //cups[] stores each cup value
    let cups = labels.split('').map(i=>i*1);
    next[0] = next[next.length-1] = cups[0];
    for(let x=0; x<cups.length-1; x++){
        //here the cup value is used as the index, it points to the cup next to the current cup
        next[cups[x]] = cups[x+1]
    }
    //since our next array is filled with 1->cupcount the last value we care to set is the last 
    //cups next value, which will be 1+the max of cups
    next[cups[cups.length - 1]] = Math.max(...cups)+1;
    let cur = 0;

    for(let c=0; c<=moves; c++){
        //this is defined abouve as the first cup, next[0] = cups[0]
        cur = next[cur];
        let ins = cur !== 1 ? cur - 1 : cupcount;
        let p1 = next[cur];
        let p2 = next[p1];
        let p3 = next[p2];

        while(ins === p1 || ins === p2 || ins === p3){
            ins -= 1
        }
        if(ins < 1){
            ins += cupcount
        }

        [next[p3], next[ins], next[cur]] = [next[ins], next[cur], next[p3]]
    }
    return next[1] * next[next[1]];
}

console.log(crabcups('327465189', 10000000, 1000000))