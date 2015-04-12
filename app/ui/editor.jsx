import React from 'react/addons';
import marked from 'marked';


const editableArea = {
  position: 'absolute',
  top: 0, left: 0, right: '50%', bottom: 0,
  backgroud: 'red',
  boxSizing: 'border-box',
  width: '50%',
  border: 0,
  outline: 'none',
  padding: '10px',
};


const previewArea = {
  position: 'absolute',
  top: 0, left: '50%', right: 0, bottom: 0,
  backgroud: 'red',
  boxSizing: 'border-box'
};


export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      content: '# Hello world'
    };
  },

  render: function () {
    var markdown = marked(this.state.content);

    return <div>
      <textarea style={editableArea} valueLink={this.linkState('content')}></textarea>
      <div style={previewArea} dangerouslySetInnerHTML={{ __html: markdown}}></div>
    </div>;
  }
});
