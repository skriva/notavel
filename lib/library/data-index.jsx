// import { denodeify } from 'rsvp';
import Loki from 'lokijs';


export default class DataIndex {
  constructor (/*{ cachePath }*/) {
    this.db = new Loki('test.json');
    // this._add = denodeify(si.add).bind(si);
    // this._del = denodeify(si.del).bind(si);
    // this._search = denodeify(si.search).bind(si);

    this.notebooks = this.db.addCollection('notebooks');
    this.notes = this.db.addCollection('notes');
  }

  // Notebooks
  createNotebook (notebook) {
    return new Promise((resolve) => resolve(this.notebooks.insert(notebook)));
  }

  saveNotebook (notebook) {
    return new Promise((resolve) => resolve(this.notebooks.insert(notebook)));
    // return new Promise((resolve) => resolve(this.notebooks.update(note)));
  }

  findNotebooks () {
    return new Promise((resolve) => resolve(this.notebooks.find()));
  }

  // Notes

  createNote (note) {
    return new Promise((resolve) => resolve(this.notes.insert(note)));
  }

  saveNote (note) {
    return new Promise((resolve) => resolve(this.notes.insert(note)));
    // return new Promise((resolve) => resolve(this.notes.update(note)));
  }

  findNotes () {
    return new Promise((resolve) => resolve(this.notes.find()));
  }
}