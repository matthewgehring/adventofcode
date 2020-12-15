const starting = [20,0,1,11,6,3];

let spoken = new Map();
let justSpoke = 0;
for(let i=0; i<30000000; i++){
    if(starting[i] || starting[i] === 0){
        justSpoke = starting[i];
        spoken.set(justSpoke, i+1);
    } else if(!(spoken.has(justSpoke))){
        spoken.set(justSpoke, i);
        justSpoke = 0;
    } else{
        let temp = spoken.get(justSpoke);
        spoken.set(justSpoke, i);
        justSpoke = i - temp;
    }

    //console.log("turn", i+1, justSpoke);
}
console.log(justSpoke);