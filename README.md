[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares)

[INFORME EN GITHUB PAGES](https://ull-esit-inf-dsi-2122.github.io/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/)

# Práctica 11. Cliente y servidor para una aplicación de procesamiento de notas de texto

## Introducción

Esta práctica se realizará a partir de la implementación de la aplicación de procesamiento de notas de texto de la **Práctica 9**, procederemos a añadir un servidor y un cliente haciendo uso de los sockets que nos proporciona el módulo `net` de Node. 

Las notas serán ficheros `.json` dentro de su correspondiente directorio de usuario. Podremos añadir, modificar, listar y leer notas en concretas de un usuario, esta interacción la hará el cliente mediante la línea de comandos. 

- Notas de funcionamiento:
  - Para la compilación realice los siguientes comandos en dos terminales distintas desde la carpeta `src`:
    ```bash
    $   # TERMINAL PARA EL SERVIDOR
    $   cd src
    $   tsc server.ts
    $   node server.ts
    ```
    El servidor quedará esperando solicitudes del cliente.

    ```bash
    $   # TERMINAL PARA EL CLIENTE
    $   cd src
    $   tsc client.ts
    $   node client.ts [opcion] [parámetros de la opcion]
    ```
    Por ejemplo:    ``node client.ts add --user="user1" --title="hello-world" --body="Hello world" --color="red"``

    - Opciones:
      - **add (requiere: usuario, titulo , contenido, color):** añade una nueva nota
      - **modify (requiere: usuario, titulo , contenido, color):** modifica una nota existente
      - **delete (requiere: usuario, titulo):** elimina una nota
      - **read (requiere: usuario, titulo):** muestra el contenido de una nota en específico
      - **list (requiere: usuario):** muestra todas las notas de un usuario
    <br><br>

    La razón de compilarlo de esta forma reside en que al compilarlo con `npm run start` (el script de nuestro `package.json`) no reconoce el paquete chalk. Pero de esta forma básica no hay ningún problema. Recomiendo tambien eliminar los archivos `.js` luego de terminar de hacer pruebas sobre la práctica con el siguiente comando:
    
    ```bash
    $   cd src
    $   rm -rf *.js
    ```

    En el caso de algún otro problema que pueda surgir recomiendo siempre asegurarse de que las dependencias de desarrollo están en orden con:

    ```bash
    $   npm install
    ```

## Desarrollo de la práctica

### Clase MessageEventEmitter

Para comenzar veremos la nueva clase `MessageEventEmitter` que servirá para procesar los mensajes enviados entre cliente y servidor. Ya que no siempre un mensaje se recibirá de una sola pieza esta clase se encargará de recibir el mensaje troceado y juntarlo a su vez en un único mensaje. En el momento en que reciba una señal `end` emitirá el mensaje entero para que pueda ser utilizado.

```typescript
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
```
[--> Acceso a message_event_emitter.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/blob/main/src/message_event_emitter.ts)

### Types

Este fichero definirá los tipos RequestType y ResponseType, estos serán los tipos de mensajes que el cliente y el servidor van a enviar. 

- **RequestType:** es una petición de solicitud del cliente, posee 5 parámetros, dos obligatorios y tres opcionales:
  - type: tipo de la solicitud
  - user: usuario
  - (opcional) title: titilo de la nota
  - (opcional) body: contenido de la nota
  - (opcional) color: color de la nota
<br><br>

- **ResponseType:** es una respuesta del servidor. Su único parámetro message representa el contenido de la respuesta de este.

```typescript
export type RequestType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: string;
}

export type ResponseType = {
  message: string;
}
```
[--> Acceso a types.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/blob/main/src/types.ts)

### Servidor

Para la creación del servidor en primer lugar tomamos en cuenta la opción `allowHalfOpen` que por defecto la encontrariamos a falso y eso significaria que el socket cierra el lado de escritura cuando finalice el lado de lectura, por lo tanto indicamos esta opción a `true` para que esto no pase y podamos controlar mejor nuestra conexión.

Una vez creado nuestro servidor estará escuchando al puerto 60300 donde deberán conectarse los clientes. Cuando un cliente se conecte al servidor se ejecutará el callback de este y mediante el objeto socket que tiene como parámetro podremos enviar y recibir información además de detectar otro tipo de eventos. Para poder tratar con los datos crearemos un objeto `MessageEventEmitter` con el socket `connection`.

Cuando este socket reciba un mensaje procederá a analizarlo para llamar al método correspondiente (con el uso de la clase `notesGestor`) y almacenar el resultado de la operación en una cadena auxiliar para luego crear una respuesta tipo `ResponseType` con este resultado que hemos obtenido.

Mediante el uso de `connection.write()` escribiremos el resultado de la operación en el cliente.

También analizamos otras posibilidades como que no se pueda realizar la conexión, que nos lo indica el evento `error`. Además emitiremos un mensaje en la consola del servidor para reconocer este evento si sucede.

Cuando el cliente reciba una respuesta este saldrá del servidor, este evento lo reconoceremos como `close` y emitiremos un mensaje por la consola del servidor para detectarlo.

```typescript
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
```

[--> Acceso a server.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/blob/main/src/server.ts)

### Cliente

Para nuestro cliente inicializaremos el socket al puerto 60300 como mencionamos en el `Server` para poder realizar la conexión. Crearemos un objeto de la clase `MessageEventEmitter` al que le pasaremos el socket creado. 

Creamos una solicitud de llamada del cliente que se llamará `request`, de tipo `RequestType`, la cual tendrá los dos parámetros obligatorios puestos por defecto (elegimos la opción read por defecto porque utiliza solo parámetros obligatorios). 

Utilizaremos `Yargs` para procesar la línea de comandos con las opciones que nos aportará el cliente, cada opción tiene sus parámetros específicos, dispondremos la solicitud `request` según los parámetros que sean utilizados para esa opción, añadiendo parámetros opcionales si es necesario. Un ejemplo sería la opción add (añadir una nota) que implementa todos los parámetros opcionales: 

```typescript
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

```

Cuando la `request` este correctamente rellenada procedemos a enviar una solicitud al servidor mediante el `socket.write()` de la siguiente forma:

```typescript
socket.write(JSON.stringify(request), (err) => {
  if(err)
    console.log(chalk.bgRed.white(`No se ha podido realizar la solicitud`));
  else {
    console.log(chalk.bgGreen.white(`Se ha enviado la solicitud`));
  }
  socket.end();
});
```

Luego tenemos otros manejadores como `client.on('message')` que recibirá la respuesta del servidor y la mostrará por consola:

```typescript
client.on('message', (message) => {
  console.log(message.message);
});
```

Si surgiera algun fallo lo podremos detectar por el siguiente manejador, además de emitir un mensaje en el cliente.

```typescript
client.on('error', (err) => {
  console.log(chalk.bgRed.white('No se ha podido realizar la conexión'));
});
```

[--> Acceso a client.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/blob/main/src/client.ts)

### Probado nuestro programa

#### Opción add

Para finalizar el informe haremos una serie de pruebas al programa y observaremos sus resultados.

En primer lugar vamos a hacer una prueba de la opción `add`, crearemos una nueva nota además de un nuevo usuario para comprobar que crea correctamente el directorio:

![Captura de la consola con el comando add](/screenshots/add_console.png)
![Captura de la database con el comando add](/screenshots/add_database.png)
![Captura del resultado con el comando add](/screenshots/add_result.png)

En el servidor podemos comprobar que se detecta la conexión de un cliente y luego su solicitud, además luego de esto se envía un mensaje de confirmación para indicar que la acción se ha realizado correctamente. En el cliente al mismo tiempo vemos como hemos enviado satisfactoriamente la solicitud y además se nos envía una confirmación de la petición realizada. Luego vemos como en nuestra base de datos se ha añadido la nota correspondiente. 

#### Opción modify

Ahora haremos una prueba modificando la última nota que añadimos. Modificaremos tanto el contenido como su color:

![Captura de la consola con el comando modify](/screenshots/modify_console.png)
![Captura del resultado con el comando modify](/screenshots/modify_result.png)

Podemos comprobar que como en la opción anterior el cliente y el servidor se comportan de la misma forma y además podemos comprobar el cambio en el archivo.

#### Opción delete

Para esta opción eliminaremos el archivo con el que hasta ahora estabamos tratando:

![Captura de la consola con el comando delete](/screenshots/delete_console.png)
![Captura del resultado con el comando delete](/screenshots/delete_result.png)

El servidor y el cliente de nuevo se comportan de la misma forma emitiendo los mensajes correspondientes y la nota se elimina correctamente de nuestra base de datos. 

#### Opción read

Para esta opción únicamente comprobaremos el contenido de uno de los archivos de la base de datos:

![Captura del resultado con el comando read](/screenshots/read_result.png)
![Captura del archivo en la base de datos](/screenshots/read_database.png)

#### Opción list

Esta opción muestra todas las notas de un usuario especificado, en las siguientes imagenes veremos la base de datos actual (a la cual le hemos añadido una serie de notas nuevas para que se vea mejor el resultado) y la respuesta de la solicitud del cliente para el comando: 

![Captura de la consola con el comando list](/screenshots/list_console.png)
![Captura del resultado con el comando list](/screenshots/list_result.png)

#### Server

Durante todas estas pruebas no hemos detenido la ejecución de nuestro server, por lo tanto ha ido recibiendo y respondiendo peticiones de las correspondientes solicitudes de un cliente:

![Captura del funcionamiento del server](/screenshots/prueba_server.png)


### Enlaces relacionados con la Práctica 9

[--> Acceso a notesGestor.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-ccolivares/blob/main/src/notes_gestor.ts)
