    // set up ========================
    var express  = require('express');
    var app      = express();
    var mongoose = require('mongoose');

    // configuration
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

    // configuration =================

    
    mongoose.connect('mongodb://gdice:XhEFkeUVoF6j4i1u@todo-shard-00-00-ekauy.mongodb.net:27017,todo-shard-00-01-ekauy.mongodb.net:27017,todo-shard-00-02-ekauy.mongodb.net:27017/test?ssl=true&replicaSet=ToDo-shard-0&authSource=admin&retryWrites=true', 
    { useNewUrlParser: true }, function(err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Server started successfully!")
        }
    });

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users

    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


    // define model =================
    var Todo = mongoose.model('Todo', {
        text : String,
    });
// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular        
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
    // application -------------------------------------------------------------
    app.get('/edit/*', (req, res) => {
        res.sendFile(__dirname + '/public/edit.html'); 
    });
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); 
    });

    // listen (start app with node server.js) ======================================

    var port = process.env.PORT || 8080;

    app.listen(port);
    console.log("App listening on port 8080");