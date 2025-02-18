#!/usr/bin/env node
// COPYRIGHT (c)2023 QUINN MICHAELS. ALL RIGHTS RESERVED.
// Main Deva Agent for deva.world

// setup main variables
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import needle from 'needle';
import chalk from 'chalk';

import pkg from './package.json' with {type:'json'}

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

// load agent configuration file
import data from './data/index.js';
const {vars, agent, client} = data;

import express from 'express';
const app = express();
app.use(express.json());

const port = vars.ports.api;

import readline from 'readline';
const shell = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

import DEVA from './src/index.js';
DEVA.config.dir = __dirname;

function setPrompt(pr) {
  shell.prompt();
  if (!pr) return;
  else if (!pr.prompt) return;
  else {
    const {colors} = pr.prompt;
    const setPrompt = chalk.rgb(colors.label.R, colors.label.G, colors.label.B)(`${pr.prompt.emoji} ${pr.prompt.text.trim()}: `);

    // const setPrompt = `${pr.prompt.emoji} ${pr.key}: `;
    shell.setPrompt(setPrompt);
    shell.prompt();
  }
}

async function devaQuestion(q) {
  // the event that fires when a new command is sent through the shell.
  if (q.toLowerCase() === '/exit') return shell.close();
  const answer = await DEVA.question(q);
      // sen the necessary returned values to the shell prompt.
  setPrompt(answer.a.agent);
  console.log(chalk.rgb(answer.a.agent.prompt.colors.text.R, answer.a.agent.prompt.colors.text.G, answer.a.agent.prompt.colors.text.B)(answer.a.text));

  setPrompt(answer.a.client);
  // if (answer.a.data) console.log(answer.a.data);
  DEVA.talk(`data:history`, answer);
  return answer;
}

// get network interfaces
const ipv4 = [];
const networks = os.networkInterfaces();
for (const x in networks) {
  networks[x].forEach(net => {
    let label = '🔶 EXTERNAL';
    if (net.internal) label = '🔷 INTERNAL';
    if (net.family == 'IPv4') ipv4.push(`${label}: http://${net.address}`);
  })
}

const line_break = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;
const devaFlash = (opts) => `
██████╗ ███████╗██╗   ██╗ █████╗
██╔══██╗██╔════╝██║   ██║██╔══██╗
██║  ██║█████╗  ╚██╗ ██╔╝███████║
██║  ██║██╔══╝   ╚████╔╝ ██╔══██║
██████╔╝███████╗  ╚██╔╝  ██║  ██║
╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝
👤  Client:    ${opts.client.profile.name} (${opts.client.id})
👤  Agent:     ${opts.agent.profile.name} (${opts.agent.id})

📛  Name:      ${pkg.name}
💚  Ver:       ${pkg.version}
✍️   Author:    ${pkg.author}
📝  Describe:  ${pkg.description}
🔗  Url:       ${pkg.homepage}
🐣  Git:       ${pkg.repository.url}
🪪   License:   ${pkg.license}

${line_break}

${opts.ip}

💹 avail mem:   ${os.freemem()}
✅ total mem:   ${os.totalmem()}

Copyright ©${pkg.copyright}

${line_break}`;



// create the static routes for the local server.
// public is used to deliver local assets
const pubOpts = {
  dotfiles: 'ignore',
  extensions: ['htm', 'html', 'json'],
  index: 'index.html, index.json',
};

app.get('/public/*', (req, res, next) => {
  const opts = {
  root: path.join(__dirname, 'public', 'assets'),
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
  };
  return res.sendFile(req.params[0], opts, (err) => {
    if (err) next(err);
  });
    
});

app.get('/', (req, res, next) => {
  const opts = {
    root: path.join(__dirname, 'src', 'ui'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  return res.sendFile('index.html', opts, (err) => {
    if (err) next(err);
  });
});

app.post('/question', (req, res, next) => {
  devaQuestion(req.body.question).then(answer => {
    return res.json(answer)
  }).catch(err => {
    return res.send(err);
  });
});

app.post('/assets/:space/:type/:vnum/:asset', (req, res, next) => {
  const {space, type, vnum, asset} = req.params;
  const _rpath = client.features.services.global.urls.space;
  let assetPath

  const dir1 = vnum.substr(0, vnum.toString().length - 3) + 'xxx';
  const dir2 = vnum.substr(0, vnum.toString().length - 2) + 'xx';
  
  if (type === 'map') assetPath = `/${space}/maps/${vnum}/${asset}.png`;
  else assetPath = `/${space}/${type}/${dir1}/${dir2}/${vnum}/${asset}.png`;

  if (client.features.services.global.paths.space) {
    try {
      const spaceFile = fs.readFileSync(path.join(client.features.services.global.paths.space, assetPath));
      res.type('image/png')
      return res.send(Buffer.from(spaceFile));
    } catch (e) {
      return res.send(e);
    }
  }
  else {
    needle('get', `${_rpath}/${assetPath}`).then(result => {
    return reply.type('image/png').send(Buffer.from(asset.body));
    }).catch(err => {
      return reply.send(err)
    });
  }
  // so we need to get images and maps here
});


// launch fast server to listen to the port rom the vars scope
app.listen(vars.ports.api, () => {
    // log the main server information to the console
  console.log(chalk.green(devaFlash({
    client,
    agent,
    ip: ipv4.map(ip => `${ip}:${vars.ports.api}`).join('\n\r'),
  })));
  // initialize the DEVA
  DEVA.init(client).then(_init => {
    setPrompt(DEVA.client());  
    // cli prompt listener for relaying from the deva to the prompt.
    DEVA.listen('cliprompt', ag => {
      setPrompt(ag);
    });
  });
  
  
  // run operation when new line item in shell.
  shell.on('line', question => {
    devaQuestion(question);
  }).on('pause', () => {
  
  }).on('resume', () => {
  
  }).on('close', () => {
    // begin close procedure to clear the system and close other devas properly.
    DEVA.stop().then(stop => {
      shell.prompt();
      process.exit(0);
    }).catch(console.error);
  
  }).on('SIGCONT', () => {
  }).on('SIGINT', data => {
    shell.close();
  }).on('SIGSTOP', () => {});
  
});
