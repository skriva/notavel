import fs from 'fs';
import path from 'path';
import { denodeify } from 'rsvp';


export default class Notebook {
  constructor ({ db }) {
    this.db = db;
    this.notebooks = this.db.addCollection('notebooks');
  }

  create (doc) {
    return this._createDB(doc);
  }

  save (doc) {
    return this._saveDB(doc);
  }

  find (query) {
    return this._findDB(query);
  }

  /**
   * DB (memory)
   */

  _createDB (notebook) {
    return Promise.resolve(this.notebooks.insert(notebook));
  }

  _saveDB (notebook) {
    return Promise.resolve(this.notebooks.insert(notebook));
    // return Promise.resolve(this.notebooks.update(notebook));
  }

  _findDB (query) {
    return new Promise((resolve) => resolve(this.notebooks.chain().find(query).data()));
  }

  /**
   * Disk
   */

  _createDisk (notebook) {
    const filename = path.join(this.openedNotebook.path, notebook.name);
    return denodeify(fs.writeFile).call(fs, filename, notebook.title);
  }

  _saveDisk (notebook) {
   return denodeify(fs.writeFile).call(fs, notebook.name, notebook.content);
  }

  _removeDisk (notebook) {
    return denodeify(fs.unlink).call(fs, notebook.name);
  }

  _findDisk ({ parentNotebookPath }) {
    return denodeify(fs.readdir).call(fs, parentNotebookPath).then((files) => {
      return files
        .filter(file => fs.statSync(path.join(parentNotebookPath, file)).isDirectory())
        .map((file, index) => {
          return {
            title: file,
            name: file,
            path: path.join(parentNotebookPath, file),
            index: index
          };
        });
    });
  }
}
