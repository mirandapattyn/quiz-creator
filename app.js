var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://miranda:miranda@cluster0-0p1uq.mongodb.net/test?retryWrites=true";

MongoClient.connect(uri, (err, client) => {
    const questions = client.db("quizDB").collection("questions");
    const users = client.db("quizDB").collection("users");

    let express = require('express'),
        path = require('path'),
        bodyParser = require('body-parser');

    let app = express();

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static('static'));
    app.use(bodyParser.json());

    app.use("/scripts", express.static(__dirname + "/scripts"));
    app.use("/styles", express.static(__dirname + "/styles"));

    app.get('/admin', (req, res) => {
        res.render('admin');
    });

    app.get('/user', (req, res) => {
        res.render('user');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.post('/store_user', (req, res) => {
        data = JSON.parse(req.body.data);
        users.insertOne(data, (err, res) => {
            if (err) throw err;
        });
    });

    app.post('/check_username', (req, res) => {
        data = JSON.parse(req.body.data);
        users.findOne({username: data.username}, (err, result) => {
            if (err) throw err;
                res.send(result);
        });
    }); 

    app.post('/check_login', (req, res) => {
        data = JSON.parse(req.body.data);
        users.findOne({type: data.type, username: data.username, password: data.password}, (err, result) => {
            if (err) throw err;
                res.send(result);
        });
    }); 

    app.post('/store_quiz', (req, res) => {
        data = JSON.parse(req.body.data);
        questions.update({title: data.title}, data, {upsert: true}, (err, res) => {
            if (err) throw err;
        });
    });

    app.post('/delete_quiz', (req, res) => {
        data = JSON.parse(req.body.data);
        questions.deleteOne({title: data.title}, (err, res) => {
            if (err) throw err;
        });
    }); 

    app.post('/retrieve_quiz', (req, res) => {
        questions.find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }); 

    app.post('/retrieve_titles', (req, res) => {
        questions.find({}, {title: 1, user: 1}).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

    app.listen(8081);
});