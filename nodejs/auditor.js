var protocol = require("./musician-protocole");     // notre protocole
var dgram = require("dgram");                       // pour UDP
var net = require('net');                           // pour TCP

var dico = new Map();       // stock les musiciens actifs
/*
function checkCallback(musician){
    if(dico.has(musician.uuid)){
        if(Date.now() - dico.get(musician) > 5000){
            dico.delete(musician);
            console.log("No news from musician: " + uuid);
        }
    }
}
*/

function processMSG(msg){

    // réception du message
    json = JSON.parse(msg);
    //console.log("(" + json.uuid + ") " + json.play );

    switch(json.play){
        case protocol.PROTOCOL_PIANO_SOUND:
            var instru = "piano";
            break;
        case protocol.PROTOCOL_TRUMPET_SOUND:
            var instru = "trumpet";
            break;
        case protocol.PROTOCOL_FLUTE_SOUND:
            var instru = "flute";
            break;
        case protocol.PROTOCOL_VIOLIN_SOUND:
            var instru = "violin";
            break;
        case protocol.PROTOCOL_DRUM_SOUND:
            var instru = "drum";
            break;
        default:
            var instru = "Fake Musician";
    }

    if(!dico.has(json.uuid)){
        dico.set(json.uuid, 
            {
                uuid: json.uuid,
                instrument: instru,
                activeSince: Date.now(),
                lastSeen: Date.now()
            })
    } else {
        var musician = dico.get(json.uuid);
        musician.lastSeen = Date.now();
    }

    // wait 5 sec, wrap dans une fonction anonyme pourle callback qui ne supporte pas d'arguments de base
    // setTimeout(function(){checkCallback(musician.uuid);},5001);
}

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
var s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
  //console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// appelée sur chaque message recu depuis un broadcast
s.on('message', function(msg, source) {
    processMSG(msg);
});

/* PARTIE POUR SE CONNECTER EN TCP */
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
    //console.log("New socket oppened")

    var musicians_array = []
    //cleaning dico
    for (var key of dico.keys()) {
        if(Date.now() - dico.get(key).lastSeen > 5000){
            dico.delete(key);
        } else {
            musicians_array.push(
                {
                    uuid: dico.get(key).uuid,
                    instrument: dico.get(key).instrument,
                    activeSince: new Date(dico.get(key).activeSince)
                }
            );
        }
    }

    socket.write(JSON.stringify(musicians_array));

    socket.end()
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 2205
server.listen(2205);


/* POUR LA MAP

var myMap = new Map();

var keyString = 'a string',
    keyObj = {},
    keyFunc = function() {};

// setting the values
myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj, 'value associated with keyObj');
myMap.set(keyFunc, 'value associated with keyFunc');

myMap.size; // 3

// getting the values
myMap.get(keyString);    // "value associated with 'a string'"
myMap.get(keyObj);       // "value associated with keyObj"
myMap.get(keyFunc);      // "value associated with keyFunc"

myMap.get('a string');   // "value associated with 'a string'"
                         // because keyString === 'a string'
myMap.get({});           // undefined, because keyObj !== {}
myMap.get(function() {}) // undefined, because keyFunc !== function () {}
*/

//------------------------------------

/*
var net = require('net');

musicians = [];

// We use a standard Node.js module to work with UDP
var dgram = require('dgram');
// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
var s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Sourceport: " + source.port);
});

var auditor = Auditor();

var net = require('net');

var server = net.createServer(function(socket) {
	socket.write()
    socket.on('error', function(err) {
        console.log(err)
    })
});

server.listen(2205, '127.0.0.1');

*/