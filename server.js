// const express = require("express");
// const app = express();
// require("dotenv").config();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { connectDB } = require("./db/db");
// const color = require("colors")
// const passport = require("passport");
// require("./db/passport");

// app.use(
//   cors({
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(passport.initialize());

// const PORT = process.env.PORT || 7000;

// connectDB();

// app.use("/api/auth", require("./router/auth/userRouter"));

// app.get("/", (req, res) => {
//   res.send("Welcome to the server");
// });

// app.listen(PORT, () => {
//   console.log(`PORT is running on ${PORT}`.rainbow);
// });

const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/db");
const color = require("colors");
const passport = require("passport");
require("./db/passport");

app.use(cors());
app.options("*", cors()); // Handle preflight requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

const PORT = process.env.PORT || 7000;

connectDB();

app.use("/api/auth", require("./router/auth/userRouter"));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.listen(PORT, () => {
  console.log(`PORT is running on ${PORT}`.rainbow);
});
