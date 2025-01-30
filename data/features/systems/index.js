// copyright (c) 2025 Quinn Michaels
import path from 'node:path';
import systems from './main.json' with {type:'json'};

const thePath = path.join('/Users/quinnmichaels/Dev/deva.space/devas/deva.systems', 'feature', 'methods.js');
systems.methods = import(thePath);

systems.devas = {}
export default systems;
