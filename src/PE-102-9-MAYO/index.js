"use strict";
exports.__esModule = true;
//import * as express from 'express';
var path_1 = require("path");
var docommand_1 = require("./docommand");
var express = require('express');
/**
 * Servidor Web express
 */
var app = express();
app.use(express.static((0, path_1.join)(__dirname, '../public')));
app.get('/execmd', function (req, res) {
    if (!req.query.cmd || !req.query.args) {
        res.send('<h1>ERROR 404</h1>');
    }
    else {
        (0, docommand_1.doCommand)(req.query.cmd, req.query.args, function (err, data) {
            if (err) {
                res.send('<h1>ERROR. No se ha podido realizar la acción</h1>');
            }
            else {
                res.send({
                    result: data
                });
            }
        });
    }
});
app.listen(3000, function () {
    console.log('Server is up on port 3000');
});
