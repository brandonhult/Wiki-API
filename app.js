///////////////////////////////////////////////////////
//******************** INIT *************************//
// Requires
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();

// EJS
app.set('view-engine', 'ejs');

// Uses
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Mongoose connect
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

///////////////////////////////////////////////////////
//******************** DATABASE *********************//
// Schemas
const articleSchema = {
  title: String,
  content: String
};

// Models
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////////////////
//******************** ROUTES ***********************//
///////////// Requests Targetting Articles ////////////
app.route('/articles')

// GET
.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

// POST
.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  // SAVE
  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

// DELETE
.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err) {
      res.send("Successfully deleted all articles.")
    } else {
      res.send(err);
    }
  });
});

/////// Requests Targetting a Specific Article ////////
app.route('/articles/:articleTitle')

// GET
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No matches found.");
    }
  });
})

// PUT
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated article.");
      }
    }
  )
})

// PATCH
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  )
})

// DELETE
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err) {
        res.send("Successfully deleted article.");
      } else {
        res.send(err);
      }
    }
  )
});

///////////////////////////////////////////////////////
//******************** LISTEN ***********************//
// App Listen
app.listen(3000, function(){
  console.log("Logged in to port 3000")
});
///////////////////////////////////////////////////////
