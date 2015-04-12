import React from 'react';
import Editor from './editor.jsx';
import NotesList from './notes-list.jsx';


const applicationStyle = {
  display: 'flex',
  alignContent: 'stretch',
  alignItems: 'stretch',
  flexFlow: 'row wrap',
  height: '100%',
};


const notesListStyle = {
  width: '200px',
  margin: 0
};


const editorStyle = {
  flex: 1,
};


React.render(
  <div style={applicationStyle}>
    <NotesList style={notesListStyle}/>
    <Editor style={editorStyle}/>
  </div>,
  document.getElementById('main')
);
