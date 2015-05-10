import path from 'path';
import React from 'react';
import remote from 'remote';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';
import Library from '../library';


const applicationStyle = {
  height: '100%'
};


const notesListStyle = {
  width: '300px',
  margin: 0
};


const editorStyle = {
  flex: 1
};


const mainContentContainerStyle = {
  position: 'absolute',
  top: '0',
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  display: 'flex'
};


const toolbarStyle = {
  position: 'fixed',
  zIndex: 10,
  top: 10,
  right: 10,
  fontSize: '1em'
};

const toolbarButtonStyle = {
  border: 'none',
  background: 'transparent'
};


const Application = React.createClass({
  getInitialState: function () {
    return {
      editorMode: 'preview',
      notePath: null
    };
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
    if (!this.library.openedNote && this.library.openedNotebook.notes) {
      this.library.openedNote = this.library.openedNotebook.notes[0];
    }

    return (
      <div style={applicationStyle}>
        <div style={toolbarStyle}>
          {
            this.state.editorMode === 'editor' ?
              <button style={toolbarButtonStyle} onClick={this._handleChangeEditorMode}>
                <i className="fa fa-eye"></i>
              </button>
            :
              <button style={toolbarButtonStyle} onClick={this._handleChangeEditorMode}>
                <i className="fa fa-pencil"></i>
              </button>
          }
          <button style={toolbarButtonStyle} onClick={this.handleDelete}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
        <div style={mainContentContainerStyle}>
          <NotesList style={notesListStyle} onSelectNote={this.handleSelection} list={this.library.openedNotebook.notes} selectedNote={this.library.openedNote}/>
          <Editor style={editorStyle} mode={this.state.editorMode} content={this.library.openedNote && this.library.openedNote.content || ''} onContentChange={this.handleContentChange} />
        </div>
      </div>
    );
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

  _handleChangeEditorMode: function () {
    this.setState({ editorMode: this.state.editorMode === 'editor' ? 'preview' : 'editor' });
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
