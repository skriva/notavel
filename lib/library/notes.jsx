import fs from 'fs';
import path from 'path';
import { denodeify } from 'rsvp';


const INITIAL_CONTENT = '# new document';


export default class Note {
  constructor ({ db }) {
    this.db = db;
    this.notes = this.db.addCollection('notes');
  }

  create ({ notebookPath }) {
    const id = new Date().getTime();
    const name = `__${id}.md`;
    const note = {
      id: id,
      name: name,
      content: INITIAL_CONTENT,
      title: extractTitle(INITIAL_CONTENT),
      filename: path.join(notebookPath, name),
      createdAt: new Date()
    };

    return this._createDB(note).then(() => this._saveDisk(note));
  }

  save (note) {
    note.updatedAt = new Date();
    note.title = extractTitle(note.content);

    return this._saveDB(note).then(() => this._saveDisk(note));
  }

  remove (note) {
    return this._removeDB(note).then(() => this._removeDisk(note));
  }

  find (query) {
    return this._findDB(query);
  }

  findOneById (id) {
    return this._findOneByIdDB(id);
  }

  /**
   * DB (memory)
   */

  _createDB (note) {
    return Promise.resolve(this.notes.insert(note));
  }

  _saveDB (note) {
    return Promise.resolve(this.notes.update(note));
  }

  _findDB (query) {
    return Promise.resolve(
      this.notes.chain()
        .find(query)
        .simplesort('$loki', true)
        .data()
        .map((doc) => {
          doc.id = doc.$loki;
          return doc;
        })
      );
  }

  _findOneByIdDB (id) {
    return Promise.resolve(this.notes.get(id));
  }

  _removeDB (query) {
    return Promise.resolve(this.notes.remove(query));
  }

  /**
   * Disk
   */

  _createDisk (note) {
    const filename = path.join(this.openedNotebook.path, note.name);
    return denodeify(fs.writeFile).call(fs, filename, note.title);
  }

  _saveDisk (note) {
    return denodeify(fs.writeFile).call(fs, note.filename, note.content);
  }

  _removeDisk (note) {
    return denodeify(fs.unlink).call(fs, note.filename);
  }

  _findDisk ({ notebookPath }) {
    return denodeify(fs.readdir).call(fs, notebookPath).then((files) => {
      return files
        .filter(file => file.match(/md$/))
        .map((file, index) => {
          return mapNoteFromDisk(notebookPath, file, index);
        });
    });
  }
}


function mapNoteFromDisk (notebookPath, file) {
  const id = new Date().getTime();
  let note = {};
  note.id = id;
  note.name = file;
  note.filename = path.join(notebookPath, file);
  note.updatedAt = fs.statSync(note.filename).ctime;
  loadNoteContent(note);
  note.title = extractTitle(note.content);
  return note;
}


function loadNoteContent (note) {
  note.content = fs.readFileSync(note.filename).toString();
}


function extractTitle (content) {
  const match = content.match(/^# (.+)/);
  return match && match[1] || '';
}
