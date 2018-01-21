'use strict';

class BaseController {
    constructor (_model) {
        this.model = _model;
    }

    findOne (_query, _transaction) {
        if (_transaction) {
            _query.transaction = _transaction;
        }

        return this.model.findOne(_query);
    }

    findAll (_query, _transaction) {
        if (_transaction) {
            _query.transaction = _transaction;
        }

        return this.model.findAll(_query);
    }
}

module.exports = BaseController;
