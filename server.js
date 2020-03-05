const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// const bodyParser = require("body-parser");
app.use(express.json());

// create a GET route
app.get("/backend", (req, res) => {
  const grid = require("./server_src/GridInit");
  const gridArr = grid.top.concat(grid.right, grid.bottom, grid.left);

  res.send({ grid: [...gridArr] });
});

const h = (grid, player) => {
    let score = 0;

    grid.forEach((cell, index) => {
        if (cell.player === player){
            score += cell.numberOfStones;
        }        
    });

    return score;
}


app.post("/api", (req, res) => {

  console.log("\n=======================================================");
//   console.log(req.body)

  const Move = require("./server_src/PossibleMoves");
  const getMove = new Move(req.body.player, h);

    getMove.findAll(req.body.gridArr);
    // console.log(getMove.findAll(req.body.gridArr));
//   console.log(getMove.findSuccessors([], req.body.gridArr, 0, 0));

  console.log("Done. Now sending to client...");
  res.send(JSON.stringify({ path: "heyy"}));
});
