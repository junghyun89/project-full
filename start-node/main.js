const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;

const templateHTML = (title, list, body) => {
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
    <a href='/create'>create</a>
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

const displayPage = (title, body, response) => {
  fs.readdir('./data', (err, filelist) => {
    const list = templateList(filelist);
    const template = templateHTML(title, list, body);
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
      displayPage(title, body, response);
    } else {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        const title = queryData.id;
        const body = `<h2>${title}</h2><p>${description}</p>`;
        displayPage(title, body, response);
      });
    }
    return;
  }
  if (pathname === '/create') {
    const title = 'WEB - create';
    const body = `
      <h2>${title}</h2>
      <form action='http://localhost:${port}/create_process' method='post'>
        <div><input type='text' name='title' placeholder='title' /></div>
        <div><textarea name='description' placeholder='description'></textarea></div>
        <div><button>submit</button></div>
      </form>
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
  if (pathname !== '/') {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
});
app.listen(port);
