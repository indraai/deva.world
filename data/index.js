import Agent from './agent.json' with {type:'json'};
import Client from './client.json' with {type:'json'};
import Vars from './vars.json' with {type:'json'};
import features from './features/index.js';

const agent = Agent.DATA;
const client = Client.DATA;
client.features = features;
const vars = Vars.DATA;

export default {agent, client, vars};
