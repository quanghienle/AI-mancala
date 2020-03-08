

const config = {
    cellHeight: 70,
    speed: 200,
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
            background: 'powderblue',
            neighbors: [
                {pos: 0, adjacent: [23]},
                {pos: 12, adjacent: [11]},
                {pos: 5, adjacent: [6, 11, 23]},
                {pos: 17, adjacent: [18, 11, 23]},
            ]
        },
        'o': {
            name: 'Player_2 (red)',
            mancala: [8, 20],
            border: 'white',
            background: 'lightsalmon',
            neighbors: [
                {pos: 6, adjacent: [5]},
                {pos: 18, adjacent: [17]},
                {pos: 11, adjacent: [5, 12, 17]},
                {pos: 23, adjacent: [0, 5, 17]},
            ]
        }

    }
    
}

module.exports = config;