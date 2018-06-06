//shema za objekt proga
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var t = require('./track.js');
var TrackSchema = mongoose.model('track').schema;
var d = require('./driver.js');
var DriverSchema = mongoose.model('driver').schema;
var v = require('./vehicle.js');
var VehicleSchema = mongoose.model('vehicle').schema;

var RaceSchema = new Schema({
    sections: [{
        times: [{
			time: Number
		}]
    }],
    track: TrackSchema,
    drivers: [DriverSchema],
    vehicles: [VehicleSchema]
});

module.exports = mongoose.model('race', RaceSchema);