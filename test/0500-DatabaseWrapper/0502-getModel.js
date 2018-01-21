'use strict';

let DatabaseWrapper = require('../../src/DatabaseWrapper');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('gets a registered model', () => {
    const instance = new DatabaseWrapper();

    instance.models.foo = 'bar';

    expect(instance.getModel('foo')).to.eql('bar');
});

it('throws an error if the model does not exist', () => {
    const instance = new DatabaseWrapper();

    expect(() => {
        instance.getModel('foo');
    }).to.throw('Model does not exist -> foo');
});
