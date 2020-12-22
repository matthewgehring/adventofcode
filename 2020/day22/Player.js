class Player extends Array {

    constructor(deck){
        super();
        deck = deck.map(item => Number(item));
        this.push(...deck);
    }

    toDeck(val) {
        this.push(...val);
    }

    draw() {
        return this.shift();
    }

    score() {
        return this.reverse().reduceRight((acc, curr, i) => acc+=curr*(i+1), 0);
    }

    subDeck(){
        return this.slice(0,n);
    }

    isEmpty() {
        return this.length === 0;
    }
}

export default Player;