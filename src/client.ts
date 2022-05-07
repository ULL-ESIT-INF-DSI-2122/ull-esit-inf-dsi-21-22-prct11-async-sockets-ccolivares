import * as net from 'net';
import { RequestType, ResponseType } from './types';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import { MessageEventEmitter } from './message_event_emitter';

const socket = net.connect({port: 60300});
const client = new MessageEventEmitter(socket);

let request: RequestType = {
  type: 'read',
  user: '',
};

/**
 * Comando: Añadir una nota
 */
yargs.command({
  command: 'add',
  describe: 'Añade una nueva nota',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string'
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string'
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && 
        typeof argv.body === 'string' && typeof argv.color === 'string') {
      request = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
    }
  },
});

/**
* Comando para modificar una nota por terminal.
* Se pasan por parametro en terminal, el usuario, el titulo, el cuerpo y color.
*/
yargs.command({
  command: 'modify',
  describe: 'Modifica una nueva nota',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string'
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string'
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && 
        typeof argv.body === 'string' && typeof argv.color === 'string') {
      request = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
    }
  },
});

/**
* Comando para eliminar una nota de un usuario por terminal
* se pasan por parametro en terminal el usuario y el titulo
*/
yargs.command({
  command: 'delete',
  describe: 'Eliminar la nota de un usuario',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      request = {
        type: 'delete',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
* Comando para leer una nota de un usuario por terminal.
* Se pasan por parametro en terminal, el usuario y el titulo.
*/
yargs.command({
  command: 'read',
  describe: 'Lee la nota de un usuario',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      request = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
* Comando para listar las notas de un usuario por terminal.
* Se pasan por parametro en terminal, el usuario.
*/
yargs.command({
  command: 'list',
  describe: 'Lista las notas de un usuario',
  builder: {
    user: {
      describe: 'Usuario de la notas',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      request = {
        type: 'list',
        user: argv.user,
      };
    }
  },
});

yargs.parse();

socket.write(JSON.stringify(request), (err) => {
  if(err)
    console.log(chalk.bgRed.white(`No se ha podido realizar la solicitud`));
  else {
    console.log(chalk.bgGreen.white(`Se ha enviado la solicitud`));
  }
  socket.end();
});

client.on('message', (message) => {
  console.log(message.message);
});

client.on('error', (err) => {
  console.log(chalk.bgRed.white('No se ha podido realizar la conexión'));
});