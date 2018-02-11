### Description

A simple wrapper around the Sequelize module to register models and initialise a database.

### Usage

To create a database instance.

```javascript
const dbWrapper = require('sequelize-db-wrapper');
const sampleDbConfig = {
    database: 'test',
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
const db = dbWrapper.createDB('test', sampleDbConfig);
```

To get a database instance.

```javascript
const db = dbWrapper.getDB('test');
```

To register a model.

```javascript
const db = dbWrapper.getDB('test');

db.registerModel('user', {
    name: {
        typeConfig: {
            type: 'STRING',
            typeArguments: [255]
        },
        unique: 'userName'
    },
    occupation: {
        typeConfig: {
            type: 'INTEGER',
            typeArguments: [11]
        },
        required: true
    },
    age: {
        typeConfig: {
            type: 'INTEGER'
        },
        required: true
    },
    status: {
        typeConfig: {
            type: 'ENUM',
            typeArguments: ['foo', 'bar']
        }
    }
});
```

To get a registered model.

```javascript
const db = dbWrapper.getDB('test');

db.getModel('user');
```
