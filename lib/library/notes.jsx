import fs from 'fs';
import path from 'path';
import { denodeify } from 'rsvp';
import slug from 'slug';


const INITIAL_CONTENT = '# new document';


export default class Note {
  constructor ({ db }) {
    this.db = db;
    this.notes = this.db.addCollection('notes');
  }

  create ({ notebookPath }) {
    let note = {};
    note.createdAt = new Date();
    note.updatedAt = new Date(); // sets it already to keep it the top
    note.content = INITIAL_CONTENT;
    note.title = extractTitle(note.content);
    note.name = `${slug(note.title)}.md`;
    note.filename = path.join(notebookPath, note.name);

    return this._createDB(note)
      .then(() => this._saveDisk(note));
  }

  save (note) {
    note.updatedAt = new Date();
    const oldTitle = note.title;
    note.title = extractTitle(note.content);

    let promises = Promise.resolve();
    if (oldTitle !== note.title) {
      promises = promises
        .then(() => this._renameDisk({ note: note, oldTitle: oldTitle }))
        .then((newPath) => note.filename = newPath);
    }

    return promises
      .then(() => this._saveDB(note))
      .then(() => this._saveDisk(note));
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
        .simplesort('updatedAt', true)
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

  _renameDisk ({ note, oldTitle }) {
    const notebookPath = path.dirname(note.filename);
    const oldPath = path.join(notebookPath, `${slug(oldTitle)}.md`);
    const newPath = path.join(notebookPath, `${slug(note.title)}.md`);

    return denodeify(fs.rename).call(fs, oldPath, newPath)
      .then(() => newPath);
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
  let note = {};
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
