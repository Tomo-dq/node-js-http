'use strict';
const http = require('http');
const pug = require('pug');
const auth = require('http-auth');
const basic = auth.basic(
  { realm: 'Enquetes Area.'},
  (username, password, callback) => {
    callback(username === 'guest' && password === '12345');
  });
const server = http.createServer(basic, (req, res) => {
  console.info(
    'Requested by ' + req.connection.remoteAddress
  );

  if (req.url === '/logout') {
    res.writeHead(401, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('ログアウトしました');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  
  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピザ'
        }));
      }
      res.end();
      break;
    case 'POST':
      let rawDate = '';
      req.on('data', chunk => {
        rawDate += chunk;
      }).on('end', () => {
        const qs = require('querystring');
        const decoded = decodeURIComponent(rawDate);
        const answer = qs.parse(decoded);
        console.info('投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          answer['name'] + 'さんは' + answer['favorite'] + 'に投票しました</h1></body></html>'
        );
        res.end();
      });
      break;
    case 'DELETE':
      res.write('DELETE ' + req.url);
      break;
    default:
      break;
  }
  })
  .on('error',e => {
    console.error('Server Error', e);
  })
  .on('clientError',e => {
    console.error('Client Error', e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('Listening on ' + port);
});