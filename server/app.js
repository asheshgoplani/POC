// Load required packages
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Person = require("./models/person");
var cors = require("cors");
//Connecting to MongoDB
const mongoURI =
  "mongodb+srv://ashesh:Pakistan1@cluster0-btnqs.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Create our Express application
var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Use environment defined port or 5000
var port = process.env.PORT || 5000;

// Create our Express router
var router = express.Router();

router.get("/", function(req, res) {
  res.json({ message: "Server Working!" });
});

//Create
router.post("/create", (req, res) => {
  let person = new Person({
    name: req.body.name,
    address: req.body.address
  });

  person.save(function(err) {
    if (err) {
      return next(err);
    }
    res.send("Person Created successfully");
  });
});

// Read
router.get("/all", (req, res) => {
  Person.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});

//Update
router.put("/:id/update", function(req, res) {
  Person.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name, address: req.body.address } },
    { useFindAndModify: false }
  )
    .then(result => {
      res.send("done");
    })
    .catch(err => {
      console.log(err);
    });
});

//Delete
router.delete("/:id/delete", function(req, res) {
  Person.findOneAndDelete({ _id: req.params.id }).then(result => {
    res.send("done");
  });
});

// Register all our routes with /api
app.use("/", router);

// Start the server
app.listen(port);
