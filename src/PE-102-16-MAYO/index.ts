import {Document, connect, model, Schema} from 'mongoose';
import * as yargs from 'yargs';

connect('mongodb://127.0.0.1:27017/dsi-assessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database...');
});

interface userInterface extends Document {
  name: string,
  surname: string,
  age: number, 
  email: string,
  pass: string
}

const userSchema = new Schema<userInterface>({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  pass: {
    type: String,
  },
});

const User = model<userInterface>('Users', userSchema);

yargs.command({
  command: 'add',
  describe: 'Añade un nuevo usuario',
  builder: {
    name: {
      describe: 'Nombre del usuario',
      demandOption: true,
      type: 'string',
    },
    surname: {
      describe: 'Apellido del usuario',
      demandOption: true,
      type: 'string',
    },
    age: {
      describe: 'Edad del usuario',
      demandOption: true,
      type: 'number'
    },
    email: {
      describe: 'Email del usuario',
      demandOption: true,
      type: 'string'
    },
    pass: {
      describe: 'Contraseña del usuario',
      demandOption: true,
      type: 'string'
    },
  },
  handler(argv) {
    if (typeof argv.name === 'string' && typeof argv.surname === 'string' && 
        typeof argv.age === 'number' && typeof argv.email === 'string' &&
        typeof argv.pass === 'string') {
      const aux_user = new User({
        name: argv.name,
        surname: argv.surname,
        age: argv.age,
        email: argv.email,
        pass: argv.pass
      });
      aux_user.save().then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }
  },
});

yargs.command({
  command: 'find',
  describe: 'Busca un usuario por su correo electronico',
  builder: {
    email: {
      describe: 'Email del usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.email === 'string') {
      User.find({ email: argv.email }).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }
  },
});

yargs.command({
  command: 'delete',
  describe: 'Elimina un usuario segun su correo electronico',
  builder: {
    email: {
      describe: 'Email del usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.email === 'string') {
      User.deleteOne({ email: argv.email }).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }
  },
});

// yargs.command({
//   command: 'update',
//   describe: 'Actualiza un documento segun el correo electrónico',
//   builder: {
//     name: {
//       describe: 'Nombre del usuario',
//       demandOption: true,
//       type: 'string',
//     },
//     surname: {
//       describe: 'Apellido del usuario',
//       demandOption: true,
//       type: 'string',
//     },
//     age: {
//       describe: 'Edad del usuario',
//       demandOption: true,
//       type: 'number'
//     },
//     email: {
//       describe: 'Email del usuario',
//       demandOption: true,
//       type: 'string'
//     },
//     pass: {
//       describe: 'Contraseña del usuario',
//       demandOption: true,
//       type: 'string'
//     },
//   },
//   handler(argv) {
//     if (typeof argv.name === 'string' && typeof argv.surname === 'string' && 
//         typeof argv.age === 'number' && typeof argv.email === 'string' &&
//         typeof argv.pass === 'string') {
//       User.updateOne({ email: argv.email }, {
//         $set: {
//           name: argv.name,
//           surname: argv.surname,
//           age: argv.age,
//           email: argv.email,
//           pass: argv.pass
//         },
//       ).then((result) => {
//         console.log(result);
//       }).catch((error) => {
//         console.log(error);
//       });
//     }
//   },
// });

yargs.parse();


