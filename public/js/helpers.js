// Options to control display of networks
var displayOptions = {
  width: 960,
  height: 640,
  verticalOffset: 160,
  margin: 50
};

// Calculate x,y coordinates of nodes in each network
var calculateNodePositions = function(networkNum) {
  // Parse the values in the input forms to get the array of nodes for each network
  // Add elements for nodes in input layer and output layer
  var networkNodeList = [2].concat($('#hiddenLayers'+networkNum).val().split(',').map(Number),[0]);


  // If no input was provided default to a single hidden layer of 10 nodes
  // networkNodeList[1] = networkNodeList[1] === 0 ? 5 : networkNodeList[1];
  if (networkNodeList[1] === 0) {
    switch (networkNum) {
      case 1: networkNodeList.splice(1,1,3); break;
      case 2: networkNodeList.splice(1,1,4); break;
      case 3: networkNodeList.splice(1,1,5); break;
      case 4: networkNodeList.splice(1,1,3,4); break;
    }
  }

  // Add one to each layer to account for bias nodes
  networkNodeList = networkNodeList.map(function(elem){
    return elem + 1;
  });

  var separation = ((displayOptions.width/4) - (2 * displayOptions.margin)) / (networkNodeList.length-1);

  // Calculate the x-coordinates for each layer in network 1
  var networkXCoordinates = [];

  networkNodeList.forEach(function(elem, index) {
    var xCoordinate = Math.round((index * separation) + displayOptions.margin);
    networkXCoordinates.push(xCoordinate);
  });


  // Calculate the y-coordinates for each layer in network 1
  var networkYCoordinates = [];

  networkNodeList.forEach(function(elem, index) {
    // Each element represents a layer
    // For each layer use the number of nodes in the layer to determine the separation between each node
    var separation = (displayOptions.height / (elem + 1));

    // Generate the y-coordinate for each node in the layer
    var layerYCoordinates = [];
    for(var i = 1; i <= elem; i++) {
      var yCoordinate = Math.round(i * separation);
      layerYCoordinates.push(yCoordinate);
    }

    networkYCoordinates.push(layerYCoordinates);
  });


  // Create a 2D array of coordinates for each node in the network
  return generateNodeCoordinates(networkXCoordinates, networkYCoordinates);

};

// Given arrays for the x-coordinates and y-coordinates of all of the nodes in a network
// Generate a 2D array of coordinates for each node
var generateNodeCoordinates = function(xCoordinates, yCoordinates) {
  return yCoordinates.map(function(layer, layerNum) {
    return layer.map(function(yLoc, index) {
      var bias = index===0 && layerNum !== yCoordinates.length-1 ? true : false;
      return { x: xCoordinates[layerNum], y: yLoc, bias: bias };
    });
  });
};

// Given node positions, generate link objects with source and target nodes
var generateLinkObjects = function(nodePositions) {
  return nodePositions.reduce(function(result, layer, index) {
    // Since we are refering to nodes in the next layer of the network we want to stop
    // at one layer before the output layer
    if (index < (nodePositions.length - 1)) {
      return result.concat(layer.reduce(function(sourceResult, sourceNode) {
        return sourceResult.concat(nodePositions[index+1].reduce(function(targetResult, targetNode, targetIndex) {
          if (index < nodePositions.length-2 && targetIndex === 0) {
            return targetResult;
          }
          targetResult.push({ source: sourceNode, target: targetNode });
          return targetResult;
        }, []));

      }, []));
    } else {
      return result;
    }
  }, []);
};

// Parse brain object into flat array format for d3 data binding
var flattenBrainWeights = function(brain) {

  var weights = [];

  // Layers are objects with numeric projerty names
  // iterate through source layers
  for (var sourceLayerNum=0; sourceLayerNum<brain.layers.length-1; sourceLayerNum++) {

    var sourceLayer = brain.layers[sourceLayerNum];
    var targetLayer = brain.layers[sourceLayerNum+1];
    // for all source nodes add weights for each target node
    for (var sourceNodeNum=-1; sourceNodeNum<Object.keys(sourceLayer).length; sourceNodeNum++) {

      var sourceNode = sourceLayer[sourceNodeNum];
      for (var targetNodeNum=0; targetNodeNum<Object.keys(targetLayer).length; targetNodeNum++) {
        var targetNode = targetLayer[targetNodeNum];
        // first add bias node weights
        if (sourceNodeNum === -1) {
          weights.push(targetNode.bias);
        } else {
          weights.push(targetNode.weights[sourceNodeNum]);
        }
      }
    }
  }

  return weights;

};
