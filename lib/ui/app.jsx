import ipc from 'ipc';
import React from 'react';
import remote from 'remote';
import { debounce } from 'lodash';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';
import Library from '../library';
import config from '../config';


const applicationStyle = {
  height: '100%'
};


const notesListStyle = {
  position: 'relative',
  width: '300px',
  height: '100%',
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


const searchBoxStyle = {
  padding: '0.5em',
  position: 'absolute',
  background: '#FBFBFB',
  bottom: 0,
  left: 0,
  right: 1
};


const searchBoxInputStyle = {
  fontSize: '0.8em',
  display: 'block',
  width: '100%',
  borderRadius: '2px',
  padding: '0.1em 0.5em',
  WebkitAppearance: 'none',
  border: '1px solid #E4E4E4'
};


const Application = React.createClass({
  getInitialState: function () {
    return {
      editorMode: 'preview',
      notePath: null,
      fullScreen: false
    };
  },

  componentWillMount: function () {
    this.library = new Library({ rootPath: config.rootPath });
    this.library.onChange = () => this.forceUpdate();

    this.library.openedNotebook = {};

    this._configureShortcuts();

    ipc.on('enter-full-screen', () => {
      this.setState({ fullScreen: true });
    });

    ipc.on('leave-full-screen', () => {
      this.setState({ fullScreen: false });
    });
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
          <button style={toolbarButtonStyle} onClick={this._handleDelete}>
            <i className="fa fa-trash"></i>
          </button>
          <button style={toolbarButtonStyle} onClick={this._handleAdd}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
        <div style={mainContentContainerStyle}>
          {
            !this.state.fullScreen &&
            <div style={notesListStyle}>
              <NotesList style={{ padding: 0, margin: 0, height: '100%' }} onSelectNote={this._handleSelection} list={this.library.openedNotebook.notes} selectedNote={this.library.openedNote}/>
              <div style={searchBoxStyle}>
                <input type="text" onChange={this._handleSearch} ref="search" style={searchBoxInputStyle} placeholder="Search" />
              </div>
            </div>
          }
          <Editor style={editorStyle} mode={this.state.editorMode} content={this.library.openedNote && this.library.openedNote.content || ''} onContentChange={this._handleContentChange} />
        </div>
      </div>
    );
  },

  _handleAdd: function () {
    this.library.createNote();
    this.setState({ editorMode: 'editor' });
  },

  _handleDelete: function () {
    if (!this.library.openedNote) { return; }
    if (confirm('Are you sure you want to delete this note?')) {
      this.library.deleteNote(this.library.openedNote);
    }
  },

  _handleSelection: function (selectedNote) {
    this.library.readNote(selectedNote);
  },

  _handleContentChange: debounce(function (newContent) {
    this.library.saveNote(newContent);
  }, 1000),

  _handleSearch: function () {
    this.library.findNotes({
      title: { $regex: new RegExp(this.refs.search.getDOMNode().value, 'ig') }
    });
  },

  _handleChangeEditorMode: function () {
    this.setState({ editorMode: this.state.editorMode === 'editor' ? 'preview' : 'editor' });
  },

  _configureShortcuts: function () {
    let globalShortcut = remote.require('global-shortcut');
    globalShortcut.register('cmd+n', this._handleAdd);
    globalShortcut.register('cmd+d', this._handleDelete);
  }

});


React.render(
  <Application/>,
  document.getElementById('main')
);
