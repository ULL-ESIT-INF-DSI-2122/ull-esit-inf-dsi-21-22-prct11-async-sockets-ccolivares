import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * Clase para gestion general de notas. 
 * (Crear, borrar, modificar, listar, visualizar)
 */
export class notesGestor {
  constructor(){}

  /**
   * Método para añadir una nueva nota
   * @param user usuario que va a añadir la nota
   * @param title título de la nota
   * @param body contenido de la nota
   * @param color color de la nota
   * @returns mensaje con el resultado de la acción
   */
  addNote(user: string, title: string, body: string, color: string): string {
    let path: string = "database/" + user + "/" + title + ".json";
    let dir_path: string = "database/" + user;
    let note = {"title": title, "body": body, "color": color};

    if (!fs.existsSync(path)) { 
      if (!fs.existsSync(dir_path)) { 
        fs.mkdirSync("database/" + user);
      }

      fs.writeFileSync(path,JSON.stringify(note));
    
      return chalk.bgGreen("Se ha creado la nota correctamente");

    } else { 
      return chalk.bgRed.white("La nota que desea añadir ya existe");
    }
  }

  /**
   * Método para eliminar una nota
   * @param user usuario que va a añadir la nota
   * @param title título de la nota
   * @returns mensaje con el resultado de la acción
   */
  deleteNote(user: string, title: string): string {
    let path: string = "database/" + user + "/" + title + ".json";
    let dir_path: string = "database/" + user;

    if (fs.existsSync(path)) {
      fs.rmSync(path);
      let all_notes = fs.readdirSync(dir_path);

      if (all_notes.length == 0) {
        fs.rmdirSync(dir_path);
      }

      return chalk.bgGreen("La nota ha sido eliminada correctamente");

    } else {
      return chalk.bgRed.white("La nota que desea borrar no existe");
    }
  }

  /**
   * Método para modificar el cuerpo y color de una nota
   * @param user usuario que va a modificar la nota
   * @param title titulo de la nota a modificar
   * @param body nuevo contenido de la nota
   * @param color nuevo color de la nota
   * @returns contenido de la notas
   */
  modifyNote(user: string, title: string, body: string, color: string): string{
    let path: string = "database/" + user + "/" + title + ".json";
    // let dir_path: string = "database/" + user;
    let note = {"title": title, "body": body, "color": color};

    if (fs.existsSync(path)) { 
      fs.writeFileSync(path,JSON.stringify(note));
      return chalk.bgGreen("Se ha creado la nota correctamente");

    } else { 
      return chalk.bgRed.white("La nota que desea modificar no existe");
    }
  }

  /**
   * Método que devuelve una nota en concreto
   * @param user usuario propietario de la nota
   * @param title titulo de la nota
   * @returns mensaje con el resultado de la acción
   */
  readNote(user: string, title: string): string {
    let path: string = "database/" + user + "/" + title + ".json";
    let note: string = fs.readFileSync(path,'utf-8');
    let aux_note = JSON.parse(note);
    let body: string = aux_note['body'];
    let color: string = aux_note['color'];
    let result: string = '';

    switch(color) {
      case "green":
        result += chalk.green(body)
        break;

      case "red":
        result += chalk.red(body)
        break;

      case "blue":
        result += chalk.blue(body)
        break;

      case "yellow":
        result += chalk.yellow(body)
        break;
      }

    return result
  }

  /**
   * Método que lista las notas de un usuario en concreto
   * @param user usuario del que se listaran las notas
   * @returns lista de notas del usuario
   */
  listNotes(user: string): string{
    let dir_path: string = "database/" + user;
    let all_notes = fs.readdirSync(dir_path);
    let result: string = '';

    all_notes.forEach(element => {
      let path = dir_path + "/" + element;
      let note: string = fs.readFileSync(path,'utf-8');
      let aux_note = JSON.parse(note);
      let color: string = aux_note['color'];

      switch(color) {
        case "blue":
          result = result + chalk.blue(element) + '\n';
          break
        case "green":
          result = result + chalk.green(element) + '\n';
          break
        case "yellow":
          result = result + chalk.yellow(element) + '\n';
          break
        case "red":
          result = result + chalk.red(element) + '\n';
          break
      }
    });

    return result
  }
}