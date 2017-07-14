var express = require("express");
var sequelize = require("sequelize");
var router = express.Router();

//Passport Additions
var passport = require('../config/passport');
var isAuthenticated = require('../config/middleware/isAuthenticated');

var db = require("../models");
//find all
router.get("/", function(req, res) {

    db.Book.findAll({
        // order: sequelize.col('publish_date', 'DESC')
        order: [
            ['publish_date', 'DESC']
        ]
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        res.render("index", hbsObject);
    }).catch(function(err) {
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
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        var cleanedData = JSON.parse(JSON.stringify(hbsObject));
        console.log(cleanedData)
        res.render("product", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
});


// Search by Title
// router.post("/title", function(req, res) {

//     db.Book.findAll({
//         order: [
//             ['publish_date', 'DESC']
//         ],
//         where: {
//             title: req.body.title
//         }
//     }).then(function(dbBook) {
//         res.json(dbBook);
//     }).catch(function(err) {
//         console.log("Error Message: " + err);
//         res.send("You got an error!");
//     });

// });

router.get("/title/:title", function(req, res) {
    var title = req.params.title
    title = decodeURI(title);
    var hasTitle = "%" + title + "%";
    db.Book.findAll({
        order: [
            ['publish_date', 'DESC']
        ],
        where: {
            title: {
                $like: hasTitle
            }
        }
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        res.render("index", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });

});


router.get("/character/:character", function(req, res) {
    var character = req.params.character
    character = decodeURI(character);
    var hasCharacter = "%" + character + "%";
    db.Book.findAll({
        where: {
            characters: {
                $like: hasCharacter
            }
        }
    }).then(function(dbBook) {
        console.log(dbBook);
        var hbsObject = {
            books: dbBook
        };
        res.render("index", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });

});








//Authentication

router.get("/signup", function(req, res) {


    res.render("signup")

});



router.post('/signup', function(req, res) {
    console.log(req.body)
    db.User
        .create({
            email: req.body.email,
            password: req.body.password
        })
        .then(function() {
            res.json('/login')
        })
        .catch(function(err) {
            console.log(err)
            res.status(422).json(err)
        })
})

router.get("/login", function(req, res) {


    res.render("login")

});

router.post('/login', passport.authenticate('local'), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json('/cms')
})

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})


//CMS Stuff


router.get("/cms", function(req, res) {
    if (!req.user) {
        return res.send("You do not have authorization.")
    } else {
        res.render("cms")
    }

})



router.get("/addbook", function(req, res) {
    console.log("user ver: " + req.user.verification)
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
        res.render("addBook")
    }



});

// Add new Book
router.post("/book", function(req, res) {

    if (!req.user.verification) {
        return res.send('You do not have authorization.')
    } else {

        db.Book.create({
            title: req.body.title,
            issue: req.body.issue,
            publish_date: req.body.publish_date,
            publisher: req.body.publisher,
            synopsis: req.body.synopsis,
            role: req.body.role,
            img_url: req.body.img_url,
            characters: req.body.characters,
            teams: req.body.teams
        }).then(function(dbBook) {
            res.send("Book has been added.");
        }).catch(function(err) {
            console.log("Error Message: " + err);
            res.send("You got an error!");
        });

    }

});


router.get("/addart", function(req, res) {

    if (!req.user.verification) {
        return res.send('You do not have authorization.')
    } else {
        return res.render("addArt")
    }

});

// Add new Artwork
router.post("/artwork", function(req, res) {
    if (!req.user.verification) {
        return res.send('You do not have authorization.')
    } else {


        db.Artwork.create({
            page_num: req.body.page_num,
            format: req.body.format,
            img_url: req.body.img_url,
            description: req.body.description,
            feature: req.body.feature,
            BookId: req.body.BookId
        }).then(function(dbBook) {
            res.send("Artwork has been added.");
        }).catch(function(err) {
            console.log("Error Message: " + err);
            res.send("You got an error!")
        });
    }

});


router.get("/cms/books", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
        db.Book.findAll({
        // order: sequelize.col('publish_date', 'DESC')
        order: [
            ['publish_date', 'DESC']
        ]
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        res.render("cmsBooks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
    }
})

router.get("/cms/title/:title", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    var title = req.params.title
    title = decodeURI(title);
    var hasTitle = "%" + title + "%";
    db.Book.findAll({
        order: [
            ['publish_date', 'DESC']
        ],
        where: {
            title: {
                $like: hasTitle
            }
        }
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        res.render("cmsBooks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
    }

});

router.get("/cms/character/:character", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    var character = req.params.character;
    character = decodeURI(character);
    var hasCharacter = "%" + character + "%";
    db.Book.findAll({
        where: {
            characters: {
                $like: hasCharacter
            }
        }
    }).then(function(dbBook) {
        console.log(dbBook);
        var hbsObject = {
            books: dbBook
        };
        res.render("cmsBooks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });

    }

});

router.get("/cms/feature/:feature", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    var feature = req.params.feature
    feature = decodeURI(feature);
    var hasFeature = "%" + feature + "%";
    db.Artwork.findAll({
        where: {
            feature: {
                $like: hasFeature
            }
        }
    }).then(function(dbArtwork) {
        
        var hbsObject = {
            books: dbArtwork
        };
        res.render("cmsArtworks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });

    }

});


router.get("/cms/bookid/:bookid", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    var bookId = req.params.bookid
    bookId = decodeURI(bookId);
    // var hasBookId = "%" + bookId + "%";
    db.Artwork.findAll({
        where: {
            BookId: bookId
        }
    }).then(function(dbArtwork) {
        
        var hbsObject = {
            books: dbArtwork
        };
        res.render("cmsArtworks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });

    }

});



router.get("/cms/artworks", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
        db.Artwork.findAll({
        // order: sequelize.col('publish_date', 'DESC')
        order: [
            ['BookId', 'DESC']
        ]
    }).then(function(dbArtwork) {
        var hbsObject = {
            books: dbArtwork
        };
        res.render("cmsArtworks", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
    }
})

router.get("/cms/edit/:id", function(req, res) {

    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
        db.Book.findAll({
        include: [db.Artwork],
        where: {
            id: req.params.id
        }
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        // var cleanedData = JSON.parse(JSON.stringify(hbsObject));
        // console.log(cleanedData)

        res.render("editBook", hbsObject);
    })

}

});

router.post("/cms/edit", function(req, res) {
    console.log("Made It!");
    if (!req.user.verification) {
        return res.send('You do not have authorization.')
    } else {

        db.Book.update({
            title: req.body.title,
            issue: req.body.issue,
            publish_date: req.body.publish_date,
            publisher: req.body.publisher,
            synopsis: req.body.synopsis,
            role: req.body.role,
            img_url: req.body.img_url,
            characters: req.body.characters,
            teams: req.body.teams
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(dbBook) {
            res.json("/cms");
        }).catch(function(err) {
            console.log("Error Message: " + err);
            res.send("You got an error!");
        });

    }

});

router.post("/cms/editArt", function(req, res) {
    console.log("Made It!");
    if (!req.user.verification) {
        return res.send('You do not have authorization.')
    } else {

        db.Artwork.update({
            page_num: req.body.page_num,
            format: req.body.format,
            img_url: req.body.img_url,
            description: req.body.description,
            feature: req.body.feature,
            BookId: req.body.BookId
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(dbBook) {
            res.json("/cms");
        }).catch(function(err) {
            console.log("Error Message: " + err);
            res.send("You got an error!");
        });

    }

});

router.get("/cms/editArt/:id", function(req, res) {

    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
        db.Artwork.findAll({
        where: {
            id: req.params.id
        }
    }).then(function(dbBook) {
        var hbsObject = {
            books: dbBook
        };
        // var cleanedData = JSON.parse(JSON.stringify(hbsObject));
        // console.log(cleanedData)

        res.render("editArtwork", hbsObject);
    })

}

});


router.get("/cms/users", function(req, res) {

    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    db.User.findAll({
        order: [
            ['email']
        ]
    }).then(function(dbUser) {
        var hbsObject = {
            books: dbUser
        };
        res.render("cmsUsers", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
}
});

router.put("/cms/user/:id", function(req, res) {
     if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {   

    db.User.update({
        verification: 1
    }, {
        where: {
            id: req.params.id
        }
    }).then(function(dbUser){
        res.redirect("/cms/users")
    })
 }   
});

router.delete("/cms/user/:id", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {    
    db.User.destroy( {
        where: {
            id: req.params.id
        }
    }).then(function(dbUser){
        res.redirect("/cms/users")
    })
}    
});

router.get("/cms/user/email/:email", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {    
    var email = req.params.email;
    email = decodeURI(email);
    var hasEmail = "%" + email + "%";
    db.User.findAll({

        where: {
            email: {
                $like: hasEmail
            }
        },
        order: [
            ['email']
        ]
    }).then(function(dbUser) {
        var hbsObject = {
            books: dbUser
        };
        res.render("cmsUsers", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
}
});

router.get("/cms/user/dbid/:dbid", function(req, res) {
    if (!req.user.verification) {
        return res.send("You do not have authorization.")
    } else {
    db.User.findAll({

        where: {
            id: req.params.dbid
        }
    }).then(function(dbUser) {
        var hbsObject = {
            books: dbUser
        };
        res.render("cmsUsers", hbsObject);
    }).catch(function(err) {
        console.log("Error Message: " + err);
        res.send("You got an error!");
    });
}
});




//exporting to server.js
module.exports = router;