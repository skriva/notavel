import React from 'react/addons';
import marked from 'marked';


const editableArea = {
  flex: '1 0 200px',
  border: 0,
  outline: 'none',
};


const previewArea = {
  flex: '1 0 200px',
};


const wrapper = {
  height: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  alignContent: 'stretch',
  alignItems: 'stretch',
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

    return <div style={wrapper}>
      <textarea style={editableArea} valueLink={this.linkState('content')}></textarea>
      <div style={previewArea} dangerouslySetInnerHTML={{ __html: markdown}}></div>
    </div>;
  }
});
