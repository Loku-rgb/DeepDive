const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

// connect to mongodb, username = deepdive_user, password = db@deepdive2707@)@) --> converted to Percent-encoding here
let url = 'mongodb://deepdive_user:db%40deepdive2707%40%29%40%29@178.128.19.154:27017/deepdive_library';

mongoose.Promise = global.Promise;

mongoose.connect(url, {useMongoClient:true}, function(err){ if(err) console.log(err) });

setTimeout(() => {
    // ready states being: 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    switch(mongoose.connection.readyState){
        case 0 : {console.log(".Disconnected from db") ; break;}
        case 1 : {console.log("Connected to db") ; break;}
        case 2 : {console.log("Connecting to db") ; break;}
        case 3 : {console.log("Disconnecting to db") ; break;}
        default : console.log("mongoose.connection.readyState : ",mongoose.connection.readyState)
    }
}, 2000)


// const _database = url;
// mongoose.connect(_database, {
//     useNewUrlParser: true
// })
// .then(() => console.log('Connected to MongoDB ...'))
// .catch(err => console.error('Could not connect to MongoDB:‌', err));


//set up static files
// app.use(express.static('public'));

// use body-parser middleware
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// initialize routes
app.use('/api', require('./routes/api'));

// error handling middleware
app.use(function(err, req, res, next){
    console.log("err : ",err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
    console.log('Now Server listening for requests at port ',PORT);
});
