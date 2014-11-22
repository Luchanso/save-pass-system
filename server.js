var hash = require('sha256');
var express = require('express'); 
var io = require('socket.io').listen(9900);

var app = express();

var secretKeyWord = 'omk6tqawvubz8jtr370748xy5nfyum';
var data = new Date().toLocaleDateString();
var hashServer = hash(secretKeyWord + data);

var baseDate = {
	users: [
		{
			login: 'test',
			password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
		}
	]
};

baseDate.getUserPass = function(login) {
	for (var i = 0; i < this.users.length; i++) {
		var user = this.users[i];
		if (user.login == login)
			return user.password;
	};
}

app.get('/', function(req, res) {	
	res.sendFile(__dirname + '/client.html');
});
app.listen(9901);

io.sockets.on('connection', function (socket) {	
	socket.json.send({data: hashServer, mtype: 'hashServer'});
	socket.on('message', function (data) {
		var pass = baseDate.getUserPass(data.login);
		var tempHash = hash(pass + hashServer);
		
		if (tempHash === data.password)
			socket.json.send({data: true, mtype: 'auth'});
		else
			socket.json.send({data: false, mtype: 'auth'});
	});
});