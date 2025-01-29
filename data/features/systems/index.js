// copyright (c) 2023 Quinn Michaels
import path from 'path';
import DATA from './main.json' with {type:'json'};
const support = DATA;

const thePath = path.join('/Users/quinnmichaels/Dev/deva.space/devas/deva.systems', 'feature', 'methods.js');
support.methods = import(thePath);

export default support;
