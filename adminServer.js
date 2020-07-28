const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const products = require("./routes/api/products");
const admi = require("./routes/api/admi");
const app = express();
const multer = require("multer");
const passport = require("passport");

// Middlewares

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

require("./config/passportUser")(passport);

const { createReadStream } = require("fs");

app.get("/assets", async (req, res) => {
  createReadStream(`${__dirname}/uploads/${req.query.filename}`, {
    autoDestroy: true,
  })
    .on("error", () => res.status(400).end("Bad request"))
    .on("end", () => {
      res.end();
    })
    .pipe(res);
});

app.use("/api/products", products);
app.use("/api/admi", admi);

//Database confing

const db = require("./config/keys").mongoURI;

// Connecting to database
q;
mongoose
  .connect(db, {
    dbName: "HemightPropertiesDB",
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo connection error", err));

module.exports = app;
