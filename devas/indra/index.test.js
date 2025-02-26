// Copyright (c)2025 Quinn Michaels
// Indra Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(indra.me.name, () => {
  beforeEach(() => {
    return indra.init()
  });
  it('Check the DEVA Object', () => {
    expect(indra).to.be.an('object');
    expect(indra).to.have.property('agent');
    expect(indra).to.have.property('vars');
    expect(indra).to.have.property('listeners');
    expect(indra).to.have.property('methods');
    expect(indra).to.have.property('modules');
  });
})
