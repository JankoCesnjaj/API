var express = require('express'); 

var router = express.Router();

var Vehicle = require('../models/vehicle');

router.get('/testnoDodajanje', function(req, res) {

	//napolnimo shemo s podatki
    var testnoVozilo = new Vehicle({
		manafacturer: 'Tesla',
		color: 'Blue',
		driveWheel: 'Front',
		chargeTime: 1.5,
		batteryLeft: 100,
		acceleration: 3.8,
		topSpeed: 180,
		weight: 1400,
		engine: {
			batteryConsumption: 5,
			horsePower: 120
		}
	});

   	//shranimo nov objekt v bazo
   	testnoVozilo.save(function(err,p) {
		if (err){
			res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
		}
		else{
			res.json(p); //ob uspešnem shranjevanju izpišemo celoten objekt
		}
	});
});

// Dodaj vozilo
router.post('/',function(req,res){
	var p = new Vehicle(req.body);
	p.save(function(err,p) {
	if (err)
		res.status(500).send({ error: err }) 
	else
		res.json(p); 
	});
});

// GET vozila
router.get('/', function(req, res) {
   Vehicle.find(function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
		res.json(p);
	});
});

// GET vozilo po id
router.get('/:_id',function(req, res) {
	Vehicle.findById(req.params._id, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

// Brisanje vozila po id
router.delete('/:_id', function(req,res){   
	Vehicle.findById(req.params._id,function(err, p) {
    if (err) 
        res.status(500).send({ error: err })
	else if(!p) { 
		res.status(500).send({ error: "Vozilo ne obstaja"});
	}
	else{ 
		p.remove(function(err){
			
			if (err)
				res.status(500).send({ error: err })
			else {
				res.json({msg:"Izbrisano"});
			}
		});
	}
	});
});


// Iskanje po izdelovalcu vozila
router.get('/manufacturer/:ime',function(req, res) {
	Vehicle.find({manufacturer:req.params.ime}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

// Iskanje po hp
router.get('/weight/tezje/:d',function(req, res) {
	Vehicle.find({weight:{$gt:req.params.d}}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

router.get('/weight/lazje/:d',function(req, res) {
	Vehicle.find({weight:{$lt:req.params.d}}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

router.get('/pogon/:pogon',function(req, res) {
	Vehicle.find({driveWheel:req.params.pogon}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

//več o poizvedbah
//http://mongoosejs.com/docs/queries.html

module.exports = router;
