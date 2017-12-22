'use strict';

const metasync = require('metasync');

const api = {};

api.name = 'chat';
api.connections = new Set();
api.files = new Map();

function messager(connection, username, msg, callback) {
  msg = `${username}: ${msg}`;
  api.connections.forEach(conn => {
    if (conn !== connection) {
      conn.emitRemoteEvent(null, 'msg', msg);
    }
  });
  callback(null);
}


function shareFile(connection, name, callback) {
  const data = api.files.get(name);
  connection.emitRemoteEvent(null, 'file', [name, data]);
  console.log('shared', name);
  callback(null);
}


function catchFile(connection, name, data, callback) {
  console.log('cought', name);
  console.log(Object.keys(data).length);
  api.files.set(name, data);
  connection.emitRemoteEvent(null, 'new file', name);
  callback(null);
}

/*
function list(connection, callback) {
  callback(null, api.files);
}
*/

function connectionListener(connection, callback) {
  console.log('incomming connection');
  api.connections.add(connection);
  callback(null);
}


function close(connection, callback) {
  console.log('connection closed');
  api.connections.delete(connection);
  callback(null);
}


api.interfaces = {
  clientInterface: {
    messager,
    shareFile,
    catchFile,
    // list,
    connectionListener,
    close
  }
};

module.exports = api;
