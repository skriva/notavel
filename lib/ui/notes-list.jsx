import React from 'react';
import _ from 'lodash';


const style = {
  listStyleType: 'none',
  padding: 0,
  color: '#626262',
  overflow: 'scroll'
};


const itemStyle = {
  padding: '1em 0.5em',
  borderBottom: '1px solid #E4E4E4',
};


const itemStyleSelected = _.merge({
  background: '#101D23',
  color: '#CDD3DE'
}, itemStyle);


export default React.createClass({
  render: function () {
    const selectedNote = this.props.selectedNote;
    const list = this.props.list;

    console.log('list', list);

    return <ol style={_.merge({}, style, this.props.style)}>
    {
      list.map(note => {
        return <li key={note.id} onClick={this.handleItemClick.bind(null, note)} style={note.id === selectedNote.id ? itemStyleSelected : itemStyle}>{note.title}</li>;
      })
    }
    </ol>;
  },

  handleItemClick: function (selectedNote) {
    this.props.onSelectNote(selectedNote);
  }
});
