var express = require('express'); 

var router = express.Router(); //mini aplikacija za delo s progami

//model za shranjevanje proge
var Track=require('../models/track');

// testni vhod v api, da lahko izvajamo testiranje z brskanika na http://localhost/proga/testnoDodajanje
router.get('/testnoDodajanje', function(req, res) {
	//napolnimo shemo s podatki
    var testnaProga = new Track({
		location: 'Kopalnica',
		description: 'Pozor! Spolzka tla.',
		difficulty: 7,
		length: 500,
		laps: 3,
		sections: [{
			direction: 'Left',
			angle: 30,
			elevation: 15,
			length: 5,
			material: 'Wood',
			powerups: [{
				name: 'Battery',
				description: 'Refill your electricity'
			},
			{
				name: 'Trap',
				description: 'Trap your enemies',
				duration: 5
			}],
			obstacles: [{
				name: 'Spoon',
				height: 5,
				width: 5,
				length: 10
				},
				{
				name: 'Fork',
				height: 5,
				width: 5,
				length: 10
			}],
		},
		{
			direction: 'Straight',
			angle: 0,
			elevation: 5,
			length: 15,
			material: 'Stone'
		}]}
    );

   	//shranimo nov objekt v bazo
   	testnaProga.save(function(err,p) {
		if (err){
			res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
		}
		else{
			res.json(p); //ob uspešnem shranjevanju izpišemo celoten objekt
		}
	});
});	

//dodajanje, na vhodu pričakujemo json objekt v obliki proga sheme
router.post('/',function(req,res){
	//v req.body nam body-parser ustvari json objekt
	var p = new Track(req.body);
	p.save(function(err,p) {
		if (err){
			res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
		}
		else{
			res.json(p); //ob uspešnem shranjevanju izpišemo celoten objekt
		}
	});
});

//posodobi progo z idjem
router.put('/:id', function(req,res){
    Track.findByIdAndUpdate({_id: req.params.id}, req.body, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else {
            res.json({msg:"Proga  " + req.params.id + " uspešno posodlbjen!"});
        }
    });
});

//vrni vse proge
router.get('/', function(req, res) {
	//funkcija find brez parametra vrne vse objekte, ki ustrezajo shemi
	Track.find(function(err, p) {
		if (err){
			res.status(500).send({ error: err })
		}
		else{
			res.json(p); //v p imamo array vseh prog
		}
	});
});

//dobi eno progo po idju
router.get('/:id',function(req, res) {
	//findbyid nam vrne točno tisti objekt, ki ima predpisan id
	Track.findById(req.params.id, function(err, p) {
		if (err){
			res.status(500).send({ error: err })
		}
		else{
			res.json(p);
		}
	});
});

//briši progo
router.delete('/:id', function(req,res){   
	//preverimo če proga z idjem obstaja
	Track.findById(req.params.id,function(err, p) {
		if (err) { //splošna napaka
			res.status(500).send({ error: err })
		}
		else if(!p) { //če ne najdemo proge, potem vrnemo napako
			res.status(500).send({ error: "Proga ne obstaja"});
		}
		else{ //če ja, pa jo zbrišemo in vrnemo sporočilo ok	
			p.remove(function(err){
				if (err){
					res.status(500).send({ error: err })
				}
				else {
					res.json({msg:"OK"});
				}
			});
		}
	});
});

//iskanje po imenu
router.get('/ime/:ime',function(req, res) {
	//find kot vhod dobi json, ki predstavlja del sheme, vrne pa vse objekte, ki imajo enak del podatkov
	Track.find({name:req.params.ime}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

//iskanje po lokaciji
router.get('/lokacija/:lokacija',function(req, res) {
	//find kot vhod dobi json, ki predstavlja del sheme, vrne pa vse objekte, ki imajo enak del podatkov
	Track.find({location:req.params.lokacija}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

//iskanje po opisu
router.get('/opis/:opis',function(req, res) {
	//find kot vhod dobi json, ki predstavlja del sheme, vrne pa vse objekte, ki imajo enak del podatkov
	Track.find({description:req.params.opis}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

//uporabljamo lahko tudi operatorje
router.get('/dolzina/daljse/:d',function(req, res) {
	Track.find({length:{$gt:req.params.d}}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

router.get('/dolzina/krajse/:d',function(req, res) {
	Track.find({length:{$lt:req.params.d}}, function(err, p) {
		if (err)
			res.status(500).send({ error: err })
		else
			res.json(p);
	});
});

//več o poizvedbah
//http://mongoosejs.com/docs/queries.html

module.exports=router;
