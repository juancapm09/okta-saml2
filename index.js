var express = require('express');
var connect = require('connect');
var auth = require('./auth');
var app = express();
var path = require('path');

app.configure(function() {
    app.use(express.logger());
    app.use(connect.compress());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: "roomapplication session" }));
    app.use(auth.initialize());
    app.use(auth.session());
});

//Get Methods
app.get('/', auth.protected, function(req, res) {
    console.log('/ROOT');
    res.sendfile('index.html');
});

app.get('/home', auth.protected, function(req, res) {
    console.log('/HOME');
    res.sendfile('index.html');
});

//auth.authenticate check if you are logged in
app.get('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    console.log('/LOGIN');
    res.redirect('/');
});

//POST Methods, redirect to home successful login
app.post('/login/callback', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    console.log('/LOGIN/CALLBACK');
    res.redirect('http://localhost:7070');
});

//code for importing static files
app.use(express.static(path.join(__dirname, 'public')));
var currentPort = app.listen(process.env.PORT || 3000);
console.log("Server started at PORT " + currentPort);