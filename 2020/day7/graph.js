class Graph {
    constructor() {
      this.adjacencyList = {};
    }
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
    addEdge(source, destination, weight) {
      if (!this.adjacencyList[source]) {
        this.addVertex(source);
      }
      this.adjacencyList[source].push([destination, Number(weight)]);
    }
    // removeEdge(source, destination) {
    //   this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
    //   this.adjacencyList[destination] = this.adjacencyList[destination].filter(vertex => vertex !== source);
    // }
    // removeVertex(vertex) {
    //   while (this.adjacencyList[vertex]) {
    //     const adjacentVertex = this.adjacencyList[vertex].pop();
    //     this.removeEdge(vertex, adjacentVertex);
    //   }
    //   delete this.adjacencyList[vertex];
    // }
    
    dfsUtil(v, visited, paths){
        if(this.adjacencyList[v]){
            visited.add(v)
            this.adjacencyList[v].forEach(neighbor => {
                let [neigh, weight] = neighbor;
                paths.push(neigh);
                if(!(visited.has(neigh))){
                    this.dfsUtil(neigh, visited, paths)
                }
            });  
        }
        return paths
    }

    DFS(v){
        let visited = new Set();
        let paths = [];
        return this.dfsUtil(v, visited, paths);
    }

    bagSumUtil(v){
        //checks if node has neighbors
        let counter = 0
        if(this.adjacencyList[v]){
            //for each neighbor
            this.adjacencyList[v].forEach(neighbor => {
                //get the neighbor and amount
                let [neigh, bags] = neighbor;
                //return 1 when no neighbor
                if(bags === 0){
                    return 1;
                } else{
                    counter = counter + bags;
                    let childCount = bags * this.bagSumUtil(neigh)
                    counter = counter + childCount
                }
            }); 
        }
        return counter
    }

    bagSum(v){
        return this.bagSumUtil(v)
    }
  }

  export default Graph;