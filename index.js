var express = require('express');
const fs = require('fs');
var path = require('path');

var app = express();
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/get_abi', function(req, res) {
    const data = fs.readFileSync(
        "./artifacts/contracts/Captain.sol/Captain.json", 'utf-8');
    const abi = JSON.stringify(JSON.parse(data)['abi'])
    res.send(abi);
});

app.listen(3000);
