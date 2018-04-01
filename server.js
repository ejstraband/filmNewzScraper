// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

var cheerio = require("cheerio");
var request = require("request");

console.log("Scraping the Onion Opinions Site");

request("https://www.theonion.com/tag/opinion", function(error, response, html) {
  var $ = cheerio.load(html);

  var results = [];

  $("h1").each(function(i, element) {
    var title= $(element).text();
    var link= $(element).children().attr("href");

    results.push({
      title: title,
      link: link
    });
  }

  );
  console.log(results);
});