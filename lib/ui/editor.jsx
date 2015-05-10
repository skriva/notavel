import React from 'react/addons';
import marked from 'marked';
import _ from 'lodash';
import MdEdit from './md-edit.jsx';


const editableArea = {
  flex: '1 0 200px',
  border: 0,
  outline: 'none',
  padding: '1.5em',
  margin: 0
};


const previewArea = {
  flex: '1 0 200px',
  padding: '1.5em',
  overflow: 'scroll'
};


const wrapper = {
  height: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  alignContent: 'stretch',
  alignItems: 'stretch'
};


marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


export default React.createClass({
  render: function () {
    var markdown = marked(this.props.content);

    return <div style={_.merge({}, wrapper, this.props.style)}>
      <MdEdit style={editableArea} onChange={this.handleContentChange} value={this.props.content}></MdEdit>
      <div className="markdown-body" style={previewArea} dangerouslySetInnerHTML={{ __html: markdown}}></div>
    </div>;
  },

  handleContentChange: function (newValue) {
    this.props.onContentChange(newValue);
  }
});
