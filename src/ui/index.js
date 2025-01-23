// Copyright (c)2022 Quinn Michaels
"use strict";
import {io} from 'socket.io-client';

const emojis = {
  weather:'🌦',
  get:'⏬',
  put: '⏫',
  key: '🔑',
  eat: '🥗',
  drink:'🥛',
  pos: '🚹',
  exp: '🪖',
  gold: '💰',
  depart: '🚶',
  arrive: '🚶',
  player: '🧑',
  alert: '🚨',
  trigger: '🔫',
  save: '💾',
  light: '🔦',
  wield: '🔪',
  head: '🧢',
  legs: '🦿',
  feet: '🥾',
  hands: '✋',
  waist: '🥋',
  rwrist: '👉',
  lwrist: '👈',
  body: '👕',
  arms: '🦾',
  shield: '🛡',
  about: '🎒',
  say: '💬',
  door: '🚪',
  info: '💁',
  error: '❌',
  fight: '🥊',
  sound: '🔊'
};

class DevaInterface {
  constructor() {
    this.client = false;
    this._content = false;
    this.socket = false;
    this._shell = [];        // used for keeping track of items in the console.
    this._console = {
      context: [],
      state: [],
      action: [],
      feature: [],
      zone: [],
      alerts: [],
      panel: [],
    }
    this._features = [
      'security',
      'support',
      'services',
    ];
    this.history_count = 25;
  }

  set content(txt) {
    this._content = txt;
  }
  get content() {
    return this._content;
  }

  _logData(data) {
    const _html = [
      `<div class="item datalog">`,
      this._keyValue(data),
      `</div>`,
    ].join('\n');
    $('#DataPanel article').html(_html);
  }

  _logAlert(data) {
    if (this._alerts.length > this.history_count) {
      this._alerts = [];
      $('#Alerts .item').last().remove();
    }
    this._alerts.unshift(data);

    const { label, text } = data.agent.prompt.colors;
    const _html = [
      `<div class="item alert" data-id="${data.id}">`,
      `<span class="label" style="color:rgb(${label.R},${label.G},${label.B})">`,
      `${data.agent.prompt.emoji} #${data.agent.key}:`,
      '</span>',
      `<span class="value" style="color: rgb(${text.R}, ${text.G}, ${text.B})">`,
      `${data.text}`,
      '</span>',
      '</div>'
    ].join('');
    $('#Alerts').prepend(_html);
  }

  _scrollTop(elem) {
    return setTimeout(() => {
      const so = document.getElementById(elem);
      so.scrollTop = 0;
    }, 100);
  }

  Question(q, log=true) {

    const text = q.length > 100 ? [
      `<p>${q}</p>`,
      `<div class="box buttons">`,
      `<button class="btn button" data-button="#open speech:${this.client.profile.voice} ${q}">🗣️ Speak</button>`,
      `<button class="btn button" data-button="#open image ${q}">🎨 Art</button>`,
      `</div>`,
    ].join('\n') : q;

    if (log) this.Console({
      type: 'question',
      format: 'client',
      text,
      agent: this.client,
    });

    $('event-panel').html(''); // clear the event panels
    
    return new Promise((resolve, reject) => {
      // this.Clear(q);
      axios.post('/question', {
        question: q,
      }).then(response => {
        const answer = response.data;
        this._logData({[answer.id]: answer});
        return this.processor(answer.a);
      }).catch(err => {
        console.log('error', err);
        return reject(err);
      });
    });
  }

  Log() {
    return Promise.resolve(this._formatLog());
  }

  // the keyvalue pair processor for output into html of recursive structures.
  _keyValue(obj) {
    // create html key pair format
    const output = [];
    for (let key in obj) {
      const v = obj[key];
      if (typeof v === 'object') {
        output.push(`<div class="child"><div class="key">${key}</div><div class="values">${this._keyValue(v)}</div></div>`);
      }
      else if (Array.isArray(v)) {
        v.forEach((av,idx) => {
          output.push(`<div class="row"><div class="value">${idx}. ${av}</div></div>`);
        });
      }
      else {
        let _temp = v;
        if (_temp && _temp.toString().startsWith('/')) _temp = `<button class="jump" data-data="${v}">${v}</button>`;
        if (key !== 'html') output.push(`<div class="row"><div class="key">${key}:</div><div class="value">${_temp}</div></div>`);
      };
    }
    return output.join('\n');
  }


  // load key value pair objects into the this scope and output to a data container
  GetKeyPair(opts) {
    this[opts.var] = opts.data;
    const content =`<div class="DataContainer" id="${opts.id}"><h1>${opts.var}</h1>${this._keyValue(opts.data)}</div>`;
    this.Viewer(content)
  }

  Client(data) {
    if (this.client) return;

    this.client = data;

    this.GetKeyPair({
      data,
      id: 'Client',
      var: 'client'
    });

    const shell = document.getElementById('Prompt');
    const label = document.getElementById('PromptLabel');
    const {prompt} = this.client;
    const {colors} = prompt;
    if (shell) {
      shell.style.color = `rgb(${colors.text.R}, ${colors.text.G}, ${colors.text.B})`;
    }
    if (label) {
      label.style.color = `rgb(${colors.label.R}, ${colors.label.G}, ${colors.label.B})`;
      label.innerHTML = `${prompt.emoji} ${prompt.text}`;
    }

  }

  Viewer(html) {
    // first let's add the class
    $('#Viewer').removeClass('fade-in').addClass('fade-out');
    setTimeout(() => {
      $('#Viewer').html(html);
      const so = document.getElementById('Viewer');
      so.scrollTop = 0;
      $('#Viewer').removeClass('fade-out').addClass('fade-in');
      return Promise.resolve(true);
    }, 1000);
  }

  Console(opts) {
    if (!opts.text) return;

    if (this._shell.length > this.history_count) {
      this._shell.shift();
      $('#ConsoleItems .item').first().remove();
    }

    this._shell.push(opts);

    const {type, format, agent, text, data} = opts;
    const {prompt, profile, key} = agent;
    const {colors} = prompt;
    const prompt_color = `rgb(${colors.label.R}, ${colors.label.G}, ${colors.label.B})`;
    const text_color = `rgb(${colors.text.R}, ${colors.text.G}, ${colors.text.B})`;
    let theHtml = `
    <div class="item ${type} ${format}">
      <div class="person" style="color: ${prompt_color}"><span class="avatar"><img src="${profile.emoji}"/></span><span class="agent">${prompt.text}</span></div>
      <div class="text" style="color: ${text_color}">${text}</div>
    </div>`;

    $('#ConsoleItems').append(theHtml);
    return setTimeout(() => {
      const so = document.getElementById('ConsoleItems');
      if (so) so.scrollTop = so.scrollHeight;
    }, 250);
  }

  PanelConsole(key,value) {
    if (this._console.panel.length > 20) {
      this._console.panel = [];
      $('#PanelConsole').html('');
    }
    this._console.panel.push({key,value});
    $('#PanelConsole').prepend(`<div class="item ${key.toLowerCase()}">${emojis[key.toLowerCase()]} ${value}</div>`)
  }

  Log(data) {
    if (!this._console[data.key]) return;
    const selector = `.event-panel.${data.key} article`;
    const {colors} = data.agent.prompt;
    const html = [
      `<div class="item ${data.key} ${data.value}" data-id="${data.id}" data-hash="${data.hash}">`,
      `<span class="emoji"><img src="${data.agent.profile.emoji}"></span>`,
      `<span class="label" style="color:rgb(${colors.label.R},${colors.label.G},${colors.label.B});">#${data.agent.key}</span>`,
      `<span class="text" style="color:rgb(${colors.text.R},${colors.text.G},${colors.text.B});">${data.text}<span>`,
      '</div>',
    ].join('\n');

    if (this._console[data.key].length > this.history_count) {
      this._console[data.key].shift();
      $(`${selector} .item`).last().remove();
    }
    this._console[data.key].push(data);
    $(selector).prepend(html)
  }


  async data(packet) {
    if (packet.meta.method === 'history') {
      const data = packet.data.reverse();
      for (let x of data) {
        this.Console({
          type: x.q.meta.key,
          method: x.q.meta.method,
          agent: x.q.client,
          meta: x.q.meta,
          text: x.q.html ? x.q.html : x.q.text,
        });
        this.Console({
          type: x.a.meta.key,
          method: x.a.meta.method,
          agent: x.a.agent,
          meta: x.a.meta,
          text: x.a.html ? x.a.html : x.a.text,
        });
        console.log('DATA', x);
      }
      return;
    }
    return this.Console({
      type: packet.meta.key,
      method: packet.meta.method,
      agent: packet.agent,
      meta: packet.meta,
      text: packet.html ? packet.html : packet.text,
    });
  }
  docs(data) {
    console.log('DOCS DATA', data);
    if (data.meta.method === 'view') {
      if (data.meta.params[1] && data.meta.params[1] === 'panel') $('#Panel').html(data.html)
      else this.Viewer(data.html);
      return;
    }
    this.Console({
      type: data.meta.key,
      method: data.meta.method,
      agent: data.agent,
      meta: data.meta,
      text: data.html ? data.html : data.text,
    });
  }
  space(data) {
    console.log('DOCS DATA', data);
    if (['agent','object','place'].includes(data.meta.method)) {
      return this.Viewer(data.html);
    }
    this.Console({
      type: data.meta.key,
      method: data.meta.method,
      agent: data.agent,
      meta: data.meta,
      text: data.html ? data.html : data.text,
    });
  }

  veda(data) {
    const {method, key} = data.meta;
    console.log('DOCS DATA', data);
    switch (method) {
      case "books":
      case "book":
        const {colors} = data.agent.prompt;
        const panel = document.getElementById('Panel');
        panel.style.color = `rgb(${colors.text.R}, ${colors.text.G}, ${colors.text.B})`;
        panel.innerHTML = data.html;
        return;
      case 'hymn':
        this.Viewer(data.html);
      break
      default:
        return this.Console({
          type: key,
          method,
          agent: data.agent,
          meta: data.meta,
          text: data.html ? data.html : data.text,
        });
    }
  }

  youtube(data) {
    console.log('YOUTUBE DATA', data);
    this.Console({
      type: data.meta.key,
      method: data.meta.method,
      agent: data.agent,
      meta: data.meta,
      text: data.html ? data.html : data.text,
    });
  }

  // parses coordinates from a string
  coordinates(txt, adv) {
    const coord = /coordinates:(.+)\[(.+)\|(.+)\]/g;
    const coordinates = coord.exec(txt);
    if (!coordinates) return;
    const nameS = coordinates[1].split('-');
    const name = nameS && nameS[1] ? nameS[1] : 'main';
    const _map = `/asset/${adv}/map/${nameS[0]}/${name}`;
    if (_map !== this.map) {
      this.map = _map;
      $('.controls').css({'background-image': `url(${this.map})`});
    }
    $('.controls').css({'background-position': `${coordinates[2]}px ${coordinates[3]}px`});
    return;
  }

  mud(data) {
    this.coordinates(data.text, data.meta.adventure.key);

    const _func = {
      exits(opts) {
        $(`#MudExits .btn.active`).removeClass('active');
        $(`#MudMap .grid .dots.active`).removeClass('active');
        const exits = opts.text.split('\n');
        exits.forEach(ex => {
          const bt = ex.match(/exit\[(.+)\]:(.+)/);
          if (!bt) return;
          $(`.btn.exit.${bt[1]} span`).text(bt[2]);
          $(`[data-navigate="${bt[1]}"]`).addClass('active');
        });
        return;
      },
    }
    switch (data.meta.method) {
      case "look":
      case "north":
      case "south":
      case "east":
      case "west":
      case "northwest":
      case "southhwest":
      case "northeast":
      case "southheast":
      case "up":
      case "down":
        this.Viewer(data.html);
        this.Question('#mud exits', false);
        break;
      case "exits":
        _func.exits(data);
        break;
      default:
        this.Console({
          type: data.meta.key,
          method: data.meta.method,
          agent: data.agent,
          meta: data.meta,
          text: data.html ? data.html : data.text,
        });

    }
  }

  buddy(data) {
    switch (data.meta.method) {
      case 'devas':
        $('#Panel').html(data.html)
        break;
      default:
        this.Console({
          type: data.meta.key,
          method: data.meta.method,
          agent: data.agent,
          meta: data.meta,
          text: data.html ? data.html : data.text,
        });

    }
  }

  feature(data) {
    this.Viewer(data.html);
  }

  services(data) {
    this.Console({
      type: data.meta.key,
      method: data.meta.method,
      agent: data.agent,
      meta: data.meta,
      text: data.html ? data.html : data.text,
    });
  }

  processor(data) {
    if (!data.text) return;
    const { meta } = data;
    const metaKey = meta.key;
    // here in the processor we want to check for any strings that also match from the first index.
    const metaChk = this[metaKey] && typeof this[metaKey] === 'function';
    const helpChk = meta.method === 'help';
    const featureChk = this._features.includes(meta.method);

    if (helpChk) return this.Viewer(data.html);
    else if (featureChk) return this.feature(data);
    else if (metaChk) return this[meta.key](data);
    // editor

    else return this.Console({
      type: data.meta.key,
      format: data.meta.method,
      agent:data.agent,
      meta: data.meta,
      text: data.html ? data.html : data.text,
    });

    // if (!data.a.text && !data.a.html) return;
    // if (!data.a.meta) return this.general(data);
    // const type = data.a.meta.type ? data.a.meta.type : false;
    // if (typeof this[type] === 'function') return this[type](data);
    //
    // const states = ['connected', 'editor']
    // if (data.state && states.includes(data.state.key)) this._setState(data.state.key);
    // if (this.state === 'editor') return this.general(data);
    //
    //
  }

  MudPatterns(data) {
    console.log('MUD PATTERN', data);

    const trigger = data.state.split(':')[0].toLowerCase();
    const self = this;
    const triggers = {
      room(data) {
        $('#WatchRoom').html(`<span>${data.text}</span>`);
        return;
      },
      bars(opts) {
        let {bid, bclass, bmin, bmax} = opts;
        let bar = Math.floor((bmin / bmax) * 100);
        if (bar > 100) bar = 100

        if (bar < 30) bclass += ' warning';
        if (bar < 15) bclass += ' alert';
        $(`#${bid} .bar`).removeClass('warning').removeClass('alert').addClass(bclass).attr('style', `--bar-width: ${bar}%;`);
      },
      hit(data) {
        this.bars({
          bid: 'MudStatsHit',
          bclass: 'hit',
          bmin: data.pattern.matched[2],
          bmax: data.pattern.matched[3],
        });
      },
      mana(data) {
        this.bars({
          bid: 'MudStatsMana',
          bclass: 'mana',
          bmin: data.pattern.matched[2],
          bmax: data.pattern.matched[3],
        });
      },

      move(data) {
        this.bars({
          bid: 'MudStatsMove',
          bclass: 'mana',
          bmin: data.pattern.matched[2],
          bmax: data.pattern.matched[3],
        });
      },

      hunger(data) {
        this.bars({
          bid: 'MudStatsHunger',
          bclass: 'hunger',
          bmin: data.pattern.matched[2],
          bmax: data.pattern.matched[3],
        });
      },

      thirst(data) {
        this.bars({
          bid: 'MudStatsThirst',
          bclass: 'hunger',
          bmin: data.pattern.matched[2],
          bmax: data.pattern.matched[3],
        });
      },

      equipment(data) {
        const equip = (/equipment:(.+):(.+)/g).exec(data.text);
        $('#MudEquipment').append(`<div class="item equipment">${emojis[equip[1].toLowerCase()]} ${equip[2]}</div>`);
      },

      inventory(data) {
        $('#MudInventory').append(`<div class="item inventory">${data.pattern.matched[2]}</div>`);
      },

      current(data) {
        $('#q').val(data.text.replace(/\ncurrent:\s?(.+)/, `#mud > $1`));
        document.getElementById('Prompt').focus();
      },

      fight(data) {
        const {matched} = data.pattern;
        $('#MudAlerts').prepend(`<div class="item fight">${emojis[matched[1].toLowerCase()]} ${matched[2]}</div>`);
      },

      save(data) {
        $('#ShellOutput').html('')
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },

      info(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },

      error(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },

      alert(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      door(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      player(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      arrive(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      depart(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      gold(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      exp(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      pos(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      key(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      drink(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      eat(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      put(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      get(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      weather(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      trigger(data) {
        const {matched} = data.pattern;
        return self.PanelConsole(matched[1],matched[2]);
      },
      time(data) {
        const {matched} = data.pattern;
        const time = matched[2].split(':');
        const hour = time[0] < 10 ? `0${time[0]}` : time[0];
        const minute = time[1] < 10 ? `0${time[1]}` : time[1];
        $('#WatchHour').html(`<span>${hour}:${minute}</span>`);
      },
      date(data) {
        const {matched} = data.pattern;
        const DoW = matched[2].split(' - ');
        $('#WatchDay').html(`<span>${DoW[0].trim()}</span>`);
        $('#WatchDate').html(`<span>${DoW[1].trim()}</span>`);
      },
      gui(data) {
        // split the gui command from string
        const parse = data.text.split(':');
        const label = parse.shift();
        const cmd = parse.length > 1 ? parse.join(':') : parse[0];
        self.Question(cmd, false);
      }
    }
    if (triggers[trigger] && typeof triggers[trigger] === 'function') return triggers[trigger](data);
    const split_for_emoji = data.text.split(':');
    const the_emoji = split_for_emoji.shift().toLowerCase().trim();
    const _emoji = emojis[the_emoji];
    if (_emoji) data.text = `${_emoji} ${split_for_emoji.join(':')}`;
    $('#MudAlerts').prepend(`<div class="item alert">${data.text}</div>`);
  }


  Init(socket) {
    return new Promise((resolve, reject) => {
      this.socket = socket;

      $('body').on('click', '.child > .key', e => {
        $(e.target).toggleClass('open');

      }).on('click', '.art .text .box .image', e => {
        e.stopPropagation();
        e.preventDefault();
        $(e.target).closest('.image').toggleClass('artwork');
      // the event handler for the data-cmd elements.
      }).on('click', '[data-cmd]', e => {
        e.stopPropagation()
        e.preventDefault();
        const cmd = $(e.target).closest('[data-cmd]').data('cmd');
        this.Question(cmd);
      }).on('click', '[data-prompt]', e => {
        e.stopPropagation()
        e.preventDefault();
        const cmd = $(e.target).closest('[data-tty]').data('tty');
        $('#Prompt').val(cmd);
        document.getElementById('Prompt').focus();
      }).on('click', '[data-button]', e => {
        e.stopPropagation()
        e.preventDefault();
        const cmd = $(e.target).closest('[data-button]').data('button')
        this.Question(cmd, false);
      }).on('click', '[data-navigate]', e => {
        e.stopPropagation()
        e.preventDefault();
        const nav = $(e.target).closest('[data-navigate]').data('navigate');
        this.Question(`#mud ${nav}`, false);
        setTimeout(() => {
          this.Question(`#mud exits`, false);
        }, 1500);
      }).on('click', '[data-cloudbtn]', e => {
        e.stopPropagation()
        e.preventDefault();
        const nav = $(e.target).closest('[data-cloudbtn]').data('cloudbtn');
        this.Question(`#mud > ${nav}`, false);
      });

      $('#PromptForm').on('submit', e => {
        e.stopPropagation();
        e.preventDefault();
        const question = $('#Prompt').val();
        this.Question(question).catch(console.error);
        $('#Prompt').val('');
      });

      // emit the socket event for the client data
      socket.on('socket:clientdata', data => {
        this.Client(data);
      });

      socket.on('socket:global', data => {
        return this.processor(data.a);
      });

      socket.on('mud:pattern', data => {
        this.MudPatterns(data.data);
      });

      socket.on('socket:devacore', data => {
        this.Log(data)
      });
      return resolve();
    });
  }
}

const socket = io('http://localhost:9301');
const Deva = new DevaInterface();
Deva.Init(socket);
