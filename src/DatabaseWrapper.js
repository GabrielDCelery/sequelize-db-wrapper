'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const ModelDefiner = require('./ModelDefiner');
const ModelAssociator = require('./ModelAssociator');

const OPERATORS_ALIASES = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

const DEFAULT_DB_CONFIG = {
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

class DatabaseWrapper {
    constructor (_dbConfig) {
        this.synchronized = false;
        this.config = _.defaultsDeep({}, _dbConfig, DEFAULT_DB_CONFIG);
        this.sequelize = new Sequelize(this.config.database,
            this.config.username, this.config.password, {
                operatorsAliases: OPERATORS_ALIASES,
                host: this.config.host,
                dialect: this.config.dialect,
                pool: this.config.pool
            });
        this.modelDefiner = new ModelDefiner(this.sequelize);
        this.modelAssociator = new ModelAssociator();
        this.models = {};
    }

    registerModel (_modelNamePath, _modelDefConfig) {
        if (_.get(this.models, _modelNamePath) !== undefined) {
            throw new Error(`Tried to register model twice -> ${_modelNamePath}`);
        }

        const _model = this.modelDefiner.createModel(_.last(_.split(_modelNamePath, '.')), _modelDefConfig);

        _.set(this.models, _modelNamePath, _model);
    }

    getModel (_modelNamePath) {
        const _model = _.get(this.models, _modelNamePath);

        if (_model === undefined) {
            throw new Error(`Model does not exist -> ${_modelNamePath}`);
        }

        return _model;
    }

    registerModelAssociation (_associationType, _sourceModelName, _targetModelName) {
        const _sourceModel = this.getModel(_sourceModelName);
        const _targetModel = this.getModel(_targetModelName);

        return this.modelAssociator.registerAssociation(_associationType, _sourceModel, _targetModel);
    }

    syncDB (_bForce) {
        if (this.synchronized === true && _bForce !== true) {
            return Promise.reject(new Error('Tried to initialize database twice'));
        }

        const _options = {};

        if (_bForce === true) {
            _options.force = true;
        }

        return this.sequelize.sync(_options)
            .then(() => {
                this.synchronized = true;

                return true;
            });
    }
}

module.exports = DatabaseWrapper;
