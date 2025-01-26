// Copyright (c)2022 Quinn Michaels
//  Main Devas include file wheere all the necessary Devas are included.
const DEVA = {
  data:     require('./data'),                    // data agent
  log:      require('@indra.ai/deva.log'),        // logging agent
  error:    require('@indra.ai/deva.error'),      // error agent
  feecting: require('@indra.ai/deva.feecting'),   // feecting agent
  socket:   require('@indra.ai/deva.socket'),     // socket agent
  docs:     require('@indra.ai/deva.docs'),       // documents agent
  content:     require('@indra.ai/deva.content'), // content agent

  support:  require('@indra.ai/deva.support'),    // support agent
  services: require('@indra.ai/deva.services'),   // services agent
  security: require('@indra.ai/deva.security'),   // security agent
  veda:     require('@indra.ai/deva.veda'),       // agent providing Vedic 
  chat:     require('@indra.ai/deva.chat'),       // open ai agent
};
module.exports = DEVA;
