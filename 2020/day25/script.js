const getLoop = (key) => {
    let loop = 1;
    let subject = 7n;
    let value = 1n;
    while(!(value === key)){
        value *= subject;
        value = value % 20201227n
        loop++;
        // for(let x = loopstart; x<loop; x++){
        //     value *= subject;
        //     value = value % 20201227n
        // }
    }
    
    return loop-1;

}

const getEnc = (key, loop) => {
    let value = 1n;
    for(let x = 0; x<loop; x++){
        value *= key;
        value = value % 20201227n
    }
    return value
}

console.log(getEnc(13316116n, getLoop(13651422n)))

