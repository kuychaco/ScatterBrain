# ScatterBrain
Watch the evolution of your neural nets as they are being trained!

## Instructions
1. Clone repo
2. `npm install`
3. `npm start`
4. Visit localhost:8888
5. Train some brains!

## GIF
![screenshot](https://cloud.githubusercontent.com/assets/7910250/10273277/c149dbe4-6ae2-11e5-9fcf-eac0e805aff6.gif)

## About
This visualization uses Brain.js, a JavaScript neural network library, to approximate the XOR function:
```javascript
var net = new brain.NeuralNetwork();

net.train([{input: [0, 0], output: [0]},
           {input: [0, 1], output: [1]},
           {input: [1, 0], output: [1]},
           {input: [1, 1], output: [0]}]);

var output = net.run([1, 0]);  // [0.987]
```

## Interesting Features and Aspects
- Visualized using **D3.js** (modify link opacity based on weight ratios)
- Real-time updates from server using websockets (**socket.io**)
- Modified **brain.js** source code
  - callback to `net.train` method receives [serialized net object](https://github.com/kuychaco/ScatterBrain/blob/3546355ffbae9158fd1b767c745186355f40b551/node_modules/brain/lib/neuralnetwork.js#L114-L116)
- Parallelization on both ends of the stack (2 versions of app)
  - server: **node child processes** ([repo](https://github.com/kuychaco/ScatterBrain/tree/parallelNode))
  - client: **web workers** ([repo](https://github.com/kuychaco/ScatterBrain/tree/gh-pages))
