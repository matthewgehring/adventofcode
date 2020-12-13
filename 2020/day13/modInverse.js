const modInverse = (a,m) => {
    let g = gcd(a, m);

    if(g != 1n){
        console.log("No Inverse");
    } else {
        return power(a,m-2n,m)
    }
}

const power = (x, y, m) => {
    if(y===0n) return 1n;

    let p = power(x, y/2n, m) % m;
    p = (p*p) % m;

    if(y%2n === 0n) return p;
    else return ((x*p) % m);
}

const gcd = (a,b) => {
    if(a===0n) return b;
    return gcd(b%a, a)
}

export default modInverse;