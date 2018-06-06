var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DriverSchema = new Schema({
    ime: String,
    age: Number,
    sex: String,
    rank: Number,
    number_of_wins: Number,
    drzava: String,
    speed: Number,
    overtaking: Number,
    blocking: Number,
    bad_weather: Number,
    reaction_time: Number,
    concetration: Number,
    patience: Number,
    aggresiveness: Number,
    will: Number,
    intelligence: Number,
    fitness: Number,
    injuries: Number,
    overall: Number
});

module.exports = mongoose.model('driver', DriverSchema);