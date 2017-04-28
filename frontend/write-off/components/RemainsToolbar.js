import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {MainThingItem} from './SelectableItems';

export class RemainsToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {openWriteOffDialog: false,
                  amount: 0};
  }

  getModelUpdateData = () => {
    this.props.getModelUpdateData('remains', this.props.selectedStorage);
  }

  writeOff = () => {
    this.props.writeOff(Number(this.state.amount));
    this.closeWriteOffDialog();
  }

  openWriteOffDialog = () => {
    this.setState({openWriteOffDialog: true});
  }

  closeWriteOffDialog = () => {
    this.setState({openWriteOffDialog: false});
  }

  onChange = (event, value) => {
    this.setState({amount: parseFloat(value)});
  }

  render() {
    const actions = [
      <FlatButton
        label="Списать"
        primary={true}
        onTouchTap={this.writeOff} />,
      <FlatButton
        label="Отмена"
        primary={true}
        onTouchTap={this.closeWriteOffDialog} />
    ];

    let dialogFields = [
      <TextField
        hintText="Количество"
        type="number"
        onChange={this.onChange}
        style={{margin: 20}} />];

    if (this.props.selectedActsType === 0) {
      dialogFields.push(
        <MainThingItem
          mainThings={this.props.mainThings}
          selectedKeys={this.props.selectedMainThing}
          setState={this.props.setState}
          getModelUpdateData={this.props.getModelUpdateData}
          selectedSubdivision={this.props.selectedSubdivision} />);
    }

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              label="Списать"
              primary={true}
              onTouchTap={this.openWriteOffDialog} />
            <RaisedButton
              label="Обновить"
              secondary={true}
              onTouchTap={this.getModelUpdateData}/>
          </ToolbarGroup>
        </Toolbar>
        <Dialog
          open={this.state.openWriteOffDialog}
          title="Введите количество"
          value={this.state.amount}
          actions={actions}>
          { dialogFields.map(field => field) }
        </Dialog>
      </div>
    );
  }
}
