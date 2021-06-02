const express = require("express");
const app = express();
const port = 3000;
const route = require("./routes/IndexRoute");
app.listen(process.env.PORT || port);
console.log(`Chạy domain là http://localhost:${port}`);

app.set("views","./views");
app.set("view engine","ejs");


route(app);