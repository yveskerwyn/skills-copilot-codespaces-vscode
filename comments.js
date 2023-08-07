// Create web server for comment

var express = require('express');
var router = express.Router();

var Comment = require('../models/comment');

router.get('/:id', function(req, res, next) {
    Comment.find({post_id: req.params.id}, function(err, comments) {
        if (err) {
            console.log(err);
            return res.status(500).json({error: 'database failure'});
        }
        res.json(comments);
    })
});

router.post('/', function(req, res, next) {
    var comment = new Comment();
    comment.post_id = req.body.post_id;
    comment.content = req.body.content;
    comment.date = new Date();

    comment.save(function(err) {
        if (err) {
            console.log(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    });
});

module.exports = router;

=======
Suggestion 2

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Get comment from file
var getComment = function(){
    var data = fs.readFileSync(path.join(__dirname, 'comment.txt'), 'utf8');
    return data;
};

// Post comment to file
var postComment = function(comment){
    fs.writeFileSync(path.join(__dirname, 'comment.txt'), comment);
};

// Get comment
router.get('/', function(req, res){
    res.send(getComment());
});

// Post comment
router.post('/', urlencodedParser, function(req, res){
    postComment(req.body.comment);
    res.redirect('back');
});

module.exports = router;

=======
Suggestion 3

// Import express module
const express = require("express");

// Import comment controller
const commentController = require("../controllers/comments");

// Create router
const router = express.Router();

// Create route for get comment by id
router.get("/:id", commentController.getCommentById);

// Create route for create comment
router.post("/", commentController.createComment);

// Create route for update comment
router.put("/:id", commentController.updateComment);

// Create route for delete comment
router.delete("/:id", commentController.deleteComment);

// Export router
module.exports = router;

=======
Suggestion 4

var express = require('express');
var router = express.Router();

// Import comment model
var Comment = require('../models/comment');

// Create comment
router.post('/', function(req, res, next) {
    var comment = new Comment({
        username: req.body.username,
        content: req.body.content,
        date: req.body.date
    });

    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.status(201).json(comment);
    });
});

// Get all comments
router.get('/', function(req, res, next) {
    Comment.find(function(err, comments) {
        if (err) {
            return next(err);
        }
        res.json(comments);
    });
});

// Get comments by username
router.get('/:username', function(req, res, next) {
    Comment.find({ username: req.params.username }, function(err, comments) {
        if (err) {
            return next(err);
        }
        res.json(comments);
    });
});

// Get comment by id
router.get('/id/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

// Update comment by id
router.put('/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            return next(err);
        }
        comment.username = req.body.username;
        comment.content = req.body.content;
        comment.date = req.body.date;

        comment.save(function(err, comment) {
            if (err) {
                return next(err);
            }
            res.status(201).json(comment);
        });
    });
});

// Delete comment by id
router.delete('/:id', function(req, res, next) {
    Comment.findByIdAndRemove(req.params.id, function(err, comment) {
        if (err) {
            return next(err);
        }
        res.status(201).json(comment);
    });
});

module.exports = router;

=======
Suggestion 5

// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Create express app
const app = express();

// Import routes
const commentsRoutes = require('./routes/comments');

// Import config
const config = require('./config/config');

// Import database
const db = require('./models');

// Use middleware
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// Use routes
app.use(commentsRoutes);

// Connect to database
db.sequelize.sync().then(() => {
  app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
  });
});

=======
Suggestion 6

var express = require('express');
var router = express.Router();

// Get comment model
var Comment = require('../models/comment');

// Get comment model
var User = require('../models/user');

/*
 * GET comment index
 */
router.get('/', function (req, res) {
    Comment.find(function (err, comments) {
        if (err)
            return console.log(err);

        res.render('comments/index', {
            comments: comments
        });
    });
});

/*
 * GET add comment
 */
router.get('/add', function (req, res) {
    var name = "";
    var email = "";
    var comment = "";

    res.render('comments/add', {
        name: name,
        email: email,
        comment: comment
    });
});

/*
 * POST add comment
 */
router.post('/add', function (req, res) {

    req.checkBody('name', 'Name must have a value').notEmpty();
    req.checkBody('email', 'Email must have a value').notEmpty();
    req.checkBody('comment', 'Comment must have a value').notEmpty();

    // Get errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('comments/add', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment
        });
    } else {
        var comment = new Comment({
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment
        });

        comment.save(function (err) {
            if (err)
                return console.log(err);

            req.flash('success', 'Comment added!');
            res.redirect('/comments');
        });
    }

});

/*
 * GET edit comment
 */
router.get('/edit/:id', function (req, res) {
    Comment.findOne({ _id: req.params.id }, function (err, comment) {
        if (err)
            return console.log(err);

        res.render('comments/edit', {
            name: comment.name,
            email: comment.email,
            comment: comment.comment,
            id: comment._id
        });
    });
});

/*
 * POST edit comment
 */
router.post('/edit/:id', function (req, res) {

    req.checkBody('name', 'Name must have a value').notEmpty();
    req.checkBody('email', 'Email must have a value').notEmpty();
    req.checkBody('comment',

=======
Suggestion 7

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Set up server
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read file
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Get all comments
app.get('/comments', function(req, res) {
  res.json(comments);
});

// Post comment
app.post('/comments', function(req, res) {
  var comment = req.body;
  comments.push(comment);
  fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
    if (err) console.log(err);
  });
  res.json(comments);
});

// Delete comment
app.delete('/comments/:id', function(req, res) {
  var id = req.params.id;
  comments.splice(id, 1);
  fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
    if (err) console.log(err);
  });
  res.json(comments);
});