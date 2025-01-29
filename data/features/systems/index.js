// Copyright (c)2025 Quinn Michaels; All rights reserved.
const path = require('path');
const systems = require('./main.json').DATA

const thePath = path.join('/Users/quinnmichaels/Dev/deva.space/devas/deva.systems', 'feature', 'methods.js');
systems.methods = import(thePath);

// systems.devas = {
// 	data: require('./data.json').DATA,
// 	log: require('./log.json').DATA,
// 	chat: require('./chat.json').DATA,
// }
module.exports = systems;
