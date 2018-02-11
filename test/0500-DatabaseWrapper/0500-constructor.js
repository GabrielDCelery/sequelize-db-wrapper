'use strict';

let DatabaseWrapper = require('../../src/DatabaseWrapper');
const ModelDefiner = require('../../src/ModelDefiner');
const Sequelize = require('sequelize');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('creates a default instance', () => {
    DatabaseWrapper = sandbox.spy(DatabaseWrapper);

    const instance = new DatabaseWrapper();

    const DB_OPTIONS = {
        database: null,
        username: 'root',
        password: null,
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    };

    expect(DatabaseWrapper.callCount).to.eql(1);
    expect(instance.synchronized).to.eql(false);
    expect(instance.modelDefiner).to.be.an.instanceof(ModelDefiner);
    expect(instance.models).to.eql({});
    expect(instance.config).to.eql(DB_OPTIONS);
    expect(instance.sequelize).to.be.an.instanceof(Sequelize);
});
