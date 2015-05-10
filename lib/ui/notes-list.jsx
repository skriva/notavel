import React from 'react';
import marked from 'marked';


const style = {
  listStyleType: 'none',
  padding: 0,
  color: 'black',
  background: '#FBFBFB',
  'overflowY': 'scroll',
  borderRight: '1px solid #E4E4E4'
};


const itemStyle = {
  display: 'block',
  padding: '1em 0.5em',
  borderRightWidth: '4px',
  borderRightStyle: 'solid',
  borderRightColor: 'transparent'
};


const itemStyleSelected = Object.assign({}, itemStyle, {
  borderRightColor: '#d4d2d4'
});


const listItemStyle = {
  borderBottom: '1px solid #E4E4E4'
};


export default React.createClass({
  propTypes: {
    list: React.PropTypes.array,
    onSelectNote: React.PropTypes.func,
    selectedNote: React.PropTypes.object,
    style: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      selectedNote: {},
      list: [],
      onSelectNote: function () { }
    };
  },

  render: function () {
    const selectedNote = this.props.selectedNote || {};
    const list = this.props.list || [];

    return (
      <ol style={Object.assign({}, style, this.props.style)}>
      {
        list.map(note => {
          return (<li key={note.id} onClick={this.handleItemClick.bind(null, note)} style={listItemStyle}>
            <span style={note.id === selectedNote.id ? itemStyleSelected : itemStyle}>
              <h1 style={{ margin: 0, fontSize: '1em', fontWeight: 'normal' }}>{note.title}</h1>
              <p style={{ margin: 0, marginTop: '0.5em', fontSize: '0.6em' }}>{exerpt(note.content)}</p>
            </span>
          </li>);
        })
      }
      </ol>
    );
  },

  handleItemClick: function (selectedNote) {
    this.props.onSelectNote(selectedNote);
  }
});

function exerpt (content) {
  const tokens = marked.lexer(content);
  const firstParagraph = tokens.find(t => t.type === 'paragraph');
  return (firstParagraph && firstParagraph.text || '').substring(0, 100);
}
