'use strict';

const _ = require('lodash');

const VALID_DATA_TYPES = ['STRING', 'TEXT', 'INTEGER', 'BIGINT',
    'FLOAT', 'DOUBLE', 'DECIMAL', 'DATE', 'BOOLEAN', 'ENUM'
];

class ModelDefiner {
    constructor (_sequelize) {
        this.sequelize = _sequelize;
        this.VALID_DATA_TYPES = VALID_DATA_TYPES;
    }

    _createDataType (_dataTypeConfig) {
        if (this.VALID_DATA_TYPES.indexOf(_dataTypeConfig.type) === -1) {
            throw new Error(`Invalid data type -> ${_dataTypeConfig.type}`);
        }

        const _arguments = _.isNil(_dataTypeConfig.typeArguments) ? [] : _dataTypeConfig.typeArguments;
        const _def = Reflect.apply(this.sequelize.Sequelize[_dataTypeConfig.type], null, _arguments);

        if (_dataTypeConfig.attributes) {
            return _.get(_def, _dataTypeConfig.attributes);
        }

        return _def;
    }

    _createModelDefinition (_modelDefConfig) {
        if (_.has(_modelDefConfig, 'id')) {
            throw new Error('Invalid column -> id is a reserved property');
        }

        const _modelDef = _.cloneDeep(_modelDefConfig);

        _.forEach(_modelDef, _columnConfig => {
            if (_.has(_columnConfig, 'primaryKey')) {
                throw new Error('Invalid column option -> primaryKey is a reserved property');
            }

            _columnConfig.type = this._createDataType(_columnConfig.typeConfig);
            Reflect.deleteProperty(_columnConfig, 'typeConfig');
        });

        _modelDef.id = {
            type: this.sequelize.Sequelize.UUID(),
            defaultValue: this.sequelize.Sequelize.UUIDV4,
            primaryKey: true
        };

        return _modelDef;
    }

    createModel (_modelName, _modelDefConfig) {
        return this.sequelize.define(_modelName, this._createModelDefinition(_modelDefConfig));
    }
}

module.exports = ModelDefiner;
