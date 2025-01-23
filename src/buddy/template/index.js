// Copyright (c)::year:: ::copyright::
// ::name::

const Deva = require('@indra.ai/deva');

const package = require('../../package.json');
const info = {
  id: package.id,
  name: package.name,
  version: package.version,
  author: package.author,
  describe: package.description,
  dir: __dirname,
  url: package.homepage,
  git: package.repository.url,
  bugs: package.bugs.url,
  license: package.license,
  copyright: package.copyright
};

const {agent,vars} = require('./data.json').DATA;

const ::key-upper:: = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
  listeners: {},
  modules: {},
  devas: {},
  func: {},
  methods: {},
});
module.exports = ::key-upper::
