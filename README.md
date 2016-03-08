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

**This is required**, because when the `load` function will try to require the Models the instance of Sequelize will be injected in your models.  

## Examples
You can see **k7** and **k7-sequelize** in action in the repo: [Cart][cart]. 

## Testing
For testing you just need clone this repo and run `npm install && npm test` inside root folder of this project.; 

[cart]:https://github.com/thebergamo/cart
[sequelize]: http://sequelize.readthedocs.org/en/latest/
