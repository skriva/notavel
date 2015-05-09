import path from 'path';
import fs from 'fs';
// import co from 'co';
import rsvp from 'rsvp';
// import { denodeify, rsvp } from 'rsvp';
import DataIndex from './data-index';

/**
  Library abstraction to hold notebooks and notes.

  Usage:

  const library = new Library({ rootPath: '/somewhere' });
  yield library.read();

  const notebook = yield library.createNotebook({ title: 'A title for the new notebook' });
  library.notebooks[notebook.id].title;

  const note = yield library.createNote({ notebookId: notebook.id });
  note.content = '# new content title';

  library.notebooks[notebook.id].notes[note.id].title;
  library.notebooks[notebook.id].notes[note.id].createdAt;
  library.notebooks[notebook.id].notes[note.id].updatedAt;

  yield library.saveNote(note);

  ...

  library.readNote(note.id);
  library.deleteNote(note.id);

  ...

  library.renameNotebook({ id: notebook.id, title: 'new title for the notebook' });

  ...

  library.deleteNotebook(notebook.id);

  ...

  library.save();
  library.sync();

 */
export default class Library {
  constructor ({ rootPath }) {
    this.rootPath = rootPath;
    this.notebooks = {};
    this.openedNotebook = null;
    this.openedNote = null;
    this.cachePath = path.join(this.rootPath, '.cache');
    this.dataIndex = new DataIndex({ cachePath: this.cachePath });
  }

  read () {
    // loads from disk in case there is no cache file
    return this.loadLibraryFromDisk();

    // return co(function* () {
    //   const content = yield denodeify(fs.readFile).call(fs, this.cachePath);
    //   const cache = JSON.parse(content);
    //   this.notebooks = cache.notebooks;
    // }.bind(this));
  }

  save () {
    fs.writeFileSync(this.cachePath, JSON.stringify(this.notebooks));
  }

  loadLibraryFromDisk () {
    return this.dataIndex.findNotes().then((notes) => {
      // the cache already exists
      if (notes.length) { return rsvp.resolve(); }

      // loads the whole library with no cache
      let files = fs.readdirSync(this.rootPath);

      var promises = files.map((file) => {
        return this.loadNotebookFromDisk(file, path.join(this.rootPath, file));
      }.bind(this));

      return rsvp.all(promises);
    });
  }

  sync () {
    // commit changes
    // pull and merge remote changes
    // push changes
  }


  // Notebook APIs


  createNotebook ({ title }) {
    // creates notebook in the cache
    // creates a folder to store the notes
    // returns notebook object
    return this.dataIndex.createNotebook({
      title: title
    });
  }

  renameNotebook ({ id, title }) {

  }

  deleteNotebook (notebookId) {

  }

  findNotebooks () {
    return this.dataIndex.findNotebooks();
  }

  loadNotebookFromDisk (dirName, dirPath) {
    if (!fs.statSync(dirPath).isDirectory()) { return rsvp.resolve(); }

    return this.createNotebook({ title: dirName }).then(() => {
      // if (!this.notebooks[dirName]) {
      //   this.notebooks[dirName] = {
      //     name: dirName,
      //     path: dirPath,
      //     notes: {}
      //   };
      // }

      var promises = fs.readdirSync(dirPath)
        .filter(file => file.match(/md$/))
        .map((file, index) => {
          return this.loadNoteFromDisk(dirPath, file, index);
        }.bind(this));

      // this._sortNotes();
      return rsvp.all(promises);
    });
  }


  // Note APIs

  findNotes () {
    return this.dataIndex.findNotes();
  }

  createNote () {
    const id = new Date().getTime();
    const note = {
      id: id,
      name: `__${id}.md`,
      title: '# new document'
    };


    // TODO: DYNAMIC
    this.openedNotebook.path = path.join(this.rootPath, 'notebook');

    // create the file
    fs.writeFileSync(path.join(this.openedNotebook.path, note.name), note.title);
    this.loadNotebookFromDisk(this.openedNotebook.name, this.openedNotebook.path)
      .then(() => {
        // updates the "cache"
        return this.dataIndex.createNote(note).then(() => this.onChange());
      });

  }

  readNote (note) {
    // read note content from disk
    // returns note object

    this.openedNote = note;
    loadNoteContent(note);
    this.onChange();
  }

  saveNote (newContent) {
    this.openedNote.content = newContent;
    this.openedNote.updatedAt = new Date();
    this.openedNote.title = extractTitle(newContent);

    // save note content to disk
    fs.writeFileSync(this.openedNote.filename, this.openedNote.content);
    this._sortNotes();

    // update cache
    // this.dataIndex.saveNote(this.openedNote).then(() => this.onChange());

    this.onChange();
  }

  deleteNote (note) {
    // removes note from "cache"
    // delete file from disk
    delete this.openedNotebook.notes[note.name];
    fs.unlinkSync(note.filename);
    this.onChange();
  }

  loadNoteFromDisk (notebookPath, file) {
    const id = new Date().getTime();
    let note = {};
    note.id = id;
    note.name = file;
    note.filename = path.join(notebookPath, file);
    note.updatedAt = fs.statSync(note.filename).ctime;
    loadNoteContent(note);
    note.title = extractTitle(note.content);

    return this.dataIndex.saveNote(note);
  }

  _sortNotes () {
    if (!this.openedNotebook || !this.openedNotebook.notes) { return; }
    // TODO: sort by property key name
    // this.openedNotebook.notes = this.openedNotebook.notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}


function loadNoteContent (note) {
  note.content = fs.readFileSync(note.filename).toString();
}


function extractTitle (content) {
  const match = content.match(/^# (.+)/);
  return match && match[1] || '';
}
