var express = require("express");
var sequelize = require("sequelize");
var router = express.Router();


var db = require("../models");
//find all
router.get("/", function(req, res) {
   
  db.Book.findAll({
    // order: sequelize.col('publish_date', 'DESC')
    order:   [['publish_date', 'DESC']] 
  }).then(function(dbBook){
    var hbsObject ={
      books: dbBook
    };
    res.render("index", hbsObject);
  }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });

});

router.get("/product/:id", function(req, res) {

  db.Book.findAll({
    include: [db.Artwork],
    where: {
      id: req.params.id
    }
  }).then(function(dbBook){
    var hbsObject ={
      books: dbBook
    };
    var cleanedData = JSON.parse(JSON.stringify(hbsObject));
    console.log(cleanedData)
    // console.log(cleanedData.books[0].Artworks)
    // console.log(JSON.parse(JSON.stringify(hbsObject)));
    // console.log(hbsObject)
    // console.log(hbsObject.books[0].Artworks);
    res.render("product", hbsObject);
  }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });
});


// Search by Title
router.post("/title", function(req, res) {
   
  db.Book.findAll({
    order: [['publish_date', 'DESC']],
    where: {
      title: req.body.title
    }
  }).then(function(dbBook){
    res.json(dbBook);
  }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });

});

router.get("/title/:title", function(req, res) {
   var title = req.params.title
   title = decodeURI(title);
   var hasTitle = "%"+title+"%";
  db.Book.findAll({
    order: [['publish_date', 'DESC']],
    where: {
      title: {
        $like: hasTitle
      }
    }
  }).then(function(dbBook){
    var hbsObject ={
      books: dbBook
    };
    res.render("index", hbsObject);
  }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });

});

//Search by Character
// router.post("/character", function(req, res) {
//    var hasCharacter = "%"+req.body.character+"%"
//   db.Book.findAll({
//     where: {
//       characters: {
//         $like: hasCharacter
//       }
//     }
//   }).then(function(dbBook){
//     var hbsObject ={
//       books: dbBook
//     };
//     res.render("index", hbsObject);
//   }).catch(function (err){
//         console.log("Error Message: " + err);
//         res.send("You got an error!");
//       });

// });

router.get("/character/:character", function(req, res) {
  var character = req.params.character
   character = decodeURI(character);
   var hasCharacter = "%"+character+"%";
  db.Book.findAll({
    where: {
      characters: {
        $like: hasCharacter
      }
    }
  }).then(function(dbBook){
    console.log(dbBook);
    var hbsObject ={
      books: dbBook
    };
    res.render("index", hbsObject);
  }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });

});

router.get("/addbook", function(req, res) {

  
    res.render("addBook")
  
});

// Add new Book
router.post("/book", function(req, res) {
  
  db.Book.create(
      {
        title: req.body.title,
        issue: req.body.issue,
        publish_date: req.body.publish_date,
        publisher: req.body.publisher,
        synopsis: req.body.synopsis,
        role: req.body.role,
        img_url: req.body.img_url,
        characters: req.body.characters,
        teams: req.body.teams
      }).then(function (dbBook){
        res.send("Book has been added.");
      }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });


});

router.get("/addart", function(req, res) {

  
    res.render("addArt")
  
});

// Add new Artwork
router.post("/artwork", function(req, res) {
  
  db.Artwork.create(
      {
        page_num: req.body.page_num,
        format: req.body.format,
        img_url: req.body.img_url,
        description: req.body.description,
        feature: req.body.feature,
        BookId: req.body.BookId
      }).then(function (dbBook){
        res.send("Artwork has been added.");
      }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!")
      });


});



//exporting to server.js
module.exports = router;
