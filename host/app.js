'use strict';

const jstp = require('metarhia-jstp');
const api = require('./api.js');

const app = new jstp.Application(api.name, api.interfaces);

module.exports = app;
