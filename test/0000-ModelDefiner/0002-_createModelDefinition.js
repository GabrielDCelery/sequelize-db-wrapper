'use strict';

const _ = require('lodash');
const ModelDefiner = require('../../src/ModelDefiner');
let sandbox = null;
let instance = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
    instance = new ModelDefiner({
        Sequelize: {
            UUID: sinon.stub().returns('fooUUID'),
            UUIDV4: 'uuidv4'
        }
    });
    sandbox.stub(instance, '_createDataType');

    _.times(5, _index => {
        instance._createDataType.onCall(_index).returns(`foo${_index}`);
    });
});

afterEach(() => {
    sandbox.restore();

    instance = null;
});

it('creates a Sequelize model definition from a configuration object and ' +
    'appends an id column as a primary key', () => {
    expect(instance._createModelDefinition({
        name: {
            typeConfig: {
                type: 'STRING',
                typeArguments: [255]
            },
            unique: 'userName'
        },
        occupation: {
            typeConfig: {
                type: 'INTEGER',
                typeArguments: [11]
            },
            required: true
        },
        age: {
            typeConfig: {
                type: 'INTEGER'
            },
            required: true
        },
        status: {
            typeConfig: {
                type: 'ENUM',
                typeArguments: ['foo', 'bar']
            }
        }
    })).to.eql({
        id: {
            type: 'fooUUID',
            defaultValue: 'uuidv4',
            primaryKey: true
        },
        name: {
            type: 'foo0',
            unique: 'userName'
        },
        occupation: {
            type: 'foo1',
            required: true
        },
        age: {
            type: 'foo2',
            required: true
        },
        status: {
            type: 'foo3'
        }
    });

    expect(instance.sequelize.Sequelize.UUID.callCount).to.eql(1);
    expect(instance._createDataType.callCount).to.eql(4);
    expect(instance._createDataType.getCall(0).args[0]).to.eql({
        type: 'STRING',
        typeArguments: [255]
    });
    expect(instance._createDataType.getCall(1).args[0]).to.eql({
        type: 'INTEGER',
        typeArguments: [11]
    });
    expect(instance._createDataType.getCall(2).args[0]).to.eql({
        type: 'INTEGER'
    });
    expect(instance._createDataType.getCall(3).args[0]).to.eql({
        type: 'ENUM',
        typeArguments: ['foo', 'bar']
    });
});

it('throws an error if configuration object has the reserved id attribute', () => {
    expect(() => {
        instance._createModelDefinition({
            id: {
                typeConfig: {
                    type: 'INTEGER',
                    typeArguments: [11]
                }
            }
        });
    }).to.throw('Invalid column -> id is a reserved property');
});

it('throws an error if any of the configuration object attributes have primaryKey property', () => {
    expect(() => {
        instance._createModelDefinition({
            name: {
                typeConfig: {
                    type: 'STRING',
                    typeArguments: [255]
                },
                primaryKey: true
            }
        });
    }).to.throw('Invalid column option -> primaryKey is a reserved property');
});

it('does not mutate the configuration object', () => {
    const _modelDefConfig = {
        name: {
            typeConfig: {
                type: 'STRING',
                typeArguments: [255]
            }
        }
    };

    instance._createModelDefinition(_modelDefConfig);

    expect(_modelDefConfig).to.eql({
        name: {
            typeConfig: {
                type: 'STRING',
                typeArguments: [255]
            }
        }
    });
});
