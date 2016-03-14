'use strict';

// Load modules

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Path = require('path');

// Load example

const K7Sequelize = require('../lib');
const url = require('url');

// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;
const describe = lab.describe;
const before = lab.before;

describe('K7Sequelize', () => {
  let options = {
    connectionString: buildUri(),
    models: 'test/models/*.js',
    adapter: K7Sequelize,
    connectionOptions: {
      options: {
        dialect: 'postgres'
      }
    }
  };

  describe('when a plugin is registrated', () => {
    let server = new Hapi.Server();
    let error;
    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('sequelize');
      expect(server.database).to.deep.include('Sequelize');
      expect(server.database).to.deep.include('User');
      done();
    });

    it('should database is connected', (done) => {
      server.database.sequelize.authenticate()
      .then((errors) => {
        // No error

        expect(errors).to.not.exist;
        done();
      });
    });
  });

  describe('when a plugin is registrated with an array of models in options', () => {
    let server = new Hapi.Server();
    let error;
    options.models = ['test/models/user.js'];
    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('sequelize');
      expect(server.database).to.deep.include('Sequelize');
      expect(server.database).to.deep.include('User');
      done();
    });

    it('should database is connected', (done) => {
      server.database.sequelize.authenticate()
      .then((errors) => {
        // No error

        expect(errors).to.not.exist;
        done();
      });
    });
  });

  describe('when a plugin is registrated with adapter as string', () => {
    let server = new Hapi.Server();
    let error;

    options.adapter = Path.join(process.cwd(), './lib');

    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('sequelize');
      expect(server.database).to.deep.include('Sequelize');
      expect(server.database).to.deep.include('User');
      done();
    });

    it('should database is connected', (done) => {
      server.database.sequelize.authenticate()
      .then((errors) => {
        // No error

        expect(errors).to.not.exist;
        done();
      });
    });
  });

  describe('when a plugin is registrated and query the model', () => {
    let server = new Hapi.Server();
    let error;

    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    before((done) => {
      server.database.User.sync()
      .then(() => done());
    });

    it('should have an empty array quering user', (done) => {
      server.database.User.findAll({})
        .then((rows) => {
          expect(rows).to.be.an.array();
          expect(rows).to.be.empty();

          // No error

          expect(error).to.not.exist;

          done();
        });
    });

    it('should database is connected', (done) => {
      server.database.sequelize.authenticate()
      .then((errors) => {
        // No error

        expect(errors).to.not.exist;
        done();
      });
    });

    it('should have object Sequelize', (done) => {
      const k7 = new K7Sequelize();

      expect(k7.db).to.contain('Sequelize');
      done();
    });
  });
});

function buildUri () {
  let username = process.env.DB_USERNAME || 'postgres';
  let password = process.env.DB_PASSWORD || 'postgres';
  return url.format({
    protocol: 'postgresql',
    slashes: true,
    auth: username + ':' + password,
    port: process.env.DB_PORT || 5434,
    hostname: process.env.DB_HOST || 'localhost',
    pathname: process.env.DB_NAME || 'project'
  });
}
