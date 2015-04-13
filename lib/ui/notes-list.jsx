import fs from 'fs';
import path from 'path';
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
  getInitialState: function () {
    const noteBookPath = path.join(__dirname, '../../sample');
    const files = fs.readdirSync(noteBookPath).map((file, index) => {
      return {
        title: file,
        id: index,
        path: path.join(noteBookPath, file)
      };
    });
    return {
      files: files,
      selected: null
    };
  },

  render: function () {
    const selected = this.state.selected;

    return <ol style={_.merge({}, style, this.props.style)}>
    {
      this.state.files.map(file => {
        return <li onClick={this.handleItemClick.bind(null, file)} style={file.id === selected ? itemStyleSelected : itemStyle}>{file.title}</li>;
      })
    }
    </ol>;
  },

  handleItemClick: function (selectedNote) {
    this.setState({ selected: selectedNote.id });
    this.props.onSelect(selectedNote);
  }
});
