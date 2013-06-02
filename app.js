
// module dependencies.
var express   = require('express');
var path      = require('path');
var socketio  = require('socket.io');
var routes    = require('./routes');
var login     = require('./routes/login');
var logout    = require('./routes/logout');
var tictactoe = require('./routes/tictactoe');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

function restrict(req, res, next) {
	if (req.cookies.player) {
        next();
	} else {
        res.redirect('/login');
	}
}

app.get('/', routes.index);
app.get('/home', routes.index);
app.all('/login', login.index);
app.get('/logout', logout.index);
app.get('/tictactoe', restrict, tictactoe.index);

var io = socketio.listen(app.listen(app.get('port'), function() {
    console.log('Express and socket.io server listening on port ' + app.get('port'));
}));

// socket handling
var players = {};
io.sockets.on('connection', function (client) {
    client.on('enter', function(player) {
	    players[client.id] = player;
	    io.sockets.emit('system', '<strong>' + player + '</strong> has joined');
	    io.sockets.emit('updateplayers', players);
    });
    
    client.on('chat', function(input) {
        io.sockets.emit('chat', {player: players[client.id], message: input});
    });
    
    client.on('newgame', function(opponentId) {
        io.sockets.emit('system', 'New game: <strong>' + players[client.id] + '</strong> vs. <strong>' + players[opponentId] + '</strong>');
        client.emit('newgame', true);
        client.broadcast.emit('newgame', false); // TODO nur an Gegner schicken, nicht broadcasten
    });  

    client.on('clicked', function (coords) {
        client.broadcast.emit('move', coords);
    });

    client.on('disconnect', function() {
        io.sockets.emit('system', '<strong>' + players[client.id] + '</strong> left');
        delete players[client.id];
	    io.sockets.emit('updateplayers', players);
    });
});
