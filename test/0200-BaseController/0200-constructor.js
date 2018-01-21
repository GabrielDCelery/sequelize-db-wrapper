'use strict';

let BaseController = require('../../src/BaseController');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('creates a default instance', () => {
    BaseController = sandbox.spy(BaseController);

    const instance = new BaseController('foo');

    expect(BaseController.callCount).to.eql(1);
    expect(instance.model).to.eql('foo');
});
