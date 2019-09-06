const url = require('url');
const http = require('http');
const path = require('path');
const {createReadStream, existsSync} = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  let pathname = url.parse(req.url).pathname.slice(1);
  let readStream;
  let filepath = path.join(__dirname, 'files', pathname);

  if (~pathname.indexOf('/')) {
    res.statusCode=400;
    res.end();
    
  }
    
  if (existsSync(filepath)) {
    readStream = createReadStream(filepath);
    readStream.on('error', err => console.log(err));} 
  else {
    res.statusCode=404;
    res.end();
  }
  
  switch (req.method) {
    case 'GET':
      if (readStream) readStream.pipe(res).on('error', err => {
        console.log(err);
        res.statusCode=500;
        res.end();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
