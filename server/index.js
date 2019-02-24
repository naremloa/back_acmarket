require('@babel/polyfill');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const { db } = require('./db');
const api = require('./routes/api/index');

// express初始設置
const app = express();
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'naremloa' }));

// session 設置和連接
const second = 1000;
const hour = 3600 * second;
const sessionName = 'phelomi';
app.use(session({
  name: sessionName,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: db }),
  cookie: {
    maxAge: hour * 24,
    httpOnly: false,
    // resave: false,
  },
}));

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log('interface', req.originalUrl, Date.now());
  next();
});

// api .v1
app.use('/v1/api', api);

// TODO: production
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')));
// 因为是单页应用 所有请求都走/dist/index.html
// app.get('*', (req, res) => {
//   const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
//   res.send(html);
// });

// 監聽端口
const listenPort = 5000;
app.listen(listenPort, () => {
  console.log(`Server started on port ${listenPort}`);
});
