const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;

const templateHTML = (title, list, body, control) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WEB1 - ${title}</title>
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    <ul>${list}</ul>
    ${control}
    ${body}
    </body>
    </html>
  `;
};

const templateList = (filelist) => {
  let list = '';
  for (let i = 0; i < filelist.length; i++) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }
  return list;
};

const templateForm = (process, title = '', description = '') => {
  return `
    <form action='/${process}_process' method='post'>
      <input type='hidden' name='id' value=${title} />
      <label>title</label>
      <div><input type='text' name='title' value=${title} /></div>
      <label>description</label>
      <div><textarea name='description'>${description}</textarea></div>
      <div><button>submit</button></div>
    </form>
  `;
};

const displayPage = (title, body, response, control = '') => {
  fs.readdir('./data', (err, filelist) => {
    const list = templateList(filelist);
    const template = templateHTML(title, list, body, control);
    response.writeHead(200);
    response.end(template);
  });
};

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  console.log(pathname !== '/');

  if (pathname === '/') {
    if (queryData.id === undefined) {
      const title = 'Welcome';
      const description = 'Hello, Node.js!';
      const body = `<h2>${title}</h2><p>${description}</p>`;
      const control = `<a href='/create'>create</a>`;
      displayPage(title, body, response, control);
    } else {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        const title = queryData.id;
        const body = `<h2>${title}</h2><p>${description}</p>`;
        const control = `<a href='/create'>create</a> <a href='/update?id=${title}'>update</a> `;
        displayPage(title, body, response, control);
      });
    }
    return;
  }
  if (pathname === '/create') {
    const title = 'WEB - create';
    const form = templateForm('create');
    const body = `
      <h2>${title}</h2>
      ${form}
    `;
    displayPage(title, body, response);
    return;
  }
  if (pathname === '/create_process') {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = new URLSearchParams(body);
      const title = post.get('title');
      const description = post.get('description');
      fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
    return;
  }
  if (pathname === '/update') {
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
      const title = queryData.id;
      const form = templateForm('update', title, description);
      const body = `
        <h2>${title} - update</h2>
        ${form}
      `;
      displayPage(title, body, response);
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
