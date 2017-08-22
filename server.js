const express = require("express");
const mustacheExpress = require("mustache-express");
const mongo = require("mongodb");
const logger = require("morgan");
const path = require("path");
const MongoClient = mongo.MongoClient;
const dbUrl = "mongodb://localhost:27017/mongoRobots";
const port = process.env.PORT || 8000;
const ObjectId = mongo.ObjectID;
const app = express();
let Robots;
let DB;


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "./public")));

MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
        return console.log("Error connecting to the database:", err);
    }

    DB = db;
    Robots = db.collection("robots");
});

app.get("/insertMany", function (req, res) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            res.status(500).send(err);
        }
        let Robots = db.collection("robots");
        Robots.insertMany(data.users, function (err, savedRobots) {
            if (err) {
                res.status(500).send(err);
            }
            res.send(savedRobots);
            db.close();
        })
    })
})

app.get("/", (req, res) => {
    Robots.find({}).toArray((err, foundRobots) => {
        if (err) res.status(500).send(err);

        res.render("home", { users: foundRobots });
    });
});

app.get("/profile/:_id", function (req, res) {
    Robots.findOne({ _id: ObjectId(req.params._id) }, (err, foundRobot) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!foundRobot) {
            res.send("No user found")
        }
        res.render("profile", { user: foundRobot });
    })
})

app.get("/employed", function (req, res) {
    console.log("Getting employed!!!!!");
    Robots.find({ "job": { $ne: null } }).toArray((err, foundRobots) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!foundRobots) {
            res.send("No user found")
        }
        res.render("home", { users: foundRobots });
    })
})

app.get("/unemployed", function (req, res) {
    Robots.find({ job: null }).toArray((err, foundRobots) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!foundRobots) {
            res.send("No user found")
        }
        res.render("home", { users: foundRobots });
    })
})

app.listen(port, function () {
    console.log(`Server is running on ${port} port.`);
})