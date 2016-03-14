k7-sequelize
===
k7 adapter for sequelize ORM

[![Build Status](https://travis-ci.org/thebergamo/k7-sequelize.svg)](https://travis-ci.org/thebergamo/k7-sequelize)
[![Dependencies Status](https://david-dm.org/thebergamo/k7-sequelize.svg)](https://david-dm.org/thebergamo/k7-sequelize)
[![DevDependencies Status](https://david-dm.org/thebergamo/k7-sequelize/dev-status.svg)](https://david-dm.org/thebergamo/k7-sequelize#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/npm/k7-sequelize/badge.svg)](https://snyk.io/test/npm/k7-sequelize)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

K7-Sequelize is an Adapter for using Sequelize (SQL ORM) in Hapi by K7 connector

## Usage

For example: 

```javascript
const Hapi = require('hapi');
const Server = new Hapi.Server();

Server.connection({host: 'localhost'});

let options = {
    adapter: require('k7-sequelize'),
    connectionString: 'postgresql://k7:k7@localhost:5432/K7Sequelize'
};

Server.register({
    register: require('k7'),
    options: options
}, (err) => {
    if (err) {
        throw err;
    }
    
    Server.start((err) => {
        if (err) {
            throw err;
        }
        
        Server.log('info', 'Server running at: ' + Server.info.uri);
    });
});
```

This example does: 
1. Setting the k7-sequelize adapter
2. Setting the connectionString for sequelize connect (postgre)
3. Register the k7 to Hapi.js

## Options
All the options available in [Sequelize][sequelize] can be setted in `connectionOptions`. You can see more about that in [tests](test/index.js).

## Models
For defining your models you will need folowing this example:
```javascript
module.exports = (sequelize, DataType) => {
  return sequelize.define('User', {});
};
```

##About Migrations
When you want to run migrations with sequelize, we strong recomend using Umzug and you can do that like this:
```javascript
const Umzug = require('umzug');
const K7Sequelize = require('k7-sequelize');
const k7 = new K7Sequelize();
const Sequelize = k7.db.Sequelize;

const config = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cart',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres'
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

let db = {sequelize, Sequelize};
// Instantiate Umzug
let options = {
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'MigrationSchema',
    tableName: 'migration_table'
  },
  logging: false,   // TODO: Create new logger to migration function receive a message parameter.
  upName: 'up',
  downName: 'down',
  migrations: {
    params: [db],
    path: 'migrations',
    pattern: /(migrations.js)$/
  }
};

const umzug = new Umzug(options);

const type = process.argv[2];
run(type);

function run (type) {
  type = type === 'down' ? 'down' : 'up';

  return umzug[type]()
    .then((migrations) => {
      migrations.map((migration) => {
        console.log('Executed ' + type.toUpperCase() + ': ', migration.file);
      });
    })
    .then(() => {
      console.log('Migration Success');
      process.exit();
    })
    .catch((err) => {
      console.log('Error executing migrations: ', err);
      process.exit(1);
    });
}
```

**This is required**, because when the `load` function will try to require the Models the instance of Sequelize will be injected in your models.  

## Examples
You can see **k7** and **k7-sequelize** in action in the repo: [Cart][cart]. 

## Testing
For testing you just need clone this repo and run `npm install && npm test` inside root folder of this project.; 

[cart]:https://github.com/thebergamo/cart
[sequelize]: http://sequelize.readthedocs.org/en/latest/
