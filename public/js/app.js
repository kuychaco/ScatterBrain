/*
* @Author: Katrina Uychaco
* @Date:   2015-07-21 16:54:34
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-07-24 21:58:12
*/

// Visualize and train nets
// -------------
// On form submission visualize nets and emit "train" event
// On "brain" event, update D3 graph

'use strict';

// EventEmitter-like object
var socket = io();

socket.on('connect', function() {
  console.log('connection!');
});

// On form submission visualize and train neural networks
$(document).ready(function() {
  $('form').submit(function(e) {

    e.preventDefault();

    $('svg g').empty();

    var formData = {
      'hiddenLayers1': '[' + $('#hiddenLayers1').val() + ']',
      'hiddenLayers2': '[' + $('#hiddenLayers2').val() + ']',
      'hiddenLayers3': '[' + $('#hiddenLayers3').val() + ']',
      'hiddenLayers4': '[' + $('#hiddenLayers4').val() + ']',
      'learningRate1': $('#learningRate1').val(),
      'learningRate2': $('#learningRate2').val(),
      'learningRate3': $('#learningRate3').val(),
      'learningRate4': $('#learningRate4').val(),
      'errorThresh1': $('#errorThresh1').val(),
      'errorThresh2': $('#errorThresh2').val(),
      'errorThresh3': $('#errorThresh3').val(),
      'errorThresh4': $('#errorThresh4').val()
    };

    // Render neural network architecture
    for (var i=1; i<=4; i++) {

      // Render nodes
      var nodePositions = calculateNodePositions(i);
      // flatten nodePositions array
      var flattenedNodePositions = nodePositions.reduce(function(result, layer) {
        return result.concat(layer);
      }, []);

      // Render links
      var links = generateLinkObjects(nodePositions);

      visualize(i, flattenedNodePositions, links);

    }

    socket.emit('train', formData);
    $('#hiddenLayers').val('');

  });

});

// For neural nets pushed to client, update visualization weights and results
socket.on('brain', function(result) {
  // Update paths between nodes when new weights are provided
  var weights = flattenBrainWeights(result.brain);
  update(result, weights);
});
