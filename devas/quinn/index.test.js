// Copyright (c)2023 Quinn Michaels
// Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(deva.me.name, () => {
  beforeEach(() => {
    return deva.init()
  });
  it('Check the DEVA Object', () => {
    expect(deva).to.be.an('object');
    expect(deva).to.have.property('agent');
    expect(deva).to.have.property('vars');
    expect(deva).to.have.property('listeners');
    expect(deva).to.have.property('methods');
    expect(deva).to.have.property('modules');
  });
})
