var protocol = require('./musician-protocole');
// npm pour les uuid
const uuidv4 = require('uuid/v4');
// We use a standard Node.js module to work with UDP
var dgram = require('dgram');

// on établit le son de l'instrument
switch(process.argv[2]){
    case "piano":
    var sound = protocol.PROTOCOL_PIANO_SOUND;
        break;
    case "trumpet":
    var sound = protocol.PROTOCOL_TRUMPET_SOUND;
        break;
    case "flute":
    var sound = protocol.PROTOCOL_FLUTE_SOUND;
        break;
    case "violin":
    var sound = protocol.PROTOCOL_VIOLIN_SOUND;
        break;
    case "drum":
    var sound = protocol.PROTOCOL_DRUM_SOUND;
        break;
    default:
    var sound = "I assure you I am not a musician in any way !";
}

var musicien = {
    play: sound,
    uuid: uuidv4()
}

//console.log("new Musician (" + musicien.uuid + ") " + musicien.play)

// Let's create a datagram socket. We will use it to send our UDP datagrams
var socket = dgram.createSocket('udp4');
// on set la socket en broadcast comme dans les slides
socket.bind(0, '', function() {
	socket.setBroadcast(true);	
});

var package = JSON.stringify(musicien);
// Transforme le payload en buffer pour l'envoit
message = new Buffer(package);

// cette ligne va répéter la ligne de broadcast 
var intervalID = setInterval(
    function(){
        //console.log("Broadcasting : " + musicien.play)
        // cette ligne envoie le payload toute les secondes
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function(err, bytes) {
                //console.log("Sending payload: " + package + " via port " + socket.address().port);
            });

    }, 1000);

/* Exemple du prof dans les slides 
// We use a standard Node.js module to work with UDP
var dgram = require('dgram');
// Let's create a datagram socket. We will use it to send our UDP datagrams
var s = dgram.createSocket('udp4');
// Create a measure object and serialize it to JSON
var measure = new Object();
measure.timestamp = Date.now();
measure.location = that.location;
measure.temperature = that.temperature;
var payload = JSON.stringify(measure);
// Send the payload via UDP (multicast)
message = new Buffer(payload);
s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
function(err, bytes) {
console.log("Sending payload: " + payload + " via port " + s.address().port);
});
*/


//--------------------------------------------


/* Exemple du prof dans les lectures 
var dgram = require('dgram');
var s = dgram.createSocket('udp4');

s.bind(0, '', function() {
	s.setBroadcast(true);	
});

var payload = "Node.js rocks, everybody should know!";
message = new Buffer(payload);	

s.send(message, 0, message.length, 4411, "255.255.255.255", function(err, bytes) {
  console.log("Sending ad: " + payload + " via port " + s.address().port);
});
*/