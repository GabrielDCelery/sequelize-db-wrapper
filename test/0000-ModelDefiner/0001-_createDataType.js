'use strict';

const ModelDefiner = require('../../src/ModelDefiner');
let sandbox = null;
let instance = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
    instance = new ModelDefiner({
        Sequelize: {
            STRING: sandbox.stub().returns('fooSTRING'),
            INTEGER: sandbox.stub().returns({
                UNSIGNED: 'fooINTEGER'
            }),
            FLOAT: sandbox.stub().returns('fooFLOAT'),
            ENUM: sandbox.stub().returns('fooENUM')
        }
    });
});

afterEach(() => {
    sandbox.restore();

    instance = null;
});

it('creates a Sequelize data type if no arguments were specified', () => {
    expect(instance._createDataType({
        type: 'INTEGER'
    })).to.eql({
        UNSIGNED: 'fooINTEGER'
    });
    expect(instance._createDataType({
        type: 'INTEGER',
        typeArguments: []
    })).to.eql({
        UNSIGNED: 'fooINTEGER'
    });
    expect(instance.sequelize.Sequelize.INTEGER.callCount).to.eql(2);
    expect(instance.sequelize.Sequelize.INTEGER.getCall(0).args).to.eql([]);
    expect(instance.sequelize.Sequelize.INTEGER.getCall(1).args).to.eql([]);
});

it('creates a Sequelize data type with one argument speciefied', () => {
    expect(instance._createDataType({
        type: 'INTEGER',
        typeArguments: [11]
    })).to.eql({
        UNSIGNED: 'fooINTEGER'
    });
    expect(instance.sequelize.Sequelize.INTEGER.callCount).to.eql(1);
    expect(instance.sequelize.Sequelize.INTEGER.getCall(0).args).to.eql([11]);
});

it('creates a Sequelize data type with multiple arguments speciefied', () => {
    expect(instance._createDataType({
        type: 'FLOAT',
        typeArguments: [11, 12]
    })).to.eql('fooFLOAT');
    expect(instance.sequelize.Sequelize.FLOAT.callCount).to.eql(1);
    expect(instance.sequelize.Sequelize.FLOAT.getCall(0).args).to.eql([11, 12]);
});

it('parses data type arguments to their respective types', () => {
    expect(instance._createDataType({
        type: 'ENUM',
        typeArguments: ['value1', 'value2']
    })).to.eql('fooENUM');
    expect(instance.sequelize.Sequelize.ENUM.callCount).to.eql(1);
    expect(instance.sequelize.Sequelize.ENUM.getCall(0).args).to.eql(['value1', 'value2']);
});

it('generates a data type with attributes', () => {
    expect(instance._createDataType({
        type: 'INTEGER',
        typeArguments: [],
        attributes: ['UNSIGNED']
    })).to.eql('fooINTEGER');
    expect(instance.sequelize.Sequelize.INTEGER.callCount).to.eql(1);
    expect(instance.sequelize.Sequelize.INTEGER.getCall(0).args).to.eql([]);
});

it('throws an error if trying to generate an invalid data type', () => {
    expect(() => {
        instance._createDataType({
            type: 'SOMETHING'
        });
    }).to.throw('Invalid data type -> SOMETHING');
});
