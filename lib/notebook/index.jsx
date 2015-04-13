import path from 'path';
import fs from 'fs';


export default class Notebook {
  constructor ({rootFolder}) {
    this.rootFolder = rootFolder;
    this._loadNoteList();
    this.openedNote = this.notes[0];
  }

  addNote () {
    fs.writeFileSync(path.join(this.rootFolder, `__${new Date().getTime()}.md`, ''));
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
    this.openedNote.updatedAt = new Date();
    this.openedNote.title = extractTitle(newContent);
    saveNote(this.openedNote);
    this._sortNotes();
    this.onChange();
  }

  getNoteById (id) {
    this.notes.find(note => note.id === id);
  }

  _loadNoteList () {
    this.notes = fs.readdirSync(this.rootFolder)
      .filter(file => file.match(/md$/))
      .map((file, index) => {
        const filename = path.join(this.rootFolder, file);
        const stats = fs.statSync(filename);

        return {
          title: file.replace('.md', '').replace(/__.+$/, ''),
          id: index,
          filename: filename,
          updatedAt: stats.ctime
        };
      });

    this._sortNotes();
  }

  _sortNotes () {
    this.notes = this.notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}


function loadNoteContent (note) {
  note.content = fs.readFileSync(note.filename).toString();
}


function saveNote (note) {
  fs.writeFileSync(note.filename, note.content);
}


function extractTitle (content) {
  const match = content.match(/^# (.+)/);
  return match && match[1] || '';
}
