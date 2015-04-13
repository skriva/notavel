import path from 'path';
import fs from 'fs';


export default class Notebook {
  constructor ({rootFolder}) {
    this.rootFolder = rootFolder;
    this._loadNoteList();
    this.openedNote = this.notes[0];
  }

  addNote () {
    fs.writeFileSync(path.join(this.rootFolder, `New note ${new Date().getTime()}.md`, ''));
    this._loadNoteList();
    this.onChange();
  }

  openNote (note) {
    this.openedNote = note;
    loadNoteContent(note);
    this.onChange();
  }

  updateNoteContent (newContent) {
    this.openedNote.content = newContent;
    saveNote(this.openedNote);
    this.onChange();
  }

  getNoteById (id) {
    this.notes.find(note => note.id === id);
  }

  _loadNoteList () {
    const notes = fs.readdirSync(this.rootFolder)
      .filter(file => file.match(/md$/))
      .map((file, index) => {
        return {
          title: file.replace('.md', ''),
          id: index,
          filename: path.join(this.rootFolder, file)
        };
      });

    this.notes = notes;
  }
}


function loadNoteContent (note) {
  note.content = fs.readFileSync(note.filename).toString();
}


function saveNote (note) {
  fs.writeFileSync(note.filename, note.content);
}
