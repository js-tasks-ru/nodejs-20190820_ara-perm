const url = require('url');
const http = require('http');
const path = require('path');
const {createWriteStream, existsSync, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const ONE_MEGABYTE_IN_BYTES = 2 ** 20;

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  switch (req.method) {
    case 'POST':  
        let limitStream = new LimitSizeStream({limit: ONE_MEGABYTE_IN_BYTES});
        const writeStream = createWriteStream(filepath); 
        req.pipe(limitStream)
           .pipe(writeStream)
       
      
        limitStream.on('error', err => {
          if (err.code =='LIMIT_EXCEEDED') {
          
            res.statusCode = 413;
            res.end("FAILLURE"); 
          }
        });         
         
        writeStream.on('finish',()=>{
          res.statusCode = 201;
          res.end("SUCCESS ");
        });
              

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
