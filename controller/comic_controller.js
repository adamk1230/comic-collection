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

//Search by Character
router.post("/character", function(req, res) {
   var hasCharacter = "%"+req.body.character+"%"
  db.Book.findAll({
    where: {
      characters: {
        $like: hasCharacter
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

router.post("/character", function(req, res) {
   var hasCharacter = "%"+req.body.character+"%"
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
        img_url: req.body.img,
        characters: req.body.characters,
        teams: req.body.teams
      }).then(function (dbBook){
        res.send("Book has been added.");
      }).catch(function (err){
        console.log("Error Message: " + err);
        res.send("You got an error!");
      });


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
