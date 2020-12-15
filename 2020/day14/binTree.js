const wildcard = (address, index=0, addresses) => {
    if(index === address.length){
        addresses.push(address.toString().replace(/,/g, ''))
        return;
    }

    if(address[index] === "X"){
        address[index] = '0';
        wildcard(address, index+=1, addresses)
        index -= 1;
        address[index] = '1';
        wildcard(address, index+=1, addresses)
        index-=1;
        address[index] = 'X';
    }else{
        wildcard(address, index+=1, addresses)
    }
    return addresses
}
let address = '00000000000000000000000000000001X0XX'.split('');
console.log(wildcard(address, 0, []));