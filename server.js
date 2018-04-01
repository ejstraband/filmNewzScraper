// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

// REQUIREMENTS
// Server/DB
var express = require("express");
var mongojs = require("mongojs");
// Scraping
var cheerio = require("cheerio");
var request = require("request");

// express instance
var app = express();

// db variable setup
var databaseUrl = "onionScraper";
var collections = ["opinions"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error: ", error);
});

// Basic Start Page
app.get("/", function(req, res) {
  res.send("'The Onion' opinions scraper");
});

// List all database entries
app.get("/all", function(req, res) {
  db.opinions.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});


// put all scraped entries in the d.b.
app.get("/scrape", function(req, res) {
  console.log("Scraping the Onion Opinions Site");
  request("https://www.theonion.com/tag/opinion", function(error, response, html) {
    var $ = cheerio.load(html);
    
    $("h1").each(function(i, element) {
      var title= $(element).text();
      var link= $(element).children().attr("href");
      
    if (title && link) {
      db.opinions.insert({
        title: title,
        link: link
      },
      function(err, inserted) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
  console.log("articles inserted");
});

res.send("Scrape Completed");
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});