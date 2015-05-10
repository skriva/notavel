import React from 'react';


export default React.createClass({
  propTypes: {
    onClickAdd: React.PropTypes.func,
    onClickDelete: React.PropTypes.func,
    selectedNote: React.PropTypes.object,
    style: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      selectedNote: {},
      onClickDelete: function () { },
      onClickAdd: function () { }
    };
  },

  render: function () {
    return (
      <div style={this.props.style}>
        <i style={{ padding: '0 9px' }} className="fa fa-folder-open"></i>
        <i style={{ padding: '0 9px' }} className="fa fa-plus" onClick={this.props.onClickAdd}></i>
        { this.props.selectedNote && <i style={{ padding: '0 9px' }} className="fa fa-trash" onClick={this.props.onClickDelete}></i> }
        <div style={{ float: 'right' }}>
          <input style={{ color: '#3b536b', border: 'none' }}/>
          <i style={{ padding: '0 9px' }} className="fa fa-search"></i>
        </div>
      </div>
    );
  }
});
