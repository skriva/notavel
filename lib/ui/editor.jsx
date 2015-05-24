import React from 'react/addons';
import marked from 'marked';
import _ from 'lodash';
import MdEdit from './md-edit.jsx';


const editableArea = {
  flex: '1 0 200px',
  border: 0,
  outline: 'none',
  padding: '1.5em',
  margin: 0,
  background: '#f5f2f0',
  overflow: 'scroll'
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
  propTypes: {
    content: React.PropTypes.string,
    mode: React.PropTypes.string,
    onContentChange: React.PropTypes.func,
    style: React.PropTypes.object
  },

  render: function () {
    return (
      <div style={_.merge({}, wrapper, this.props.style)}>
        { this.props.mode === 'editor' ? this._renderEditor() : this._renderPreview() }
      </div>
    );
  },

  _renderEditor: function () {
    return <MdEdit style={editableArea} onChange={this._handleContentChange} value={this.props.content}/>;
  },

  _renderPreview: function () {
    const markdown = marked(this.props.content);
    return (
      <div className="markdown-preview" style={previewArea}>
        <div className="markdown-body"
             style={{ height: '100%', maxWidth: '760px', margin: 'auto' }}
             dangerouslySetInnerHTML={{ __html: markdown}}></div>
      </div>
    );
  },

  _handleContentChange: function (newValue) {
    this.props.onContentChange(newValue);
  }
});
