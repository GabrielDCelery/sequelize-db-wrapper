'use strict';

const DatabaseWrapper = require('./src/DatabaseWrapper');

const instances = {};

function createDB (_dbName = 'default', _config = {}) {
    if (instances[_dbName]) {
        throw new Error(`Database ${_dbName} already exists!`);
    }

    instances[_dbName] = new DatabaseWrapper(_config);

    return instances[_dbName];
}

function getDB (_dbName = 'default') {
    if (!instances[_dbName]) {
        throw new Error(`Database ${_dbName} does not exist!`);
    }

    return instances[_dbName];
}

module.exports = {
    createDB: createDB,
    getDB: getDB
};
