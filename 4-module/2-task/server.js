const url = require('url');
const http = require('http');
const path = require('path');
const {createWriteStream, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const ONE_MEGABYTE_IN_BYTES = 2 ** 20;

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  if (~pathname.indexOf('/')) {
    res.statusCode=400;
    res.end();
    
  }
  switch (req.method) {
    case 'POST':  
        const limitStream = new LimitSizeStream({limit: ONE_MEGABYTE_IN_BYTES});
        const writeStream = createWriteStream(filepath, {flags:'wx'}); 
      
        limitStream.on('error', err => {
          if (err.code =='LIMIT_EXCEEDED') {
          
            res.statusCode = 413;
            unlink(filepath, err => {
              if (err) console.log(err);
             });
            res.end('FAILLURE'); 
            
          }
        });  

        writeStream.once('close', ()=>{
          res.statusCode = 201;
          res.end('SUCCESS');
        });
                
        writeStream.on('error', err => {        
          if (err.code==='EEXIST') 
          { res.statusCode=409 } else  {
            unlink(filepath, err => {
              if (err) console.log(err);
             });  
            res.statusCode=500;
          }
          res.end('FAILLURE');
        });
               
        res.on('close', ()=>{
          if (!res.finished) unlink(filepath, err => {
            if (err) console.log(err);
          });  
        })

        req.pipe(limitStream)
           .pipe(writeStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
