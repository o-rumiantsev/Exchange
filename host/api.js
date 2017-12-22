'use strict';

const metasync = require('metasync');

const api = {};

api.name = 'chat';
api.connections = new Set();


function messager(connection, username, msg, callback) {
  msg = `${username}: ${msg}`;
  api.connections.forEach(conn => {
    if (conn !== connection) {
      conn.emitRemoteEvent(
        'clientInterface', 'msg', msg
      );
    }
  });
  callback(null);
}


function catchFile(connection, name, data, callback) {
  console.log('cought', name);
  const file = [name, data];

  api.connections.forEach(conn => {
    conn.emitRemoteEvent('clientInterface', 'file', file)
  });

  callback(null);
}


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
    connectionListener,
    catchFile,
    close
  }
};

module.exports = api;
