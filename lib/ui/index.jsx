import path from 'path';
import React from 'react';
import Toolbar from './toolbar.jsx';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';
import NoteBook from '../notebook';


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
    this.notebook = new NoteBook({ rootFolder: path.join(__dirname, '../../sample') });
    this.notebook.onChange = () => this.forceUpdate();
  },

  render: function () {
    return <div style={applicationStyle}>
      <Toolbar style={toolbarStyle} onClickAdd={this.handleAdd}/>
      <div style={mainContentContainerStyle}>
        <NotesList style={notesListStyle} onSelectNote={this.handleSelection} list={this.notebook.notes} selectedNote={this.notebook.openedNote}/>
        <Editor style={editorStyle} content={this.notebook.openedNote && this.notebook.openedNote.content || ''} onContentChange={this.handleContentChange} />
      </div>
    </div>;
  },

  handleAdd: function () {
    this.notebook.addNote();
  },

  handleSelection: function (selectedNote) {
    this.notebook.openNote(selectedNote);
  },

  handleContentChange: function (newContent) {
    this.notebook.updateNoteContent(newContent);
  }

});


React.render(
  <Application/>,
  document.getElementById('main')
);
