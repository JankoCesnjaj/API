//shema za objekt proga
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackSchema   = new Schema({
	location: String,
	description: String,
	difficulty: Number,
	length: Number,
	laps: Number,
	sections: [{	
		direction:{
			type: String,
			enum: ['Left', 'Right', 'Straight']
		},
		angle: Number,
		elevation: Number,
		length: Number,
		material: String,
		powerups: [{
		    name: String,
			description: String,
			duration: Number
		}],
		obstacles: [{
			name: String,
			height: Number,
			width: Number,
			length: Number
		}]
	}]
});

module.exports = mongoose.model('track', TrackSchema);