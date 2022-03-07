function seed(...args) {
  return Array.of(...arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.find(element => same(element,cell)) !== undefined;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)){
    return '\u25A3';
  };

  return '\u25A2';
};

const corners = (state = []) => {
  let topRight = [0,0];
  let bottomLeft = [0,0];

  if(state.length > 0){
    let firstCoordinates = state.map(element => element[0]).sort((a,b) => a - b);
    let secondCoordinates = state.map(element => element[1]).sort((a,b) => a - b);

    bottomLeft = [firstCoordinates[0],secondCoordinates[0]];
    topRight = [firstCoordinates.reverse()[0], secondCoordinates.reverse()[0]];
  }

  return {
    topRight,
    bottomLeft
  }

};

const printCells = (state) => {
  let { topRight, bottomLeft } = this.corners(state);
  let result = "";

  for(let i = bottomLeft[0]; i <= topRight[0]; i++)
  {
    for(let j = topRight[1]; j >= bottomLeft[1]; j--)
    {
      result += printCell([i,j],state);
      if(j != bottomLeft[1])
        result += ' ';
    }

    result += '\n';
  }

  return result;
};

const getNeighborsOf = ([x, y]) => {
  let result = new Array();

  for(let i = x-1; i <= x+1; i++)
  {
    for(let j = y-1; j <= y+1; j++)
    {
      if(i != x || j != y)
        result.push([i, j]);
    }
  }

  return result;
};

const getLivingNeighbors = (cell, state) => 
{
  return getNeighborsOf(cell).filter(element => contains.call(state, element));
};

const willBeAlive = (cell, state) => {
  let livingNeighbors = getLivingNeighbors(cell, state);
  return livingNeighbors.length == 3 || (contains.call(state, cell) && livingNeighbors.length == 2);
};

const calculateNext = (state) => {
  let result = new Array();
  let { bottomLeft, topRight } = this.corners(state);

  for(let i = bottomLeft[0] -1; i <= topRight[0] + 1; i++)
  {
    for(let j = bottomLeft[1] - 1; j <= topRight[1] + 1; j++)
    {
      if(willBeAlive([i,j], state))
        result.push([i,j]);
    }
  }

  return result;
};

const iterate = (state, iterations) => {
  let result = Array.of(state);

  for(let i = 1; i <= iterations; i++)
  {
    state = calculateNext(state);
    result.push(state);
  }

  return result;
};

const main = (pattern, iterations) => {
  let result = iterate(this.startPatterns[pattern], iterations);
  result.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;