//import * as express from 'express';
import { join } from 'path';
import { doCommand } from './docommand';
const express = require('express');

/**
 * Servidor Web express
 */
const app = express();

app.use(express.static(join(__dirname, '../public')));

app.get('/execmd', (req, res) => {
  if (!req.query.cmd || !req.query.args) {
    res.send('<h1>ERROR 404</h1>');
  } else {
    doCommand(req.query.cmd as string, req.query.args as string, (err, data) => {
      if (err) {
        res.send('<h1>ERROR. No se ha podido realizar la acción</h1>');
      } else {
        res.send({
          result: data,
        });
      }
    });
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

