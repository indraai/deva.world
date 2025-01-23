// Copyright (c)2023 Quinn Michaels
// Data Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(data.me.name, () => {
  beforeEach(() => {
    return data.init()
  });
  it('Check the DEVA Object', () => {
    expect(data).to.be.an('object');
    expect(data).to.have.property('agent');
    expect(data).to.have.property('vars');
    expect(data).to.have.property('listeners');
    expect(data).to.have.property('methods');
    expect(data).to.have.property('modules');
  });
})
