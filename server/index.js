const express = require('express');
const next = require('next');

const routes = require('./routes/index.js');
const { weather } = require('../utils');
require('dotenv').config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// Set here weather auth config.

app.prepare().then(() => {
  const server = express();
  server.use('/api', routes);
  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    weather.setAuth({ app_code: process.env.APP_CODE, app_id: process.env.APP_ID });

    console.log(`> Ready on http://localhost:${port}`);
  });
});
