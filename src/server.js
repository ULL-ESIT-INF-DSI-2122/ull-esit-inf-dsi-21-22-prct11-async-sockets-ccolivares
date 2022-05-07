"use strict";
exports.__esModule = true;
var net = require("net");
var notes_gestor_1 = require("./notes_gestor");
var chalk = require("chalk");
var message_event_emitter_1 = require("./message_event_emitter");
/**
 * Servidor
 */
var server = net.createServer({ allowHalfOpen: true }, function (connection) {
    console.log(chalk.blue('Un cliente se ha conectado!'));
    var socket = new message_event_emitter_1.MessageEventEmitter(connection);
    socket.on('message', function (message) {
        console.log(chalk.blue('La solicitud del cliente ha sido recibida'));
        var result = '';
        var note = new notes_gestor_1.notesGestor();
        switch (message.type) {
            case 'add':
                result = note.addNote(message.user, message.title, message.body, message.color);
                break;
            case 'modify':
                result = note.modifyNote(message.user, message.title, message.body, message.color);
                break;
            case 'delete':
                result = note.deleteNote(message.user, message.title);
                break;
            case 'read':
                result = note.readNote(message.user, message.title);
                break;
            case 'list':
                result = note.listNotes(message.user);
                break;
        }
        var response = {
            message: result
        };
        connection.write(JSON.stringify(response), function (err) {
            if (err) {
                console.log(chalk.bgRed.white("La respuesta no pudo ser enviada al cliente"));
            }
            else {
                console.log(chalk.bgGreen.white("Se ha enviado una respuesta satisfactoriamente"));
            }
            connection.end();
        });
    });
    connection.on('error', function (err) {
        if (err) {
            console.log(chalk.bgRed.white('No se ha podido realizar la conexión'));
        }
    });
    connection.on('close', function () {
        console.log(chalk.blue('Un cliente se ha desconectado'));
    });
});
server.listen(60300, function () {
    console.log(chalk.blue('Esperando conexiones...'));
});
