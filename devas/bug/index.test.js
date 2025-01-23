// Copyright (c)2024 Quinn Michaels
// Bug Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(bug.me.name, () => {
  beforeEach(() => {
    return bug.init()
  });
  it('Check the DEVA Object', () => {
    expect(bug).to.be.an('object');
    expect(bug).to.have.property('agent');
    expect(bug).to.have.property('vars');
    expect(bug).to.have.property('listeners');
    expect(bug).to.have.property('methods');
    expect(bug).to.have.property('modules');
  });
})
