import path from 'path';
import fs from 'fs';
import co from 'co';
import { denodeify } from 'rsvp';


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
class Library {
  constructor ({ rootPath }) {
    this.rootPath = rootPath;
    this.cachePath = path.join(__dirname, '.notavel-cache');
  }

  read () {
    return co(function* () {
      const content = yield denodeify(fs.readFile).call(fs, this.cachePath);
      const cache = JSON.parse(content);
      this.notebooks = cache.notebooks;
    }.bind(this));
  }

  save () {

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


  // Note APIs


  createNote () {
    // create the file
    // leave the title empty
    // updates the "cache"
    // returns the note object
  }

  readNote (noteId) {
    // read note content from disk
    // returns note object
  }

  saveNote (note) {
    // save note content to disk
    // update cache on title
    // returns note object
  }

  deleteNote (noteId) {
    // removes note from "cache"
    // delete file from disk
  }
}
