/*
* @Author: kuychaco
* @Date:   2015-07-20 15:17:09
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-07-24 21:58:20
*/

// Server setup
// -------------
// Set up server, websocket, and node child processes

'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var bodyParser = require('body-parser');
var port = 8888;

http.listen(port, function(){
  console.log('listening on *:'+port);
});

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var childProcess = require('child_process');

io.on('connection', function(socket) {
  console.log('connection open');
  socket.on('train', function(data) {

    var parameters = [{}, {}, {}, {}];
    parameters[0].hiddenLayers = data.hiddenLayers1 === '[]' ? [3] : JSON.parse(data.hiddenLayers1);
    parameters[1].hiddenLayers = data.hiddenLayers2 === '[]' ? [4] : JSON.parse(data.hiddenLayers2);
    parameters[2].hiddenLayers = data.hiddenLayers3 === '[]' ? [5] : JSON.parse(data.hiddenLayers3);
    parameters[3].hiddenLayers = data.hiddenLayers4 === '[]' ? [3,4] : JSON.parse(data.hiddenLayers4);
    parameters[0].learningRate = data.learningRate1 === '' ? 0.3 : parseFloat(data.learningRate1);
    parameters[1].learningRate = data.learningRate2 === '' ? 0.3 : parseFloat(data.learningRate2);
    parameters[2].learningRate = data.learningRate3 === '' ? 0.3 : parseFloat(data.learningRate3);
    parameters[3].learningRate = data.learningRate4 === '' ? 0.3 : parseFloat(data.learningRate4);
    parameters[0].errorThresh = data.errorThresh1 === '' ? 0.005 : parseFloat(data.errorThresh1);
    parameters[1].errorThresh = data.errorThresh2 === '' ? 0.005 : parseFloat(data.errorThresh2);
    parameters[2].errorThresh = data.errorThresh3 === '' ? 0.005 : parseFloat(data.errorThresh3);
    parameters[3].errorThresh = data.errorThresh4 === '' ? 0.005 : parseFloat(data.errorThresh4);

    var children = [];
    parameters.forEach(function(data, i) {
      // Create child process and run code in worker.js
      children[i] = childProcess.fork('./worker.js');
      console.log('forked child', i, 'with PID', children[i].pid);
      children[i].networkNum = i + 1;

      // Send data to child process
      children[i].send(data);

      children[i].on('message', function(result) {
        result.networkNum = this.networkNum;
        // Send trained net to the client
        socket.emit('brain', result);
      });
    });

  });
});
