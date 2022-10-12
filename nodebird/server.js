const app = require('./app');

app.listen(app.get('port'), () => {
  console.log(app.get('port'), `번에서 대기 중`);
});
