// Copyright (c)2022 Quinn Michaels
//  Main Devas include file wheere all the necessary Devas are included.
const DEVA = {
  data: require('./data'), // data agent
  log: require('../../Devas/LogDeva'), // logging agent
  error: require('../../Devas/ErrorDeva'), // error agent
  feecting: require('../../Devas/FeectingDeva'), // feecting language agent
  socket: require('@indra.ai/socketdeva'), // socket agent
  docs: require('@indra.ai/docsdeva'), // documents agent

  support: require('@indra.ai/supportdeva'), // support agent
  services: require('@indra.ai/servicesdeva'), // services agent
  security: require('@indra.ai/securitydeva'), // security agent

  open: require('../../Devas/OpenDeva'), // open ai agent
  veda: require('../../Devas/VedaDeva'), // agent providing Vedic Knowledge
};
module.exports = DEVA;

// bug: require('./bug'), // bug reporting agent
// gemini: require('../../Devas/GeminiDeva'), // provides gemini connectivity.
// qr: require('@indra.ai/qrdeva'), // QR Deva for QR Codes
// wiki: require('@indra.ai/wikideva'), // connects to wikipedia
//
// telnet: require('../../Devas/TelnetDeva'), // telnet agent
// mud: require('../../Devas/MudDeva'), // Deva.cloud access
// space: require('../../Devas/SpaceDeva'), // Deva.space access
//
// youtube: require('@indra.ai/youtubedeva'), // provides youtube connectivity.
// deva: require('./deva'), // deva agent
// indu: require('./indu'), // indu agent
// indra: require('./indra'), // indra agent
// soma: require('./soma'), // soma agent
// agni: require('./agni'), // agni agent
// vasu: require('./vasu'), // zephyr agent
// quinn: require('./quinn'), // quinn agent
// romanov: require('./romanov'), // romanov agent
// aria: require('@indra.ai/ariadeva'), // aria agent
// zephyr: require('./zephyr'), // zephyr agent
// web: require('@indra.ai/webdeva'),
// money: require('./money'),
// market: require('./market'),

//npm i @indra.ai/logdeva@latest @indra.ai/errordeva@latest @indra.ai/feectingdeva@latest @indra.ai/securitydeva@latest @indra.ai/supportdeva@latest @indra.ai/servicesdeva@latest @indra.ai/systemsdeva@latest @indra.ai/solutionsdeva@latest @indra.ai/researchdeva@latest @indra.ai/developmentdeva@latest @indra.ai/businessdeva@latest @indra.ai/assistantdeva@latest --save-dev
