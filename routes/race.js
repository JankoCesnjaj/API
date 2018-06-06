var express = require('express'); 

var router = express.Router(); //mini aplikacija za delo s progami

//model za shranjevanje proge
var Race=require('../models/race.js');
var Track=require('../models/track.js');
var Driver=require('../models/driver.js');
var Vehicle=require('../models/vehicle.js');

// testni vhod v api, da lahko izvajamo testiranje z brskanika na http://localhost/proga/testnoDodajanje
router.get('/testnoDodajanje', function(req, res) {
	//napolnimo shemo s podatki
	var PROGA = new Track({
		name: 'Testna proga',
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
		}]
	});
    var testnaSimulacija = new Race(
		{
		sections: [{
			driver: "Štef",
			time: 420,
			position: 3	
		},
		{
			driver: "Joža",
			time: 330,
			position: 2
		},
		{
			driver: "Matevž",
			time: 125,
			position: 1
		}],
		track: PROGA
	});

   	//shranimo nov objekt v bazo
   	testnaSimulacija.save(function(err,p) {
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
	var r = new Race(req.body);
	p.save(function(err,p) {
		if (err){
			res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
		}
		else{
			res.json(p); //ob uspešnem shranjevanju izpišemo celoten objekt
		}
	});
});

router.get('/simulate', function(req, res){
	var customID = "5b0f1cc53316e51f0c1fee49"; //tu bomo spreminjali
	var _track;
	var _drivers;
	var _vehicles;

	Track.findOne({_id: customID}, function(err, t){
		if (err){
			res.status(500).send({ error: err })
		}
		else{
			_track = t;
			Driver.find(function(err, d) {
				if (err){
					res.status(500).send({ error: err })
				}
				else{
					_drivers = d;
					Vehicle.find(function(err, v) {
						if (err){
							res.status(500).send({ error: err })
						}
						else{
							_vehicles = v;
							//res.json(track);
							var casi = [];
							//PROGA
							//kot odseka - dlje časa
							//elevation - počasneje, več bencina
							//length - skalira čas
							//vpliv materiala - wood manjši vpliv npr.
							//powerup obstacle none ker je lahka proga
							//VOZNIK
							//upoštevamo samo overall (zračunan iz ostalih lastnosti v generatorju)
							//VOZILO
							//battery left - na začetku največ, skozi vsak odsek manj (manj je -> večji čas)
							//acceleration in topSpeed skupaj upoštevaj da dobiš čas za prevoz odseka
							//weight - večji weight manj točk - počasnejši
							//engine horsepower - več točk

							//overtking verjetnost - zamenjaj pozicijo z enim pred njim
							var st_odsekov = 8; //beri iz baze
							for(j = 0; j < st_odsekov; j++){ //gre skozi odseke 
								casi[j] = [];
								for(i = 0; i < 5; i++){ //gre skozi igralce
									var imeVoznika = _drivers[i]['name'];
									var ocenaVoznika;
									var ocenaVozila;
									var skupnaOcena;
									var overall = _drivers[i]['overall']; //overall voznika
					
									var material = _track['sections'][j]['material'];
									var elevation = _track['sections'][j]['elevation'];
									var faktorMateriala; //večji kot je faktor materiala, dlje rabi voznik da prevozi odsek
									if(material == "Stone"){
										faktorMateriala = 1.0; //najmanj spolzko
									}
									else if(material == "Wood"){
										faktorMateriala = 0.8; //srednje spolzko
									}
									else if(material == "Glass"){ 
										faktorMateriala = 0.6; //najbolj spolzko
									}
					
									//random - lahko se zgodi da pobere battery powerup -> + bencin
									var moznostPowerupa;
									var tezavnostProge = _track['difficulty']; //integer od 1 do 10
									if (tezavnostProge <= 3) { //najlažja proga
										moznostPowerupa = 0.6;
									}
									if (tezavnostProge > 3 && tezavnostProge <= 6) { //srednjetežka proga
										moznostPowerupa = 0.3;
									}
									if (tezavnostProge > 6) { //težka proga
										moznostPowerupa = 0.1;
									}
									//VERJETNOST ZA POWERUP BATTERY
									var batteryLeft = _vehicles[i]['batteryLeft'];
									if(Math.random() < moznostPowerupa){ //če bo random št. med 0 in 1 v območju moznostPowerup
										batteryLeft += 5; //bencin
									}
									batteryLeft -= elevation; //večji naklon odseka povzroči večjo porabo goriva
					
									var pospesek = _vehicles[i]['acceleration'];
									var najvecjaHitrost = _vehicles[i]['topSpeed'];
									var teza = _vehicles[i]['weight'];
									var motorKonji = _vehicles[i]['engine']['horsePower'];      
									var dolzinaOdseka = _track['sections'][j]['length'];
									var kot = _track['sections'][j]['angle'];
									var faktorKota = kot / 90; //90 najvecji ovinek
								  
									var overtaking = _drivers[i]['overtaking'] / 100;
					
								   // var casVoznika = skupnaOcena / casOdseka;
									var hitrostModifier = faktorMateriala * faktorKota * (pospesek/10  * motorKonji/100 * overall/100);
									var casVoznika = dolzinaOdseka / (najvecjaHitrost * hitrostModifier);
									//console.log("Čas: " + imeVoznika + ": " + casVoznika);
									//console.log("Hitrost " + imeVoznika + ": " + (najvecjaHitrost * hitrostModifier));
									casi[j][i] = casVoznika;
									if(Math.random() > overtaking){ //je prehitel nekoga
										casi[j][i] -= (dolzinaOdseka/najvecjaHitrost)/2;
										//console.log("Čas after: " + casi[j][i]);
									}
									//console.log(" ");
								}
								var min = 99999999;
								var min_idx = 0;
								for(c=0; c < 5; c++){
									if(casi[j][c] < min){
										min = casi[j][c];
										min_idx = c;
									}
								}
								casi[j][5] = _drivers[min_idx]["name"];
							}

							var casi_sum = [];
							for(i = 0; i < 5; i++){
								casi_sum[i] = 0;
								for(j = 0; j < 8; j++){
									casi_sum[i] += casi[j][i];
								}
							}
					
							// let swap;
							// do {
							// 	swap = false;
							// 	for (let i = 1; i < casi_sum.length; ++i) {
							// 		if (casi_sum[i - 1] > casi_sum[i]) {
							// 			[casi_sum[i], casi_sum[i - 1]] = [casi_sum[i - 1], casi_sum[i]];
							// 			[drivers[i], drivers[i - 1]] = [drivers[i - 1], drivers[i]];
							// 			swap = true;
							// 		}
							// 	}
							// } while (swap)
					
							// for(i = 0; i < 5; i++){
							// 	$("#res").append(drivers[i]["name"] + " " + casi_sum[i] + " - overall: " + drivers[i]["overall"] +"<br>");
							// }

							var newRace = new Race(
								{
								sections: casi,
								track: _track,
								drivers: _drivers,
								vehicles: _vehicles
							});
							res.json(casi);

							newRace.save(function(err,p) {
								if (err){
									res.status(500).send({ error: err }) //ob napaki vrnemo error 500 in opis napake
								}
								else{
									res.json(p); //ob uspešnem shranjevanju izpišemo celoten objekt
								}
							});
						}
					});
				}
			});
		}
	});
});

//vrni vse simulacije dirk
router.get('/', function(req, res) {
	//funkcija find brez parametra vrne vse objekte, ki ustrezajo shemi
   Race.find(function(err, p) {
		if (err){
			res.status(500).send({ error: err })
		}
		else{
			res.json(p); //v p imamo array vseh prog
		}
	});
});

module.exports=router;