import path from 'path';
import React from 'react';
import Toolbar from './toolbar.jsx';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';
import Library from '../library';


const applicationStyle = {
  height: '100%'
};


const toolbarStyle = {
  width: '100%',
  background: '#3b536b',
  color: 'white',
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
    this.library.read();
    this.library.onChange = () => this.forceUpdate();

    // selects first notebook while we don't have a notebooks screen
    this.library.openedNotebook = this.library.notebooks[Object.keys(this.library.notebooks)[0]];
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
    this.library.deleteNote(this.library.openedNote);
  },

  handleSelection: function (selectedNote) {
    this.library.readNote(selectedNote);
  },

  handleContentChange: function (newContent) {
    this.library.saveNote(newContent);
  }

});


React.render(
  <Application/>,
  document.getElementById('main')
);
