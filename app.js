// http module for creating a server
const http = require('http');
// filesystem module for reading from and writing to a file
const fs = require('fs');
// for processing post request body
const qs = require('querystring');

// create a server object
const server = http.createServer((req, res) => {
  console.log(`new ${req.method} request..`);

  if (req.url === '/') {
    res.write('Hello world'); // write a response to the client
    res.end(); // end the response
  }

  if (req.url === '/api/category' && req.method === 'POST') {
    let body = ''
    req.on('data', (data) => {
      body += data;

      // if the size of the data is more that 1MB, kill the connection!
      if (body.length > 1e6) {
        req.connection.destroy();
      }

      req.on('end', () => {
        let post = qs.parse(body);
        const name = post.name;
        const budget = post.budget;
        console.log(name,budget)
      })
    });
  }

  if(req.url === '/api/category/all') {
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

server.listen(3001);
console.log('listening on port 3001');

// EXPRESS IS BUILT ON NODE.JS HTTP MODULE