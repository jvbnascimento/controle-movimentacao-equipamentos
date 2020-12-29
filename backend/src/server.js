const express = require("express");
const cors = require("cors");

const Role = require("./models/Role");
const Type = require("./models/Type");

require("./database");

const routes = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);