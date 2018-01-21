'use strict';

const DatabaseWrapper = require('../../src/DatabaseWrapper');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('registers model associations', () => {
    const instance = new DatabaseWrapper();

    instance.models = {
        namespace: {
            foo: 'foo',
            bar: 'bar'
        }
    };

    sandbox.stub(instance.modelAssociator, 'registerAssociation');

    instance.registerModelAssociation('associationType', 'namespace.foo', 'namespace.bar');

    expect(instance.modelAssociator.registerAssociation.callCount).to.eql(1);
    expect(instance.modelAssociator.registerAssociation.getCall(0).args).to.eql(['associationType', 'foo', 'bar']);
});
