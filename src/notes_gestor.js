"use strict";
exports.__esModule = true;
exports.notesGestor = void 0;
var fs = require("fs");
var chalk = require("chalk");
/**
 * Clase para gestion general de notas.
 * (Crear, borrar, modificar, listar, visualizar)
 */
var notesGestor = /** @class */ (function () {
    function notesGestor() {
    }
    /**
     * Método para añadir una nueva nota
     * @param user usuario que va a añadir la nota
     * @param title título de la nota
     * @param body contenido de la nota
     * @param color color de la nota
     * @returns mensaje con el resultado de la acción
     */
    notesGestor.prototype.addNote = function (user, title, body, color) {
        var path = "../database/" + user + "/" + title + ".json";
        var dir_path = "../database/" + user;
        var note = { "title": title, "body": body, "color": color };
        if (!fs.existsSync(path)) {
            console.log("La ruta ".concat(path, " no existe"));
            if (!fs.existsSync(dir_path)) {
                console.log("El directorio ".concat(dir_path, " no existe"));
                fs.mkdirSync("database/" + user);
            }
            fs.writeFileSync(path, JSON.stringify(note));
            return chalk.bgGreen("Se ha creado la nota correctamente");
        }
        else {
            return chalk.bgRed.white("La nota que desea añadir ya existe");
        }
    };
    /**
     * Método para eliminar una nota
     * @param user usuario que va a añadir la nota
     * @param title título de la nota
     * @returns mensaje con el resultado de la acción
     */
    notesGestor.prototype.deleteNote = function (user, title) {
        var path = "../database/" + user + "/" + title + ".json";
        var dir_path = "../database/" + user;
        if (fs.existsSync(path)) {
            fs.rmSync(path);
            var all_notes = fs.readdirSync(dir_path);
            if (all_notes.length == 0) {
                fs.rmdirSync(dir_path);
            }
            return chalk.bgGreen("La nota ha sido eliminada correctamente");
        }
        else {
            return chalk.bgRed.white("La nota que desea borrar no existe");
        }
    };
    /**
     * Método para modificar el cuerpo y color de una nota
     * @param user usuario que va a modificar la nota
     * @param title titulo de la nota a modificar
     * @param body nuevo contenido de la nota
     * @param color nuevo color de la nota
     * @returns contenido de la notas
     */
    notesGestor.prototype.modifyNote = function (user, title, body, color) {
        var path = "../database/" + user + "/" + title + ".json";
        // let dir_path: string = "database/" + user;
        var note = { "title": title, "body": body, "color": color };
        if (fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(note));
            return chalk.bgGreen("Se ha creado la nota correctamente");
        }
        else {
            return chalk.bgRed.white("La nota que desea modificar no existe");
        }
    };
    /**
     * Método que devuelve una nota en concreto
     * @param user usuario propietario de la nota
     * @param title titulo de la nota
     * @returns mensaje con el resultado de la acción
     */
    notesGestor.prototype.readNote = function (user, title) {
        var path = "../database/" + user + "/" + title + ".json";
        var note = fs.readFileSync(path, 'utf-8');
        var aux_note = JSON.parse(note);
        var body = aux_note['body'];
        var color = aux_note['color'];
        var result = '';
        switch (color) {
            case "green":
                result += chalk.green(body);
                break;
            case "red":
                result += chalk.red(body);
                break;
            case "blue":
                result += chalk.blue(body);
                break;
            case "yellow":
                result += chalk.yellow(body);
                break;
        }
        return result;
    };
    /**
     * Método que lista las notas de un usuario en concreto
     * @param user usuario del que se listaran las notas
     * @returns lista de notas del usuario
     */
    notesGestor.prototype.listNotes = function (user) {
        var dir_path = "../database/" + user;
        var all_notes = fs.readdirSync(dir_path);
        var result = '';
        all_notes.forEach(function (element) {
            var path = dir_path + "/" + element;
            var note = fs.readFileSync(path, 'utf-8');
            var aux_note = JSON.parse(note);
            var color = aux_note['color'];
            switch (color) {
                case "blue":
                    result = result + chalk.blue(element) + '\n';
                    break;
                case "green":
                    result = result + chalk.green(element) + '\n';
                    break;
                case "yellow":
                    result = result + chalk.yellow(element) + '\n';
                    break;
                case "red":
                    result = result + chalk.red(element) + '\n';
                    break;
            }
        });
        return result;
    };
    return notesGestor;
}());
exports.notesGestor = notesGestor;
