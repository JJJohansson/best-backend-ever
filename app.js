// http module for creating a server
const http = require('http');
// filesystem module for reading from and writing to a file
const fs = require('fs');

// create a server object
const server = http.createServer((req, res) => {
  console.log(req.method);

  if(req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('POST features coming soon...');
    res.end();
  }

  if (req.url === '/') {
    res.write('Hello world'); // write a response to the client
    res.end(); // end the response
  }

  if(req.url === '/api/categories') {
    fs.readFile('data.json', (err, data) => {
      if (err) {
        
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.write('LOL ERROR');
        res.end();
      }

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(data);
      res.end();
    });
  }
});

// CHECK OUT DOCUMENTATION
server.on('connection', (socket) => {
  console.log('new connection..');
});

server.listen(3001);
console.log('listening on port 3001');

// EXPRESS IS BUILT ON NODE.JS HTTP MODULE