var express = require('express'); 

var router = express.Router();   //mini aplikacija za delo s progami

var Driver=require('../models/driver');

router.post('/', function(req, res) {
    var voznik = new Driver(req.body);
   	//shranimo nov objekt v bazo
   	voznik.save(function(err,d) {
        if (err)
            res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
        else
            res.json(d); //ob uspešnem shranjevanju izpišemo celoten objekt
	});
 
});	

router.get('/', function(req, res) {
	//funkcija find brez parametra vrne vse objekte, ki ustrezajo shemi
   Driver.find(function(err, d) {
            if (err)
                res.status(500).send({ error: err })
			else
                res.json(d); //v p imamo array vseh prog
    });
});

router.get('/:id',function(req, res) {
	//findbyid nam vrne točno tisti objekt, ki ima predpisan id
    Driver.findById(req.params.id, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.delete('/:id', function(req,res){   
	//preverimo če proga z idjem obstaja
	Driver.findById(req.params.id,function(err, d) {
    if (err) //splošna napaka
        res.status(500).send({ error: err })
	else if(!d) { //če ne najdemo proge, potem vrnemo napako
		res.status(500).send({ error: "Voznik ne obstaja"});
	}
	else{ //če ja, pa jo zbrišemo in vrnemo sporočilo ok	
		d.remove(function(err){	
			if (err)
				res.status(500).send({ error: err })
			else {
				res.json({msg:"Voznik " + req.params.id + " uspešno izbrisan!"});
			}
		});
	}
	});
});

router.put('/:id', function(req,res){
    Driver.findByIdAndUpdate({_id: req.params.id}, req.body, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else {
            res.json({msg:"Voznik " + req.params.id + " uspešno posodlbjen!"});
        }
    });
});

router.get('/ime/:ime',function(req, res) {
	//find kot vhod dobi json, ki predstavlja del sheme, vrne pa vse objekte, ki imajo enak del podatkov
    Driver.find({ime:req.params.ime}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

//uporabljamo lahko tudi operatorje
router.get('/zmage/vec_kot/:st_zmag',function(req, res) {
    Driver.find({number_of_wins:{$gt:req.params.st_zmag}}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.get('/zmage/manj_kot/:st_zmag',function(req, res) {
    Driver.find({number_of_wins:{$lt:req.params.st_zmag}}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.get('/zmage/:st_zmag',function(req, res) {
    Driver.find({number_of_wins:req.params.st_zmag}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.get('/overall/vec_kot/:st',function(req, res) {
    Driver.find({overall:{$gt:req.params.st}}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.get('/overall/manj_kot/:st',function(req, res) {
    Driver.find({overall:{$lt:req.params.st}}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});

router.get('/drzava/:ime',function(req, res) {
    Driver.find({drzava:req.params.ime}, function(err, d) {
        if (err)
            res.status(500).send({ error: err })
        else
            res.json(d);
    });
});


module.exports=router;