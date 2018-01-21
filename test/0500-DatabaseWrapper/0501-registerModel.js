'use strict';

let DatabaseWrapper = require('../../src/DatabaseWrapper');
let BaseController = require('../../src/BaseController');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('registers a model and a base controller', () => {
    const instance = new DatabaseWrapper();

    sandbox.stub(instance.modelDefiner, 'createModel').returns('model');

    instance.registerModel('bar', 'modelDefConfig');

    expect(instance.models.bar).to.eql('model');
    expect(instance.baseControllers.bar).to.be.an.instanceof(BaseController);
    expect(instance.modelDefiner.createModel.callCount).to.eql(1);
    expect(instance.modelDefiner.createModel.getCall(0).args).to.eql(['bar', 'modelDefConfig']);
});

it('registers a model and a base controller on a namespace', () => {
    const instance = new DatabaseWrapper();

    sandbox.stub(instance.modelDefiner, 'createModel').returns('model');

    instance.registerModel('namespace.bar', 'modelDefConfig');

    expect(instance.models.namespace.bar).to.eql('model');
    expect(instance.baseControllers.namespace.bar).to.be.an.instanceof(BaseController);
    expect(instance.modelDefiner.createModel.callCount).to.eql(1);
    expect(instance.modelDefiner.createModel.getCall(0).args).to.eql(['bar', 'modelDefConfig']);
});

it('throws an error if model is already registered', () => {
    const instance = new DatabaseWrapper();

    instance.models.namespace = {
        foo: 'bar'
    };

    expect(() => {
        instance.registerModel('namespace.foo', () => {});
    }).to.throw('Tried to register model twice -> namespace.foo');
});
