const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// Chargement de la page index.html
/* app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
}); */

io.sockets.on('connection', function (socket, pseudo) {
    console.log("Connected !");
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        console.log("pseudo : ",pseudo);
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        console.log("message : ",message);
        message = ent.encode(message);
        console.log({pseudo: socket.pseudo, message: message});
        socket.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(3000);