// Copyright (c)2022 Quinn Michaels
//  Main Devas include file wheere all the necessary Devas are included.
const DEVA = {
  data:     require('./data'),                    // data agent
  log:      require('@indra.ai/deva.log'),        // logging agent
  error:    require('@indra.ai/deva.error'),      // error agent
  feecting: require('@indra.ai/deva.feecting'),   // feecting agent
  socket:   require('@indra.ai/deva.socket'),     // socket agent
  docs:     require('@indra.ai/deva.docs'),       // documents agent
  content:  require('@indra.ai/deva.content'),    // content agent

  support:  require('@indra.ai/deva.support'),    // support agent
  services: require('@indra.ai/deva.services'),   // services agent
  security: require('@indra.ai/deva.security'),   // security agent
  veda:     require('@indra.ai/deva.veda'),       // agent providing Vedic 
  chat:     require('@indra.ai/deva.chat'),       // open ai agent
};
module.exports = DEVA;


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
