// dodamo knjižnico express
var express = require('express')
//ustvarimo aplikacijo z ogrodjem expres
var app = express();         // naša aplikacija

//dodamo parser podatkov, ki so poslani na strežnik
//ti so nato dosegljvi preko req.body v callback funkcijah zahtevi
var bodyParser = require('body-parser');

//vključimo mongoose za delo s podatkovno bazo 
var mongoose=require("mongoose");


//app.use(function()) se vedno izvede pri vsaki zahtevi
app.use(bodyParser.json()); // knjižnica, ki nam razparsa json na vhodu
app.use(bodyParser.urlencoded({ extended: true })); // knjižnica, ki nam razparsa navadni url encoding

//povežemo se na mongodb bazo
//myapp je ime podatkovne zbirke, v kateri želimo imeti podatke in je lahko poljuben
mongoose.connect("mongodb://localhost:27017/miniracing")
//model callbackov je nastavljen na standardni ES6 model, da se izognemo opozorilom
mongoose.Promise = global.Promise;

//statično gostovanje datotek, za lažje testiranje
app.use(express.static('public')); 

var session = require('express-session');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.get('/', function (req, res) {
  res.send('Test!')
})

//testna zahteva
app.get('/test', function (req, res) {
  res.send('Test!')
})

var user=require('./routes/user.js');
app.use('/user', user);

var track=require('./routes/track.js');
app.use('/track', track);

var driver=require('./routes/driver.js');
app.use('/driver', driver);

var vehicle=require('./routes/vehicle.js');
app.use('/vehicle', vehicle);

var race=require('./routes/race.js');
app.use('/race', race);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})