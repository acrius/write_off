import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

export class ActTableActionsToobar extends Component {
  closeAct = () => {
    this.props.setState({openAct: false});
  }

  render() {
    return (
      <Toolbar
        style={this.props.style}>
        <ToolbarGroup>
          <RaisedButton
            label="Сохранить"
            primary={true}
            onTouchTap={this.props.saveActTable} />
          <RaisedButton
            label="Закрыть"
            onTouchTap={this.closeAct} />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export class ActTableToolbar extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <RaisedButton
            label="Удалить"
            secondary={true}
            onTouchTap={this.props.removeActString} />
          <RaisedButton
            label="Печать"
            primary={true}
            onTouchTap={this.props.print} />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
