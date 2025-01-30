import agent from './agent.json' with {type:'json'};
import client from './client.json' with {type:'json'};
import vars from './vars.json' with {type:'json'};
import features from './features/index.js';
export default {
  agent: agent.DATA,
  client: client.DATA,
  vars: vars.DATA,
  features,
};
