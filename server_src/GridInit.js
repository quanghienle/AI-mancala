

const config = require('../src/config');

const initCell = (player, isMancala=false) => {
    const numberOfStones = isMancala ? 0 : config.numberOfStones;
    return {
        player: player,
        numberOfStones: numberOfStones,
        active: false,
        mancala: isMancala,
    }
}


const createList = (player) => {
    const alist = []
    for (let i=0; i<6; i++){
        const cell = i===2 ? initCell(player, true) : initCell(player) 
        alist.push(cell)
    }
    return alist
}

// let's say player x = Blue
// let's say player o = Red

const top = createList('x');

top[0].xy = [3,2];
top[1].xy = [3,1];
top[2].xy = [3,0]; //x mancala
top[3].xy = [4,1];
top[4].xy = [4,2];
top[5].xy = [4,3];

const right = createList('o');
right[0].xy = [5,3];
right[1].xy = [6,3];
right[2].xy = [7,3]; // o mancala
right[3].xy = [6,4];
right[4].xy = [5,4];
right[5].xy = [4,4];

const bottom = createList('x');
bottom[0].xy = [4,5];
bottom[1].xy = [4,6];
bottom[2].xy = [3,7]; // x mancala
bottom[3].xy = [3,6];
bottom[4].xy = [3,5];
bottom[5].xy = [3,4];

const left = createList('o')
left[0].xy = [2,4];
left[1].xy = [1,4];
left[2].xy = [0,3]; // o mancala
left[3].xy = [1,3];
left[4].xy = [2,3];
left[5].xy = [3,3];


const grid = {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
}

module.exports = grid;
