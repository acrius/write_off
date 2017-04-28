import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import EditActDialog from './EditActDialog';
import RaisedButton from 'material-ui/RaisedButton';

import DataTable from './utils/DataTable';

import {ACT_TYPES} from '../constants';

class ActsType extends Component {
  setSelected = (event, index) => {
    this.props.setState({selectedActsType: index});
  }

  render() {
    const items = ACT_TYPES.map((actType, index) =>
                                    <MenuItem
                                      value={index}
                                      key={index}
                                      primaryText={actType}/>);
    return (
      <div>
        <SelectField
          value={this.props.selectedActsType}
          onChange={this.setSelected}
          style={{margin: 20}}>
          {items}
        </SelectField>
      </div>
    );
  }
}

export class ActsToolbar extends Component {
  render() {
    return (
      <Toolbar
        style={this.props.style}>
        <ToolbarGroup>
          <ActsType
            selectedActsType={this.props.selectedActsType}
            setState={this.props.setState}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export class UploadDialog extends Component {
  setSelected = (keys) => {
    this.props.setState({selectedUploadActs: keys});
  }

  uploadActs = () => {
      this.props.uploadActs();
      this.props.closeDialogs();
  }

  getStorageName = (id) => {
    const storagesNames = this.props
                              .storages.filter((storage) => storage.id === id)
                              .map((storage) => storage.name);
    return storagesNames.length === 1 ? storagesNames[0] : '';
  }

  render() {
    const actions = [
      <FlatButton
        label="Выбрать"
        primary={true}
        onTouchTap={this.uploadActs} />,
      <FlatButton
        label="Отменить"
        primary={true}
        onTouchTap={this.props.closeDialogs}/>
    ];

    const acts = this.props.acts
                     .map((act) => {
                        return {...act, receiver_storage: this.getStorageName(act.receiver_storage)}});

    return (
      <Dialog
        title="Выберете акты"
        actions={actions}
        open={this.props.open}
        onRequestClose={this.props.closeDialog}
        bodyStyle={{overflowY: 'scroll'}}>
        <DataTable
          dataSource={acts}
          setSelected={this.setSelected}
          keyField="id"
          viewsFields={{
            id: 'Номер',
            date: 'Дата',
            receiver_storage: 'Склад приемник'
          }}
          activated={{
            is_active: {'#669999': false},
            is_upload: {'#ccff99': true}
          }}
          multiSelectable={true}
          selectedKeys={this.props.selectedUploadActs}
          storages={this.props.storages} />
      </Dialog>
    );
  }
}

export class ActsActionsToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAppendDialog: false,
      openWarning: false,
      openUploadDialog: false
    };
  }

  saveAct = () => {
    this.props.saveAct();
    this.closeAppendDialog();
  }

  openUploadDialog = () => {
    this.setState({openUploadDialog: true});
  }

  closeUploadDialog = () => {
    this.setState({openUploadDialog: false});
  }

  openAppendDialog = () => {
    if (this.props.selectedStorage === null) {
      this.openWarning();
    } else {
      this.setState({openAppendDialog: true});
    }
  }

  closeAppendDialog = () => {
    this.setState({openAppendDialog: false});
  }

  openWarning = () => {
    this.setState({openWarning: true});
  }

  closeWarning = () => {
    this.setState({openWarning: false});
  }

  openAct = () => {
    if (this.props.selectedAct !== null) {
      this.props.getModelData(['remains', ], this.props.selectedActStorage);
      this.props.getModelData('actTable', this.props.selectedAct);
      this.props.setState({openAct: true});
    }
  }

  render() {
    const label = 'Активировать';
    const appendLabel = this.props.selectedAct === null ? 'Добавить' : 'Изменить';

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              label={appendLabel}
              primary={true}
              onTouchTap={this.openAppendDialog} />
            <RaisedButton
              label={label}
              secondary={true}
              onTouchTap={this.props.activateAct} />
            <RaisedButton
              label="Открыть"
              onTouchTap={this.openAct} />
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton
              label='Создать акты'
              secondary={true}
              onTouchTap={this.props.generateActs} />
            <RaisedButton
              label="Выгрузить"
              primary={true}
              onTouchTap={this.openUploadDialog} />
          </ToolbarGroup>
        </Toolbar>
        <EditActDialog
          open={this.state.openAppendDialog}
          closeDialog={this.closeAppendDialog}
          storages={this.props.storages}
          getModelUpdateData={this.props.getModelUpdateData}
          selectedReceiverStorage={this.props.selectedReceiverStorage}
          saveAct={this.saveAct}
          setState={this.props.setState}
          selectedActDateString={this.props.selectedActDateString}
          selectedActDate={this.props.selectedActDate}
          selectedActsType={this.props.selectedActsType}
          selectedActStorage={this.props.selectedActStorage}
          selectedStorekeeper={this.props.selectedStorekeeper} />
        <Snackbar
          open={this.state.openWarning}
          message="Сначала выберите склад!!!"
          action="Закрыть"
          autoHideDuration={3000}
          onActionTouchTap={this.closeWarning}
          onRequestClose={this.closeWarning} />
        <UploadDialog
          open={this.state.openUploadDialog}
          acts={this.props.acts}
          setState={this.props.setState}
          uploadActs={this.props.uploadActs}
          selectedUploadActs={this.props.selectedUploadActs}
          closeDialogs={this.closeUploadDialog}
          storages={this.props.storages} />
      </div>
    );
  }
}
