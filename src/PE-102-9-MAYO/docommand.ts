import { ResponseType } from './types';
import { spawn } from 'child_process';
import { cp } from 'fs';

/**
 * Realizar comandos
 * @param cmd comando
 * @param args argumentos
 * @param cb callback
 */
export const doCommand = (cmd: string, args: string, cb: (err: string | undefined, 
                          res: ResponseType | undefined) => void) => {

  const command_data = spawn(cmd, [args]);
  let result: string = '';

  command_data.on('error', (err) => {
    cb(err.message, undefined);
  });

  command_data.on('data', (data) => {
    result = data.toString();
  });

  const response: ResponseType = {
    result: result,
  };

  cb(undefined, response);
};
