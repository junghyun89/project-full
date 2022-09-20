module.exports = {
  html: function (title, list, body, control) {
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
  },
  list: function (filelist) {
    let list = '';
    for (let i = 0; i < filelist.length; i++) {
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    return list;
  },
  form: function (process, title = '', description = '') {
    return `
    <form action='/${process}_process' method='post'>
      <input type='hidden' name='id' value=${title} />
      <label for='text'>title</label>
      <div><input type='text' id='text' name='title' value=${title}></div>
      <label for='description'>description</label>
      <div><textarea name='description' id='description'>${description}</textarea></div>
      <div><button>submit</button></div>
    </form>
  `;
  },
};
