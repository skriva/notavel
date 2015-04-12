import React from 'react/addons';
import marked from 'marked';


const editableArea = {
  flex: '1 0 200px',
  border: 0,
  outline: 'none',
  background: '#1B2B34',
  color: '#CDD3DE',
  padding: '1.5em',
};


const previewArea = {
  flex: '1 0 200px',
  background: '#EEEEEE',
  padding: '1.5em',
};


const wrapper = {
  height: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  alignContent: 'stretch',
  alignItems: 'stretch',
};


marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      content: '# Hello world\n```js\n console.log("hello"); \n```'
    };
  },

  render: function () {
    var markdown = marked(this.state.content);

    return <div style={wrapper}>
      <textarea style={editableArea} valueLink={this.linkState('content')}></textarea>
      <div style={previewArea} dangerouslySetInnerHTML={{ __html: markdown}}></div>
    </div>;
  }
});
