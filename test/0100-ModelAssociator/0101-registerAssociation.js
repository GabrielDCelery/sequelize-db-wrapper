'use strict';

const ModelAssociator = require('../../src/ModelAssociator');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('registers a one to one association between models', () => {
    const instance = new ModelAssociator();

    const sourceModelStub = {
        name: 'foo',
        hasOne: sandbox.stub()
    };
    const targetModelStub = {
        name: 'bar',
        belongsTo: sandbox.stub()
    };

    instance.registerAssociation('oneToOne', sourceModelStub, targetModelStub);

    expect(sourceModelStub.hasOne.callCount).to.eql(1);
    expect(targetModelStub.belongsTo.callCount).to.eql(1);
    expect(sourceModelStub.hasOne.getCall(0).args)
        .to.eql([targetModelStub, {
            foreignKey: 'fooId',
            sourceKey: 'id'
        }]);
    expect(targetModelStub.belongsTo.getCall(0).args)
        .to.eql([sourceModelStub, {
            foreignKey: 'fooId',
            targetKey: 'id'
        }]);
});

it('registers a one to many association between models', () => {
    const instance = new ModelAssociator();

    const sourceModelStub = {
        name: 'foo',
        hasMany: sandbox.stub()
    };
    const targetModelStub = {
        name: 'bar',
        belongsTo: sandbox.stub()
    };

    instance.registerAssociation('oneToMany', sourceModelStub, targetModelStub);

    expect(sourceModelStub.hasMany.callCount).to.eql(1);
    expect(targetModelStub.belongsTo.callCount).to.eql(1);
    expect(sourceModelStub.hasMany.getCall(0).args)
        .to.eql([targetModelStub, {
            foreignKey: 'fooId',
            sourceKey: 'id'
        }]);
    expect(targetModelStub.belongsTo.getCall(0).args)
        .to.eql([sourceModelStub, {
            foreignKey: 'fooId',
            targetKey: 'id'
        }]);
});

it('registers a many to many association between models', () => {
    const instance = new ModelAssociator();

    const sourceModelStub = {
        name: 'foo',
        belongsToMany: sandbox.stub()
    };
    const targetModelStub = {
        name: 'bar',
        belongsToMany: sandbox.stub()
    };

    instance.registerAssociation('manyToMany', sourceModelStub, targetModelStub);

    expect(sourceModelStub.belongsToMany.callCount).to.eql(1);
    expect(targetModelStub.belongsToMany.callCount).to.eql(1);
    expect(sourceModelStub.belongsToMany.getCall(0).args)
        .to.eql([targetModelStub, {
            through: 'fooBars',
            foreignKey: 'fooId'
        }]);
    expect(targetModelStub.belongsToMany.getCall(0).args)
        .to.eql([sourceModelStub, {
            through: 'fooBars',
            foreignKey: 'barId'
        }]);
});
