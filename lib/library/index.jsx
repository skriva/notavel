import path from 'path';
import Loki from 'lokijs';
import Notebooks from './notebooks';
import Notes from './notes';


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
    this.openedNotebook = null;
    this.openedNote = null;
    this.db = new Loki('notavel.json');
    this.notebooks = new Notebooks({ db: this.db });
    this.notes = new Notes({ db: this.db });
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
    // Save whole library db to disk
  }

  async loadLibraryFromDisk () {
    // the cache already exists
    if ((await this.notes.find()).length) { return null; }

    // notebooks
    const notebooks = await this.notebooks._findDisk({ parentNotebookPath: this.rootPath });
    const notebookPromises = notebooks.map(async notebook => {
      const dbNotebook = await this.notebooks._createDB(notebook);

      // notes
      const notes = await this.notes._findDisk({ notebookPath: notebook.path });
      let notePromises = notes.map(note => {
        note.notebookId = dbNotebook.id;
        return this.notes._createDB(note);
      });

      return Promise.all(notePromises);
    });

    return Promise.all(notebookPromises);
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
    return this.db.notebooks.create({
      title: title
    });
  }

  renameNotebook (/*{ id, title }*/) {

  }

  deleteNotebook (/*notebookId*/) {

  }

  findNotebooks () {
    return this.notebooks.find();
  }


  // Note APIs

  findNotes (query) {
    return this._findNotes(query)
      .then(() => this.onChange());
  }

  createNote () {
    // TODO: selected notebook
    const notebookPath = path.join(this.rootPath, 'notebook');

    // create the file
    return this.notes.create({ notebookPath: notebookPath })
      .then(() => this._findNotes())
      .then(() => this.openedNote = this.openedNotebook.notes[0])
      .then(() => this.onChange());
  }

  readNote (note) {
    // read note content from disk
    // returns note object
    this.notes.findOneById(note.id).then((result) => {
      this.openedNote = result;
      this.onChange();
    });
  }

  /**
    Saves note content to disk and update cache
   */
  saveNote (newContent) {
    if (!this.openedNote) { return null; }

    // TODO: selected notebook
    const notebookPath = path.join(this.rootPath, 'notebook');

    this.openedNote.content = newContent;

    return this.notes.save({ notebookPath, note: this.openedNote })
      .then(() => this.findNotes());
  }

  deleteNote (note) {
    // removes note from "cache"
    // delete file from disk
    this.notes.remove(note)
      .then(() => this.openedNote = null)
      .then(() => this.findNotes());
  }

  _findNotes (query) {
    return this.notes.find(query)
      .then((notes) => this.openedNotebook.notes = notes);
  }
}

