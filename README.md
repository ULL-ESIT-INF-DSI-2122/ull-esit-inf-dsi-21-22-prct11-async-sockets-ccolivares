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
    <br>
    <br>

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

### Types

### Servidor

### Cliente