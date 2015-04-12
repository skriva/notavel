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
    return <ol style={_.merge({}, style, this.props.style)}>
      <li style={itemStyleSelected}>
        Adding syntax highlight to Markdown in Sublime Text 2
      </li>
      <li style={itemStyle}>
        Creating an web markdown editor
      </li>
      <li style={itemStyle}>
        Fix permission of SSH certificate
      </li>
      <li style={itemStyle}>
        Getting tags in a specific commit (or HEAD)
      </li>
      <li style={itemStyle}>
        Creating an web markdown editor
      </li>
      <li style={itemStyle}>
        Fix permission of SSH certificate
      </li>
      <li style={itemStyle}>
        Getting tags in a specific commit (or HEAD)
      </li>
      <li style={itemStyle}>
        Creating an web markdown editor
      </li>
      <li style={itemStyle}>
        Fix permission of SSH certificate
      </li>
      <li style={itemStyle}>
        Getting tags in a specific commit (or HEAD)
      </li>

    </ol>;
  }
});
