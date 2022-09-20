const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const template = require('./lib/template');
const sanitizeHtml = require('sanitize-html');
const port = 3000;

const displayPage = (title, body, response, control = '') => {
  fs.readdir('./data', (err, filelist) => {
    const list = template.list(filelist);
    const html = template.html(title, list, body, control);
    response.writeHead(200);
    response.end(html);
  });
};

const getData = async (request) => {
  return new Promise((res, rej) => {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      res((post = new URLSearchParams(body)));
    });
  });
};

const writeFile = async (title, description, response) => {
  fs.promises
    .writeFile(`data/${title}`, description, 'utf-8')
    .then(() => {
      response.writeHead(302, { Location: `/?id=${title}` });
      response.end();
    })
    .catch((err) => {
      throw err;
    });
};

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      const title = 'Welcome';
      const description = 'Hello, Node.js!';
      const body = `<h2>${title}</h2><p>${description}</p>`;
      const control = `<a href='/create'>create</a>`;
      displayPage(title, body, response, control);
    } else {
      const filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        const title = queryData.id;
        const sanitizedTitle = sanitizeHtml(title);
        const sanitizedDescription = sanitizeHtml(description);
        const body = `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`;
        const control = `
          <a href='/create'>create</a> 
          <a href='/update?id=${sanitizedTitle}'>update</a> 
          <form action='delete_process' method='post'>
            <input type='hidden' name='id' value='${sanitizedTitle}'>
            <input type='submit' value='delete'>
          </form> 
        `;
        displayPage(title, body, response, control);
      });
    }
    return;
  }
  if (pathname === '/create') {
    const title = 'WEB - create';
    const form = template.form('create');
    const body = `
      <h2>${title}</h2>
      ${form}
    `;
    displayPage(title, body, response);
    return;
  }
  if (pathname === '/create_process') {
    getData(request).then((post) => {
      const title = post.get('title');
      const description = post.get('description');
      writeFile(title, description, response);
    });
    return;
  }
  if (pathname === '/update') {
    const filteredId = path.parse(queryData.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      const title = queryData.id;
      const form = template.form('update', title, description);
      const body = `
        <h2>${title} - update</h2>
        ${form}
      `;
      displayPage(title, body, response);
    });
    return;
  }
  if (pathname === '/update_process') {
    getData(request).then((post) => {
      const id = post.get('id');
      const title = post.get('title');
      const description = post.get('description');
      fs.promises
        .rename(`data/${id}`, `data/${title}`)
        .then(() => {
          writeFile(title, description, response);
        })
        .catch((err) => {
          throw err;
        });
    });
    return;
  }
  if (pathname === '/delete_process') {
    getData(request).then((post) => {
      const id = post.get('id');
      const filteredId = path.parse(id).base;
      fs.promises
        .unlink(`data/${filteredId}`)
        .then(() => {
          response.writeHead(302, { Location: '/' });
          response.end();
        })
        .catch((err) => {
          throw err;
        });
    });
    return;
  }
  if (pathname !== '/') {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
});
app.listen(port);
