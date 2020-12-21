import fs from 'fs';

fs.readFile('./data.txt', 'utf8', (err, data) => {

    console.log('question: ', main(data.split('\r\n')));
})

const main =  data => {
    let [part1, safeSet, masterAllergen] = getSafeIngredients(getMasterAllergenMap(getIngAll(data)));
    console.log("part 1: ", part1);

    let part2 = getTranslation(safeSet, masterAllergen);
    console.log("part 2: ", part2);

}

const getTranslation = (safeSet, masterAllergen) => {
    let items = masterAllergen.size;
    //console.log(items);
    let dict = [];
    let cache = [];
    while(cache.length < items){
        //console.log(cache);
        for(const item of masterAllergen){
            let [trans, orig] = item;
            //console.log(trans, orig);
            if(orig.size === 1){
                dict.push({english: trans, foreign: [...orig][0]})
                masterAllergen.delete(trans);
                cache.push(...orig);
            } else {
                for(const elm of orig){
                    if(cache.includes(elm)){
                        //console.log("hello", elm)
                        orig.delete(elm);
                    }
                }
            }
        }
    }

    dict.sort(function(a, b) {
        return a.english.localeCompare(b.english);
     });
    let part2 = dict.map(elm => elm.foreign)
    return part2.join();

}

const getSafeIngredients = ([master, ingredients]) => {
    let safe = [];

    let masterSet = new Set();
    for(const value of master.values()){
        for(const v of [...value]){
            masterSet.add(v);

        }
    }

    for(let idx=0; idx<ingredients.length; idx++){
        let ingredient = ingredients[idx].split(' ').filter(Boolean)
        for(const ing of ingredient){
            if(!masterSet.has(ing)){
                safe.push(ing);
            }
        }
    }
    let safeSet = new Set([...safe]);
    console.log(safeSet);
    return [safe.length, safeSet, master];
}
const getMasterAllergenMap = ([ingredients, allergens]) => {
    let masterAllergen = new Map();
    for(let idx=0; idx<ingredients.length; idx++){
        let ingredient = new Set(ingredients[idx].split(' ').filter(Boolean));
        let allergen = allergens[idx].replace(/([,] )/g, ' ').split(' ');

        for(const all of allergen){
            if(!masterAllergen.has(all)){
                masterAllergen.set(all, ingredient);
            } else {
                let curr = masterAllergen.get(all);
                let union = new Set(getIntersect(curr, ingredient));
                masterAllergen.set(all, union);
            }
        }
    }
    return [masterAllergen, ingredients];

}

const getIngAll = data => {
    let ingredients = [];
    let allergens = [];
    data.forEach(line => {
        let [i, a] = line.split('(contains ');
        ingredients.push(i);
        allergens.push(a.slice(0,-1));
    })
    return [ingredients, allergens]
}

const getIntersect = (curr, n) => {
    return [...curr].filter(x => n.has(x));
}