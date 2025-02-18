// Copyright (c)2025 Quinn Michaels
// Hal Atkin test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(hal.me.name, () => {
  beforeEach(() => {
    return hal.init()
  });
  it('Check the DEVA Object', () => {
    expect(hal).to.be.an('object');
    expect(hal).to.have.property('agent');
    expect(hal).to.have.property('vars');
    expect(hal).to.have.property('listeners');
    expect(hal).to.have.property('methods');
    expect(hal).to.have.property('modules');
  });
})
