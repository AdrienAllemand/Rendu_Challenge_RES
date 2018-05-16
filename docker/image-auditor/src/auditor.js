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
    console.log("(" + json.uuid + ") " + json.play );

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
  console.log("Joining multicast group");
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
    console.log("New socket oppened")

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

    socket.write(JSON.stringify(musicians_array) + "\r\n");
    socket.pipe(socket);
    socket.end();
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 2205
server.listen(2205);


