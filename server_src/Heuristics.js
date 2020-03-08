const config = require("../src/config");

const h_side_count = node => {
  const { grid, player, lastIndex } = node;
  let score = 0;
  grid.filter(x => x.player === player).forEach(cell => (score += cell.numberOfStones));
  if (config.player[player].mancala.includes(lastIndex)) {
    score += 10;
  }

  const mancalas = config.player[player].mancala;

  score += grid[mancalas[0]].numberOfStones;
  score += grid[mancalas[1]].numberOfStones;

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

const h_mancalas_less = node => {
  const { grid, player, lastIndex } = node;
  let score = 0;
  
  grid.filter(x => x.player === player).forEach(cell => (score += cell.numberOfStones));
  if (config.player[player].mancala.includes(lastIndex)) {
    score += 10;
  }

  const mancalas = config.player[player].mancala;

  score -= 2*grid[mancalas[0]].numberOfStones + 2;
  score -= 2*grid[mancalas[1]].numberOfStones + 2;

  if (mancalas.includes(lastIndex)) {
    score += 10;
  }
  return score;
};


const h_percentage = node => {
  const { grid, player, lastIndex } = node;

  let sum_x = 0;
  let sum_o = 0;
  grid.forEach(cell => {
    cell.player === "o" ? (sum_o += cell.numberOfStones) : (sum_x += cell.numberOfStones);
  });

  const who_op = player==="o" ? sum_x : sum_o;

  let score = - who_op;

  const mancalas = config.player[player].mancala;
  if (mancalas.includes(lastIndex)) {
     score += 10;
  }  

  return score;
};

const h_new = node => {
  const { grid, player, lastIndex } = node;

  let sum_x = 0;
  let sum_o = 0;
  grid.forEach(cell => {
    cell.player === "o" ? (sum_o += cell.numberOfStones) : (sum_x += cell.numberOfStones);
  });

  const who = player === "x" ? sum_x : sum_o;
  const who_op = player === "o" ? sum_x : sum_o;

  let score = (who - who_op) * 5;

  const mancalas = config.player[player].mancala;
  if (mancalas.includes(lastIndex)) {
    score += 10;
  }

  return score;
};


module.exports = {
  h_side: h_side_count,
  h_mancalas: h_mancalas_less,
};
