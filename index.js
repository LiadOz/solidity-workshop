var express = require('express');
const fs = require('fs');
var path = require('path');

var app = express();
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/add_puzzle', function(req, res){
    res.sendFile(path.join(__dirname + '/public/add_puzzle_3.html'));
});

app.get('/solver_view', function(req, res){
    res.sendFile(path.join(__dirname + '/public/solver_view_2.html'));
});

app.get('/view_puzzles', function(req, res){
    res.sendFile(path.join(__dirname + '/public/view_puzzles.html'));
});


app.get('/get_abi', function(req, res) {
    const data = fs.readFileSync(
        "./artifacts/contracts/TagMe.sol/TagMe.json", 'utf-8');
    const abi = JSON.stringify(JSON.parse(data)['abi'])
    res.send(abi);
});

app.listen(3000);