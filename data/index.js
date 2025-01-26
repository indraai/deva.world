import vars from './vars.json' with {type:'json'};
import agent from './agent.json' with {type:'json'};
import client from './client.json' with {type:'json'};

client.features = require('./features');

module.exports = {
  agent,
  client,
  vars,
};
