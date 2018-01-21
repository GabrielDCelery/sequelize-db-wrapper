'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');

class ModelAssociator {
    _registerOneToOneAssociation (_sourceModel, _targetModel) {
        _sourceModel.hasOne(_targetModel, {
            foreignKey: `${_sourceModel.name}Id`,
            sourceKey: 'id'
        });

        _targetModel.belongsTo(_sourceModel, {
            foreignKey: `${_sourceModel.name}Id`,
            targetKey: 'id'
        });
    }

    _registerOneToManyAssociation (_sourceModel, _targetModel) {
        _sourceModel.hasMany(_targetModel, {
            foreignKey: `${_sourceModel.name}Id`,
            sourceKey: 'id'
        });

        _targetModel.belongsTo(_sourceModel, {
            foreignKey: `${_sourceModel.name}Id`,
            targetKey: 'id'
        });
    }

    _registerManyToManyAssociation (_sourceModel, _targetModel) {
        _sourceModel.belongsToMany(_targetModel, {
            through: pluralize(`${_sourceModel.name}${_.upperFirst(_targetModel.name)}`),
            foreignKey: `${_sourceModel.name}Id`
        });

        _targetModel.belongsToMany(_sourceModel, {
            through: pluralize(`${_sourceModel.name}${_.upperFirst(_targetModel.name)}`),
            foreignKey: `${_targetModel.name}Id`
        });
    }

    registerAssociation (_associationType, _sourceModel, _targetModel) {
        const _methodToCall = `_register${_.upperFirst(_associationType)}Association`;

        return this[_methodToCall](_sourceModel, _targetModel);
    }
}

module.exports = ModelAssociator;
