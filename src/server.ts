import * as net from 'net';
import { notesGestor } from './notes_gestor';
import { RequestType, ResponseType } from './types';
import * as chalk from 'chalk';
import { MessageEventEmitter } from './message_event_emitter';

/**
 * Servidor
 */
const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log(chalk.blue('Un cliente se ha conectado!'));

  const socket = new MessageEventEmitter(connection);

  socket.on('message', (message) => {
    console.log(chalk.blue('La solicitud del cliente ha sido recibida'));
    
    let result: string = '';
    let note = new notesGestor();

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

    let response: ResponseType = {
      message: result,
    }

    connection.write(JSON.stringify(response), (err) => {
      if (err) {
        console.log(chalk.bgRed.white(`La respuesta no pudo ser enviada al cliente`));
      } else {
        console.log(chalk.bgGreen.white(`Se ha enviado una respuesta satisfactoriamente`));
      }
      connection.end();
    });
  });

  connection.on('error', (err) => {
    if (err) {
      console.log(chalk.bgRed.white('No se ha podido realizar la conexión'));
    }
  });

  connection.on('close', () => {
    console.log(chalk.blue('Un cliente se ha desconectado'));
  });
});

server.listen(60300, () => {
  console.log(chalk.blue('Esperando conexiones...'))
});