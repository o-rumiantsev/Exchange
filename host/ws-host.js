'use strict';

const fs = require('fs');
const http = require('http');
const WebSocketServer = require('websocket').server;

const index = fs.readFileSync('../src/index.html');
const style = fs.readFileSync('../src/style.css');
const script = fs.readFileSync('../src/script.js');

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/style.css':
      res.writeHead(200);
      res.end(style);
    break;
    case '/script.js':
      res.writeHead(200);
      res.end(script);
    break;
    default:
      res.writeHead(200);
      res.end(index);
  }
});

server.listen(80, '192.168.43.44');

const ws = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

const connections = [];
const history = [];

ws.on('request', (req) => {

  const connection = req.accept('', req.origin);
  connections.push(connection);
  console.log('Conndected', connection.remoteAddress);

  for (const msg of history) connection.send(msg);

  connection.on('message', (message) => {
    const dataType = message.type + 'Data';
    const data = message[dataType];
    history.push(data);
    connections.forEach((conn) => {
      if (conn !== connection) {
        conn.send(data);
      }
    });
  });

  connection.on('close', () => {
    console.log('Disconndected', connection.remoteAddress);
  })
});
