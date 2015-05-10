import React from 'react';
import _ from 'lodash';


const style = {
  listStyleType: 'none',
  padding: 0,
  color: 'black',
  background: '#FBFBFB',
  'overflow-y': 'scroll',
  borderRight: '1px solid #E4E4E4'
};


const itemStyle = {
  display: 'block',
  padding: '1em 0.5em',
  borderRightWidth: '4px',
  borderRightStyle: 'solid',
  borderRightColor: 'transparent'
};


const itemStyleSelected = _.merge({}, itemStyle, {
  borderRightColor: '#d4d2d4'
});


const listItemStyle = {
  borderBottom: '1px solid #E4E4E4'
}


export default React.createClass({
  render: function () {
    const selectedNote = this.props.selectedNote || {};
    const list = this.props.list || [];

    return <ol style={_.merge({}, style, this.props.style)}>
    {
      list.map(note => {
        return <li key={note.id} onClick={this.handleItemClick.bind(null, note)} style={listItemStyle}>
          <span style={note.id === selectedNote.id ? itemStyleSelected : itemStyle}>{note.title}</span>
        </li>;
      })
    }
    </ol>;
  },

  handleItemClick: function (selectedNote) {
    this.props.onSelectNote(selectedNote);
  }
});
