const { createMachine } = require('@xmachina/message');
const http = require('http');
const { PORT = 3000 } = process.env;
const util = require('util');

http.createServer(async (req, res) => {
  let body = '';

  req.on('data', (data) => {
    body += data;
  });

  req.on('end', async () => {
    try {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: 'Hello, AWS!'}));
    } catch (error) {
      console.log(error);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(error));
    }
    res.end();
  });
  
}).listen(PORT);