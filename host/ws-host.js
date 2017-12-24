'use strict';

const fs = require('fs');
const http = require('http');
const WebSocketServer = require('websocket').server;

const index = fs.readFileSync('../src/index.html');
const mindex = fs.readFileSync('../src/mindex.html');
const style = fs.readFileSync('../src/style.css');
const mstyle = fs.readFileSync('../src/mstyle.css');
const script = fs.readFileSync('../src/script.js');

const server = http.createServer((req, res) => {
  if (isMobile(req)) {
    switch (req.url) {
      case '/mstyle.css':
        res.writeHead(200);
        res.end(mstyle);
      break;
      case '/script.js':
        res.writeHead(200);
        res.end(script);
      break;
      default:
        res.writeHead(200);
        res.end(mindex);
    }
  } else {
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
  }
});

server.listen(80, '0.0.0.0');

const ws = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

const connections = [];
const history = [];

function isMobile(req) {
  const mobile = req.headers['user-agent'].includes('Mobile');;
  return mobile;
}

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
    if (connections.length === 0) history.splice();
  })
});
