const express = require("express");
const app = express();
const port = process.env.PORT || 5000;


app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.json());

app.get("/backend", (req, res) => {
  const grid = require("./server_src/GridInit");
  const gridArr = grid.top.concat(grid.right, grid.bottom, grid.left);

  res.send({ grid: gridArr });
});


app.post("/api", (req, res) => {
  const heuristics = require("./server_src/Heuristics");
  const h = req.body.type === 1 ? heuristics.h_side : heuristics.h_mancalas;

  const Minimax = require("./server_src/MinimaxAB");
  const [best, nodeCount]= new Minimax().alpha_beta_search(req.body.gridArr, req.body.player, h);


  res.send(JSON.stringify({ move: best, nodeCount: nodeCount}));
});
