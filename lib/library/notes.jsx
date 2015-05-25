import fs from 'fs';
import path from 'path';
import { denodeify } from 'rsvp';
import slug from 'slug';
import { escapeRegExp } from 'lodash';
import { stripFrontMatter } from '../front-matter.jsx';


const INITIAL_CONTENT = '# new document';


export default class Note {
  constructor ({ db }) {
    this.db = db;
    this.notes = this.db.addCollection('notes');
  }

  create ({ notebookPath }) {
    let note = {};
    note.createdAt = new Date();
    note.updatedAt = new Date(); // sets it already due sort reason
    note.content = INITIAL_CONTENT;
    note.title = extractTitle(note.content);

    return this._saveDisk({ notebookPath, note })
      .then(() => this._createDB(note));
  }

  save ({ notebookPath, note }) {
    note.updatedAt = new Date();
    note.title = extractTitle(note.content);

    return this._saveDisk({ notebookPath, note })
      .then(() => this._saveDB(note));
  }

  remove (note) {
    return this._removeDisk(note).then(() => this._removeDB(note));
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

   /**
    * saves note file in the disk and defines the file name
    * @param options.notebookPath
    * @param options.note
    */
  _saveDisk ({ notebookPath, note }) {
    const originalName = note.name;
    note.name = `${slug(note.title)}.md`;

    let promises = Promise.resolve();

    // ensure has a uniqure name for new files or in case it has changed the name
    if (!note.id || originalName !== note.name) {
      promises = promises
        .then(() => this._generateUniqueNameDisk({ notebookPath, note, originalName }))
        .then((newName) => note.name = newName);
    }

    // renames in the disk in case it has changed the name
    if (note.id && originalName !== note.name) {
      promises = promises
        .then(() => this._renameDisk({ notebookPath, note, originalName }));
    }

    // saves file in the disk
    return promises.then(() => {
      note.filename = path.join(notebookPath, note.name);
      return denodeify(fs.writeFile).call(fs, note.filename, note.content);
    });
  }

  _renameDisk ({ notebookPath, note, originalName }) {
    const oldPath = path.join(notebookPath, originalName);
    const newPath = path.join(notebookPath, note.name);

    return denodeify(fs.rename).call(fs, oldPath, newPath);
  }

  _generateUniqueNameDisk ({ notebookPath, note, index, originalName }) {
    if (!index) { index = 0; }
    const name = index > 0 ? `${slug(note.title)}-nk${index}.md` : `${slug(note.title)}.md`;
    const notePath = path.join(notebookPath, name);

    return this._existsDisk(notePath).then((exists) => {
      if (!exists) { return name; }

      // in case is the file itself should keep using the same name
      if (index === 0 && extractSufixIDFromFilename(name, originalName)) { return originalName; }

      // try a new name ending with another sufix
      index += 1;
      return this._generateUniqueNameDisk({ notebookPath, note, index });
    });
  }

  _existsDisk (notePath) {
    return new Promise((resolve) => fs.exists(notePath, (exists) => resolve(exists)));
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
  const match = stripFrontMatter(content).match(/# (.+)/);
  return match && match[1] || 'untitled';
}


function extractSufixIDFromFilename (newName, originalName) {
  if (!originalName) { return null; }
  const regex = '^' + escapeRegExp(newName.replace(/\.md$/, '')) + '\-nk([0-9]+)\.md';
  const match = originalName.match(new RegExp(regex, 'i'));
  if (!match || !match.length) { return null; }
  return parseInt(match[1], 10);
}
