import React from 'react';
import Toolbar from './toolbar.jsx';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';


const applicationStyle = {
  display: 'flex',
  alignContent: 'stretch',
  alignItems: 'stretch',
  flexFlow: 'row wrap',
  height: '100%',
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
  flex: 1,
};


const Application = React.createClass({
  getInitialState: function () {
    return { notePath: null };
  },

  render: function () {
    return <div style={applicationStyle}>
      <Toolbar style={toolbarStyle}/>
      <NotesList style={notesListStyle} onSelect={this.handleSelection}/>
      <Editor style={editorStyle} notePath={this.state.notePath}/>
    </div>;
  },

  handleSelection: function (selectedNote) {
    this.setState({ notePath: selectedNote.path });
  }
});


React.render(
  <Application/>,
  document.getElementById('main')
);
