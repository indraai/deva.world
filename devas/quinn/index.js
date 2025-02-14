// Copyright (c)2025 Quinn Michaels
// #Quinn

import Deva from '@indra.ai/deva';
import pkg from '../../package.json' with {type:'json'};

import data from './data.json' with {type:'json'};
const {agent,vars} = data.DATA;

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

const info = {
  id: pkg.id,
  name: pkg.name,
  version: pkg.version,
  author: pkg.author,
  describe: pkg.description,
  dir: __dirname,
  url: pkg.homepage,
  git: pkg.repository.url,
  bugs: pkg.bugs.url,
  license: pkg.license,
  copyright: pkg.copyright
};

const QUINN = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim()},
    parse(input) {return input.trim()},
    process(input) {return input.trim()},
  },
  listeners: {},
  modules: {},
  devas: {},
  func: {},
  methods: {},
  onReady(data, resolve) {
    this.prompt(this.vars.messages.ready);
    return resolve(data);
  }, 
  onError(err, data, reject) {
    this.prompt(this.vars.messages.error);
    return reject(err);
  }
});
export default QUINN
