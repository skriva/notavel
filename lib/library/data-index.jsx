import lunr from 'lunr';
import rsvp from 'rsvp';

export default class DataIndex {
  constructor () {
    this.idx = {};
    this.idx.notes = lunr(function () {
      this.ref('id');
      this.field('name');
      this.field('filename');
      this.field('title', { boost: 10 });
      this.field('content', { boost: 10 });
      this.field('updatedAt');
    });
  }

  read () {}

  save () {}

  loadLibraryFromDisk () {}

  sync () {}


  // Notebook APIs


  createNotebook ({ title }) {}

  renameNotebook ({ id, title }) {}

  deleteNotebook (notebookId) {}

  loadNotebookFromDisk (dirName, dirPath) {}


  // Note APIs


  createNote () {}

  readNote (note) {}

  saveNote (note) {
    this.idx.notes.add(note);
  }

  deleteNote (note) {}

  loadNoteFromDisk (notebookPath, file, index) {}

  _sortNotes () {}
}