'use strict';

const ModelDefiner = require('../../src/ModelDefiner');
let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('creates a model', () => {
    const instance = new ModelDefiner({
        define: sandbox.stub().returns('model')
    });

    sandbox.stub(instance, '_createModelDefinition').returns('modelDefinition');

    expect(instance.createModel('modelName', 'modelDefConfig')).to.eql('model');
    expect(instance._createModelDefinition.callCount).to.eql(1);
    expect(instance._createModelDefinition.getCall(0).args[0]).to.eql('modelDefConfig');
    expect(instance.sequelize.define.getCall(0).args).to.eql(['modelName', 'modelDefinition']);
});
