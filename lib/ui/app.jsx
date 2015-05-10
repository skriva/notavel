import path from 'path';
import React from 'react';
import remote from 'remote';
import Toolbar from './toolbar.jsx';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';
import Library from '../library';


const applicationStyle = {
  height: '100%'
};


const toolbarStyle = {
  width: '100%',
  background: '#d4d2d4',
  borderBottom: '1px solid #c3c0c3',
  color: '#4C4B4C',
  lineHeight: '38px'
};


const notesListStyle = {
  width: '200px',
  margin: 0
};


const editorStyle = {
  flex: 1
};


const mainContentContainerStyle = {
  position: 'absolute',
  top: '38px',
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  display: 'flex'
};


const Application = React.createClass({
  getInitialState: function () {
    return { notePath: null };
  },

  componentWillMount: function () {
    this.library = new Library({ rootPath: path.join(__dirname, '../../repository') });
    this.library.onChange = () => this.forceUpdate();

    this.library.openedNotebook = {};

    this.configureShortcuts();
  },

  componentDidMount: function () {
    this.library.read().then(() => {
      // selects first notebook while we don't have a notebooks screen
      this.library.findNotebooks().then((notebooks) => {
        this.library.openedNotebook = notebooks[0] || {};

        this.library.findNotes();
      });
    });
  },

  render: function () {
    return <div style={applicationStyle}>
      <Toolbar style={toolbarStyle} onClickAdd={this.handleAdd} onClickDelete={this.handleDelete} selectedNote={this.library.openedNote} />
      <div style={mainContentContainerStyle}>
        <NotesList style={notesListStyle} onSelectNote={this.handleSelection} list={this.library.openedNotebook.notes} selectedNote={this.library.openedNote}/>
        <Editor style={editorStyle} content={this.library.openedNote && this.library.openedNote.content || ''} onContentChange={this.handleContentChange} />
      </div>
    </div>;
  },

  handleAdd: function () {
    this.library.createNote();
  },

  handleDelete: function () {
    if (!this.library.openedNote) { return; }
    if (confirm('Are you sure you want to delete this note?')) {
      this.library.deleteNote(this.library.openedNote);
    }
  },

  handleSelection: function (selectedNote) {
    this.library.readNote(selectedNote);
  },

  handleContentChange: function (newContent) {
    this.library.saveNote(newContent);
  },

  configureShortcuts: function () {
    let globalShortcut = remote.require('global-shortcut');
    globalShortcut.register('cmd+n', this.handleAdd);
    globalShortcut.register('cmd+d', this.handleDelete);
  }

});


React.render(
  <Application/>,
  document.getElementById('main')
);
