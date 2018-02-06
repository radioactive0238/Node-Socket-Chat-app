var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var path=require('path');
var server=require('http').Server(app);
var io=require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', (process.env.PORT || 3000))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var usernames=[];

//Whenever someone connects this gets executed

io.on('connection', function(socket){

	socket.emit('list',usernames);

	socket.on('adduser', function(username){
		socket.username = username;
		usernames.push(username);
		socket.broadcast.emit('userAdd',username,usernames);
	});


	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', msg , socket.username);
	});

	//Whenever someone disconnects this piece of code executed
	socket.on('disconnect', function () {
		usernames.splice(usernames.indexOf(socket.username),1);
		socket.broadcast.emit('userSub',socket.username,usernames);
	});
});

server.listen(app.get('port'),function(req,res){
	console.log("Server started on port "+app.get('port')+'!');
});
