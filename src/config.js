

const config = {
    cellHeight: 70,
    numberOfStones: 5,
    activeColor: 'magenta',
    options: [
        {label: 'skip', put: 0, take: 0},
        {label: 'place 1 & take 0', put: 1, take: 0},
        {label: 'place 1 & take 1', put: 1, take: 1},
        {label: 'place 1 & take 2', put: 1, take: 2},
    ],
    player: {
        'x': {
            name: 'Player_1 (blue)',
            mancala: [2, 14],
            border: 'white',
            background: 'powderblue'
        },
        'o': {
            name: 'Player_2 (red)',
            mancala: [8, 20],
            border: 'white',
            background: 'lightsalmon'
        }

    }
    
}

module.exports = config;