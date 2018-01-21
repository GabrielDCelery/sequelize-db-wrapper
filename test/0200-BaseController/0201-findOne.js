'use strict';

let BaseController = require('../../src/BaseController');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('finds a record in the database', () => {
    const instance = new BaseController('foo');

    instance.model = {
        findOne: sinon.stub().resolves('record')
    };

    return instance.findOne({
        where: 'foo',
        attributes: ['bar']
    })
        .then(_record => {
            expect(_record).to.eql('record');
            expect(instance.model.findOne.callCount).to.eql(1);
            expect(instance.model.findOne.getCall(0).args).to.eql([{
                where: 'foo',
                attributes: ['bar']
            }]);
        });
});

it('appends a transaction to the query', () => {
    const instance = new BaseController('foo');

    instance.model = {
        findOne: sinon.stub().resolves('record')
    };

    return instance.findOne({
        where: 'foo',
        attributes: ['bar']
    }, 'ted')
        .then(_record => {
            expect(_record).to.eql('record');
            expect(instance.model.findOne.callCount).to.eql(1);
            expect(instance.model.findOne.getCall(0).args).to.eql([{
                where: 'foo',
                attributes: ['bar'],
                transaction: 'ted'
            }]);
        });
});
