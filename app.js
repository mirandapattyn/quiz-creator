var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://miranda:miranda@cluster0-0p1uq.mongodb.net/test?retryWrites=true";

MongoClient.connect(uri, (err, client) => {
    const collection = client.db("quizDB").collection("questions");

    let express = require('express'),
        path = require('path'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        crypto = require('crypto');

    let app = express();

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static('static'));
    app.use(bodyParser.json());

    app.use("/scripts", express.static(__dirname + "/scripts"));
    app.use("/styles", express.static(__dirname + "/styles"));

    app.get('/admin', (req, res) => {
        res.render('admin');
    });

    app.get('/', (req, res) => {
        res.render('user');
    });

    app.post('/store_quiz', (req, res) => {
        collection.deleteMany({}, function(err, obj) {
            if (err) throw err;
        });

        data = JSON.parse(req.body.data);
        collection.insertOne(data, function(err, res) {
            if (err) throw err;
        });
    });

    app.post('/retrieve_quiz', (req, res) => {
        collection.find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

    mongoose.Promise = global.Promise;

    var userSchema = new mongoose.Schema({
        userName: {
          type: String,
          unique: true,
          required: true
        },
        hash: String,
        salt: String
    });

    userSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    };

    let User = mongoose.model("User", userSchema);
    module.exports = User;  

    app.listen(8081);
});