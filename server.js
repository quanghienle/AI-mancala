
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// create a GET route
app.get('/backend', (req, res) => {
    const grid = require("./server_src/GridInit");
    const gridArr = grid.top.concat(grid.right, grid.bottom, grid.left);

    res.send({ grid: gridArr});
});