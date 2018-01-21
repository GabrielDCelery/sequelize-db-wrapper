'use strict';

let BaseController = require('../../src/BaseController');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

it('finds multiple records in the database', () => {
    const instance = new BaseController('foo');

    instance.model = {
        findAll: sinon.stub().resolves('record')
    };

    return instance.findAll({
        where: 'foo',
        attributes: ['bar']
    })
        .then(_record => {
            expect(_record).to.eql('record');
            expect(instance.model.findAll.callCount).to.eql(1);
            expect(instance.model.findAll.getCall(0).args).to.eql([{
                where: 'foo',
                attributes: ['bar']
            }]);
        });
});

it('appends a transaction to the query', () => {
    const instance = new BaseController('foo');

    instance.model = {
        findAll: sinon.stub().resolves('record')
    };

    return instance.findAll({
        where: 'foo',
        attributes: ['bar']
    }, 'ted')
        .then(_record => {
            expect(_record).to.eql('record');
            expect(instance.model.findAll.callCount).to.eql(1);
            expect(instance.model.findAll.getCall(0).args).to.eql([{
                where: 'foo',
                attributes: ['bar'],
                transaction: 'ted'
            }]);
        });
});
