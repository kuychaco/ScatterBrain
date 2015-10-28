/*
* @Author: Katrina Uychaco
* @Date:   2015-07-20 14:50:47
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-07-24 21:20:52
*/

// Train neural net
// -------------
// Worker code for training net inside node child process

'use strict';

var brain = require('brain');

// Process data when passed in
process.on('message', function(data) {

  var net = new brain.NeuralNetwork({
    hiddenLayers: data.hiddenLayers
  });

  // Approximate the XOR function
  var trainingData = [
    {input: [0, 0], output: [0]},
    {input: [0, 1], output: [1]},
    {input: [1, 0], output: [1]},
    {input: [1, 1], output: [0]}
  ];

  var options = {
    callback: function(result) {
      var output = net.run([1, 0]);
      result.output = output;
      process.send(result);
    },
    callbackPeriod: 5,
    errorThresh: data.errorThresh,
    learningRate: data.learningRate
  };

  net.train(trainingData, options);

});
