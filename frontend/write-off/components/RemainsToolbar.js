import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import {MainThingItem} from './SelectableItems';

export class RemainsToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {openWriteOffDialog: false,
                  amount: 0,
                  selectedWorkName: '',
                  openWarning: false};
  }

  getModelUpdateData = () => {
    this.props.getModelUpdateData('remains', this.props.selectedStorage);
  }

  writeOff = () => {
    const amount = Number(this.state.amount);
    if (!isNaN(amount) && amount != 0) {
      this.props.writeOff(amount, this.state.selectedWorkName);
      this.closeWriteOffDialog();
    }
  }

  openWriteOffDialog = () => {
    if (this.props.selectedRemain === null) {
      this.setState({openWarning: true});
    } else {
      this.setState({openWriteOffDialog: true});
    }
  }

  closeWriteOffDialog = () => {
    this.setState({openWriteOffDialog: false});
  }

  onChange = (event, value) => {
    this.setState({amount: parseFloat(value)});
  }

  setSelectedWork = (event, value) => {
    this.setState({selectedWorkName: value});
  }

  closeWarning = () => {
    this.setState({openWarning: false});
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
        style={{margin: 20}} />,
      <TextField
        hintText="Наименование работы"
        type="text"
        onChange={this.setSelectedWork}
        value={this.state.selectedWorkName}
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
        <Snackbar
          open={this.state.openWarning}
          message="Выберете остаток для списания!!!"
          action="Закрыть"
          autoHideDuration={3000}
          onActionTouchTap={this.closeWarning}
          onRequestClose={this.closeWarning} />
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
