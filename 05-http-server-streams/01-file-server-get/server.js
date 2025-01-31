const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      {
        if (pathname.indexOf('/') !== -1) {
          res.statusCode = 400;
          res.end('Incorrect filename: "' + pathname + '"!');
          break;
        }

        let fileStream = fs.ReadStream(filepath);

        fileStream.on('error', function() {
          res.statusCode = 404;
          res.end('The file "/' + pathname + '" was not found!');
        });

        fileStream.pipe(res);

        res.on('close', function () {
          fileStream.destroy();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
