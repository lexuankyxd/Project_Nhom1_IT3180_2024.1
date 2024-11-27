const app = require("express")();

const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, (err) => {
  if (err) {
    console.log("err!");
  } else console.log("listening on " + port);
});
