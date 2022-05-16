"use strict";
exports.__esModule = true;
exports.doCommand = void 0;
var child_process_1 = require("child_process");
/**
 * Realizar comandos
 * @param cmd comando
 * @param args argumentos
 * @param cb callback
 */
var doCommand = function (cmd, args, cb) {
    var command_data = (0, child_process_1.spawn)(cmd, [args]);
    var result = '';
    command_data.on('error', function (err) {
        cb(err.message, undefined);
    });
    command_data.on('data', function (data) {
        result = data.toString();
    });
    var response = {
        result: result
    };
    cb(undefined, response);
};
exports.doCommand = doCommand;
