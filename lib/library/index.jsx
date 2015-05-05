import path from 'path';
import fs from 'fs';
import co from 'co';
import { denodeify } from 'rsvp';
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
    this.cachePath = path.join(this.rootPath, '.notavel-cache');
    this.openedNotebook = null;
    this.openedNote = null;
    this.dataIndex = new DataIndex();
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
    // loads the whole library with no cache
    let files = fs.readdirSync(this.rootPath);

    files.forEach((file) => {
      this.loadNotebookFromDisk(file, path.join(this.rootPath, file));
    }.bind(this));

    // saves the loaded library in memory into a cache file
    this.save();
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
  }

  renameNotebook ({ id, title }) {

  }

  deleteNotebook (notebookId) {

  }

  loadNotebookFromDisk (dirName, dirPath) {
    if (!fs.statSync(dirPath).isDirectory()) { return; }

    if (!this.notebooks[dirName]) {
      this.notebooks[dirName] = {
        name: dirName,
        path: dirPath,
        notes: {}
      };
    }

    fs.readdirSync(dirPath)
      .filter(file => file.match(/md$/))
      .forEach((file, index) => {
        let note = this.loadNoteFromDisk(dirPath, file, index);
        this.notebooks[dirName].notes[note.name] = note;
      }.bind(this));

    this._sortNotes();
  }


  // Note APIs


  createNote () {
    // create the file
    // leave the title empty
    // updates the "cache"
    // returns the note object

    fs.writeFileSync(path.join(this.openedNotebook.path, `__${new Date().getTime()}.md`), '# new document');
    this.loadNotebookFromDisk(this.openedNotebook.name, this.openedNotebook.path);
    this.onChange();
  }

  readNote (note) {
    // read note content from disk
    // returns note object

    this.openedNote = note;
    loadNoteContent(note);
    this.onChange();
  }

  saveNote (newContent) {
    // save note content to disk
    this.openedNote.content = newContent;
    this.openedNote.updatedAt = new Date();
    this.openedNote.title = extractTitle(newContent);
    fs.writeFileSync(this.openedNote.filename, this.openedNote.content);
    this._sortNotes();

    // update index
    this.dataIndex.saveNote(this.openedNote);

    // returns note object

    this.onChange();
  }

  deleteNote (note) {
    // removes note from "cache"
    // delete file from disk
    delete this.openedNotebook.notes[note.name];
    fs.unlinkSync(note.filename);
    this.onChange();
  }

  loadNoteFromDisk (notebookPath, file, index) {
    let note = {};

    note.name = file;
    note.filename = path.join(notebookPath, file);
    note.updatedAt = fs.statSync(note.filename).ctime;
    note.id = index;
    loadNoteContent(note);
    note.title = extractTitle(note.content);

    return note;
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
