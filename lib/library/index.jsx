import path from 'path';
// import co from 'co';
import rsvp from 'rsvp';
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

  loadLibraryFromDisk () {
    //
    // TODO: REFACTOR THESE TERRIBLE NESTED CALLBACKS
    //
    return this.notes.find().then((result) => {
      // the cache already exists
      if (result.length) { return rsvp.resolve(); }

      return this.notebooks._findDisk({ parentNotebookPath: this.rootPath }).then((notebooks) => {
        let notebookPromises = notebooks.map((notebook) => {
          return this.notebooks._createDB(notebook).then((dbNotebook) => {

            // NOTES
            return this.notes._findDisk({ notebookPath: notebook.path }).then((notes) => {
              let notePromises = notes.map((note) => {
                note.notebookId = dbNotebook.id;
                return this.notes._createDB(note);
              });

              return rsvp.all(notePromises);
            });
          });
        });

        return rsvp.all(notebookPromises);
      });
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
    return this.db.notebooks.create({
      title: title
    });
  }

  renameNotebook ({ id, title }) {

  }

  deleteNotebook (notebookId) {

  }

  findNotebooks () {
    return this.notebooks.find();
  }


  // Note APIs

  findNotes () {
    return this._findNotes()
      .then(() => this.onChange());
  }

  createNote () {
    // TODO: selected notebook
    const notebookPath = path.join(this.rootPath, 'notebook');

    // create the file
    this.notes.create({ notebookPath: notebookPath })
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
    if (!this.openedNote) { return; }

    this.openedNote.content = newContent;

    this.notes.save(this.openedNote)
      .then(() => this.onChange());
  }

  deleteNote (note) {
    // removes note from "cache"
    // delete file from disk
    this.notes.remove(note)
      .then(() => this.findNotes());
  }

  _findNotes () {
    return this.notes.find()
      .then((notes) => this.openedNotebook.notes = notes);
  }
}

