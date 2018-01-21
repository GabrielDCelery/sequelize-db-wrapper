'use strict';

let DatabaseWrapper = require('../../src/DatabaseWrapper');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('synchronizes the database', () => {
    const instance = new DatabaseWrapper();

    const syncSpy = sandbox.spy(instance.sequelize, 'sync');

    return instance.syncDB()
        .then(() => {
            expect(instance.synchronized).to.eql(true);
            expect(syncSpy.callCount).to.eql(1);
            expect(syncSpy.getCall(0).args).to.eql([{}]);
        });
});

it('throws an error if database is already synchronized', () => {
    const instance = new DatabaseWrapper();

    instance.synchronized = true;

    expect(instance.syncDB()).to.eventually.be.rejectedWith('Tried to initialize database twice');
});

it('re-syncs an already synchronized database if the _bForce flag is set', () => {
    const instance = new DatabaseWrapper();

    instance.synchronized = true;

    expect(instance.syncDB(true)).to.eventually.eql(true);
});
