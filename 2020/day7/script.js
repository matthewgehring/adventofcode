import fs from 'fs';
import Graph from './graph.js';

fs.readFile('./data.txt', 'utf8', (err, data) => {
    console.log('question 1: ', main(data.split('\r\n')));
})

const main = (data) => {
    let [parsed, weights] = parseData(data);
    let graph = createGraph(parsed, weights);
    console.log(getPaths(graph, 'no other'))
    console.log(graph.bagSum('shiny gold'))
}

const parseData = (data) => {
    let regex = new RegExp('([ ]?[0-9]+ |[,] | bags contain | bag.| bags.| bags, | bag, |[.])');
    let getNums = new RegExp('[ ]?[0-9]+ ', 'g');
    let parsed = data.map(line => line.split(regex))
    let nums = data.map(line => line.match(getNums))
    return [parsed.map(line => line.map(elm => elm.replace(regex,[])).filter(elm => elm)), nums]

}

const createGraph = (data, weights) => {
    let myGraph = new Graph;
    data.forEach((element, index) => {
        let [vert, ...edges] = element;
        let weight = weights[index];
        myGraph.addVertex(vert)
        edges.forEach((edge, i) => {
            if(weight){
                myGraph.addEdge(vert, edge, weight[i])
            } else {
                myGraph.addEdge(vert, edge, 0)

            }
        })
    });
    return myGraph;
}


const getPaths = (myGraph, destination) => {
    let paths = {}
    let count = 0;
    for (const[key,] of Object.entries(myGraph.adjacencyList)){
        paths[key] = myGraph.DFS(key).flat()
        if(paths[key].includes(destination)){
            count++;
        }
    }
    return count;
}


