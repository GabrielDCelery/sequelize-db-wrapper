'use strict';

let ModelDefiner = require('../../src/ModelDefiner');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('creates a default instance', () => {
    ModelDefiner = sandbox.spy(ModelDefiner);

    const instance = new ModelDefiner('foo');

    expect(ModelDefiner.callCount).to.eql(1);
    expect(instance.sequelize).to.eql('foo');
    expect(instance.VALID_DATA_TYPES).to.eql(['STRING', 'TEXT', 'INTEGER',
        'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'DATE', 'BOOLEAN', 'ENUM'
    ]);
});
