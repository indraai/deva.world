// Copyright (c)2025 Quinn Michaels
//  Main Devas include file where all the necessary Devas are included.

import socket from '../../deva.space/devas/deva.socket/index.js';
import data from './data/index.js';
import error from '../../deva.space/devas/deva.error/index.js';
import log from '../../deva.space/devas/deva.log/index.js';
import feecting from '../../deva.space/devas/deva.feecting/index.js';
import chat from '../../deva.space/devas/deva.chat/index.js';
import docs from '../../deva.space/devas/deva.docs/index.js';
import content from '../../deva.space/devas/deva.content/index.js';
import security from '../../deva.space/devas/deva.security/index.js';
import services from '../../deva.space/devas/deva.services/index.js';
import support from '../../deva.space/devas/deva.support/index.js';
import systems from '../../deva.space/devas/deva.systems/index.js';
import veda from '../../deva.space/devas/deva.veda/index.js';
const DEVA = {
  socket,
  data,
  error,
  log,
  feecting,
  chat,
  docs,
  content,
  security,
  services,
  support,
  systems,
  veda,
};
export default DEVA;


//   socket:   import('@indra.ai/deva.socket'),     // socket agent
//   docs:     import('@indra.ai/deva.docs'),       // documents agent
//   content:  import('@indra.ai/deva.content'),    // content agent
// 
//   veda:     import('@indra.ai/deva.veda'),       // agent providing Vedic 
//   chat:     import('@indra.ai/deva.chat'),       // open ai agent

// npm i @indra.ai/deva.log@latest @indra.ai/deva.error@latest @indra.ai/deva.feecting@latest @indra.ai/deva.socket@latest @indra.ai/deva.docs@latest @indra.ai/deva.content@latest @indra.ai/deva.support@latest @indra.ai/deva.services@latest @indra.ai/deva.security@latest @indra.ai/deva.veda@latest @indra.ai/deva.chat@latest --save-dev 

//     "@indra.ai/deva.error": "^0.0.1",
// "@indra.ai/deva.feecting": "^0.0.1",
// "@indra.ai/deva.log": "^0.0.1",
// "@indra.ai/deva.chat": "^0.0.1",
// "@indra.ai/deva.security": "^0.0.1",
// "@indra.ai/deva.services": "^0.0.1",
// "@indra.ai/deva.socket": "^0.0.1",
// "@indra.ai/deva.support": "^0.0.1",
// "@indra.ai/deva.docs": "^0.0.1",
// "@indra.ai/deva.content": "^0.0.1",
// "@indra.ai/deva.veda": "^0.0.1",
