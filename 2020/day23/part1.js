const main = () => {
    let cups = '327465189'.split('');
    cups = cups.map(num => num*1);
    let cupList = new circularLinkedList();
    cups.forEach(elm => cupList.append(elm));

}

const part1 = (cups, t) => {
    let len = cups.length;
    let turns = 1;
    let cur = 0;
    let curVal = cups[cur];
    let dest = 0;
    while(turns <= t){
        //console.log(turns);
        let hand = [];
        hand = cups.splice(cur+1, 3)
        for(let z=0; z<3; z++){
            if(hand.length === 3){
                break;
            }
            hand.push(...cups.splice(0,1))
        }
            
        //console.log(hand);
        let found = false;
        let i = 1;
        while(!found){
            let min = Math.min(...cups);
            let max = Math.max(...cups);
            if(curVal-i < min){
                dest = cups.indexOf(max);
                found = true;
            } else if(!(cups.indexOf(curVal-i) === -1)){
                dest = cups.indexOf(curVal-i);
                found = true;
            }
            //found = true;
            i++
        }
        let x = 1;
        while(!(hand.length === 0)){
            if(dest+x > 9){
                cups.splice(0, 0, hand.shift());

            }else{

                cups.splice((dest+x), 0, hand.shift());
            }
            x++;
        }
        cur = (cups.indexOf(curVal)+1) % len;
        curVal = cups[cur];
        //console.log(cups);
        turns++;
    }
    return cups;
}

main();