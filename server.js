const express = require("express");
const mustacheExpress = require("mustache-express");
const mongo = require("mongodb");
const logger = require("morgan");
const path = require("path");
const data = require("./data.js")
const MongoClient = mongo.MongoClient;
const dbUrl = "mongodb://localhost:27017/mongoRobots";
const port = process.env.PORT || 8000;
const app = express();


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
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

app.listen(port, function () {
    console.log(`Sever is running on ${port} port.`);
})