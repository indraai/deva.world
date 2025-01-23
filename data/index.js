const vars = require('./vars.json').DATA;
const agent = require('./agent.json').DATA;
const client = require('./client.json').DATA;

client.features = require('./features');

module.exports = {
  agent,
  client,
  vars,
};
