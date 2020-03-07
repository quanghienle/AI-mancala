const config = require("../src/config");

const h_side_count = node => {
  const { grid, player, lastIndex } = node;
  let score = 0;
  grid.filter(x => x.player === player).forEach(cell => (score += cell.numberOfStones));
  if (config.player[player].mancala.includes(lastIndex)) {
    score += 10;
  }
  return score;
};

const h_mancalas_count = node => {
  const { grid, player, lastIndex } = node;
  let score = 0;

  const mancalas = config.player[player].mancala;

  score += grid[mancalas[0]].numberOfStones;
  score += grid[mancalas[1]].numberOfStones;

  if (mancalas.includes(lastIndex)) {
    score += 10;
  }
  return score;
};

module.exports = {
  h_side: h_side_count,
  h_mancalas: h_mancalas_count,
};
