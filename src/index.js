// COPYRIGHT (C)2025 QUINN MICHAELS. ALL RIGHTS RESERVED.
// Load DEVA CORE Mind into Deva
// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

import chalk from 'chalk';
import Deva from '@indra.ai/deva';

import devas from '../devas/index.js';
import pkg  from '../package.json' with {type:'json'};
import Agent from '../data/agent.json' with {type:'json'};
import Client from '../data/client.json' with {type:'json'};
import Vars from '../data/vars.json' with {type:'json'};

const agent = Agent.DATA
const client = Client.DATA
const vars = Vars.DATA

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
  copyright: pkg.copyright,
};

const DEVA = new Deva({
  info,
  agent,
  vars,
  config: {
    dir: false,
    ports: vars.ports,
  },
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();}
  },
  devas,
  listeners: {},
  modules: {
    mind: false,
    psy: [],
  },
  func: {
    cliprompt(packet) {
      let text = packet.text;
      // if (this.vars.labels[packet.value]) text = `${this.vars.labels[packet.value]}:${packet.text}`;
      this.talk('cliprompt', packet.agent); // clears cli line
      console.log(chalk.rgb(packet.agent.prompt.colors.text.R, packet.agent.prompt.colors.text.G, packet.agent.prompt.colors.text.B)(text));
      this.talk('cliprompt', this.client()); // clears cli line
    },

    addHistory(item) {
      this.vars.history.items.push(item)
      if (this.vars.history.items.length > this.vars.history.max_items) {
        const removed = this.vars.history.items.shift();
      }
    },

    /**************
    func: devas
    params: packet
    describe: Build a list of devas currently loaded into the system.
    ***************/
    devas(packet) {
      const agent = this.agent();
      return new Promise((resolve, reject) => {
        try {
          const devas = [
            '::begin:devas',
          ];
          for (let deva in this.devas) {
            // console.log('DEVA', this.devas[deva]);
            const d = this.devas[deva];
            const {prompt, key, profile} = d.agent();
            devas.push(`button[${prompt.emoji} ${profile.name}]:${this.askChr}${key} help`);
          }
          devas.push(`::end:devas:${this.lib.hash(devas)}`);

          this.question(`${this.askChr}feecting parse ${devas.join('\n')}`).then(parsed => {
            return resolve({
              text:parsed.a.text,
              html:parsed.a.html,
              data:parsed.a.data,
            });
          }).catch(reject)
        } catch (e) {
          return this.error(e, packet, reject);
        }
      });
    },

    lists(item) {
      return new Promise((resolve, reject) => {
        try {
          const items = this[item]();
          const _items = [
            `::begin:${items.key}`,
          ];
          for (let item in items.value) {
            _items.push(`${item}: ${items.value[item]}`);
          }
          _items.push(`::end:${items.key}:${this.lib.hash(items)}`);

          this.question(`${this.askChr}feecting parse ${_items.join('\n')}`).then(parsed => {
            return resolve({
              text:parsed.a.text,
              html:parsed.a.html,
              data:parsed.a.data,
            });
          }).catch(reject)

          return resolve({
            text: _items.join('\n'),
            html: false,
            data: {
              items,
            }
          });          
        } catch (e) {
          return this.error(e, item, reject);
        }
      });
    }
  },
  methods: {

    /**************
    method: client
    params: packet
    describe: Return the current client information loaded.
    ***************/
    client(packet) {
      this.context('client');
      this.action('method', 'client');
      const text = `${this._client.prompt.emoji} ${this._client.key} | ${this._client.profile.name} |  ${this._client.id}`;
      return Promise.resolve({text, data:this._client});
    },

    /**************
    method: agent
    params: packet
    describe: Return the current agent information loaded.
    ***************/
    agent(packet) {
      this.context('agent');
      this.action('method', 'agent');
      const text = `${this._agent.prompt.emoji} ${this._agent.key} ${this._agent.profile.name} |  ${this._agent.id}`;
      return Promise.resolve({text, data: this._agent});
    },

    /**************
    method: question
    params: packet
    describe: Method to relaty to question function with packet information.
    ***************/
    question(packet) {
      this.context('question');
      this.action('method', 'question');
      return new Promise((resolve, reject) => {
        if (!packet.q.text) return resolve(this._messages.notext);
        this.question(`${this.askChr}buddy ask ${packet.q.text}`).then(ask => {
          this.state('done');
          return resolve({
            text: ask.a.text,
            html: ask.a.html,
            data: ask.a.data,
          });
        }).catch(err => {
          return this.error(packet, err, reject);
        });
      });
    },

    /**************
    method: devas
    params: packet
    describe: Call devas function and return list of system devas.
    ***************/
    devas(packet) {
      this.context('devas');
      this.action('method', 'devas');
      return this.func.devas(packet);
    },

    /**************
    method: states
    params: packet
    describe: Call states function and return list of system states.
    ***************/
    states(packet) {
      this.context('states');
      this.action('method', 'states');
      return this.func.lists('states');
    },

    /**************
    method: actions
    params: packet
    describe: Call actions function and return list of system actions.
    ***************/
    actions(packet) {
      this.context('actions');
      this.action('method', 'actions');
      return this.func.lists('actions');
    },

    /**************
    method: features
    params: packet
    describe: Call features function and return list of system features.
    ***************/
    features(packet) {
      this.context('features');
      this.action('method', 'features');
      return this.func.lists('features');
    },

    /**************
    method: zones
    params: packet
    describe: Call zones function and return list of system zones.
    ***************/
    zones(packet) {
      this.context('zones');
      this.action('method', 'zones');
      return this.func.lists('zones');
    },

    /**************
    method: contexts
    params: packet
    describe: Call contexts function and return list of system contexts.
    ***************/
    contexts(packet) {
      this.context('contexts');
      this.action('method', 'contexts');
      return this.func.lists('contexts');
    },

    /**************
    method: memory
    params: packet
    describe: Return the current memory for the system deva.
    ***************/
    memory(packet) {
      this.context('memory');
      this.action('method', 'memory');
      const free = this.os.freemem();
      const free_format = `${Math.round(free / 1024 / 1024 * 100) / 100} MB`;
      const total = this.os.totalmem();
      const total_format = `${Math.round(total / 1024 / 1024 * 100) / 100} MB`;
      const text = `memory: ${free_format} / ${total_format}`;
      const html = `<p>${text}</p>`;
      const ret = {
        text,
        html,
        data: {
          free,
          total,
        }
      }
      return Promise.resolve(ret);
    },
  },
  onReady(data, resolve) {
    // listen for core prompt and forawrd to cliprompt function
    this.listen('devacore:prompt', packet => {
      this.func.cliprompt(packet);
    });
    // load the devas
    for (let x in this.devas) {
      this.devas[x].init(data.client);
    }
    return resolve(data);
  },
  onError(err, reject) {
    console.log('MAIN ERROR', err);
  },
  async onStop(data, resolve) {
    for (const deva in this.devas) {
      await this.devas[deva].stop();
    }
    return this.exit(data, resolve);
  },
});

export default DEVA;
