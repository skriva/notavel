import lunr from 'lunr';
import rsvp from 'rsvp';

export default class DataIndex {
  constructor () {
    this.idx = {};
    this.idx.notes = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 20 });
      this.field('content', { boost: 10 });
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

  // Note APIs

  saveNote (note) {
    this.idx.notes.add(note);
  }

  deleteNote (noteId) {
    this.idx.notes.remove({ id: noteId });
  }
}