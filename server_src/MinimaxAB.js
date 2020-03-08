const MIN = Number.NEGATIVE_INFINITY;
const MAX = Number.POSITIVE_INFINITY;

module.exports = class Minimax {
  constructor() {
    this.count = 0;
  }
  
  max_value(node, alpha, beta, depth, h) {
    if (depth === 0 || node.getSuccessors().length === 0) {
      this.count += 1;
      return h(node);
    }

    let val = MIN;
    const successors = node.getSuccessors();

    for (const child of successors) {
      val = Math.max(val, this.min_value(child, alpha, beta, depth - 1, h));
      if (val >= beta) {
        return val;
      }
      alpha = Math.max(alpha, val);
    }
    return val;
  }

  min_value(node, alpha, beta, depth, h) {
    if (depth === 0 || node.getSuccessors().length === 0) {
      this.count += 1;
      return h(node);
    }

    let val = MAX;
    const successors = node.getSuccessors();

    for (const child of successors) {
      val = Math.min(val, this.max_value(child, alpha, beta, depth - 1, h));
      if (val < alpha) {
        return val;
      }
      beta = Math.min(beta, val);
    }
    return val;
  }

  alpha_beta_search(grid, player, h) {
    let best_val = MIN;
    let beta = MAX;
    let best_node = null;

    const Move = require("./PossibleMoves");
    const successors = new Move(player).findAll(grid);

    const info = [];
    for (const child of successors) {
      const val = this.min_value(child, best_val, beta, 1, h);
      info.push(val);
      if (val > best_val) {
        best_val = val;
        best_node = child;
      }
    }
    console.log(info);
    console.log("best-val", best_val);
    console.log(this.count)
    return [best_node, this.count];
  }
};
