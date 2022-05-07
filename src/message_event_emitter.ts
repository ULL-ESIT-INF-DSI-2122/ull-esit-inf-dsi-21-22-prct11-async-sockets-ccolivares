import { EventEmitter } from 'events';

export class MessageEventEmitter extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let data = '';
    connection.on('data', (chunk) => {
      data += chunk;
    });

    connection.on('end', () => {
      const message = JSON.parse(data.toString());
      this.emit('message', message);
    });
  }   
}