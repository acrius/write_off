import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import EditActDialog from './EditActDialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import DataTable from './utils/DataTable';
import Label from './utils/Label';

import {ACT_TYPES} from '../constants';


class ActsType extends Component {
  componentDidMount() {
    this.props.setState({startDate: new Date()});
  }

  setSelected = (event, index) => {
    this.props.setState({selectedActsType: index});
  };

  showCountActs = () => {
    this.props.getModelData('acts', '?start_date=' + this.props.startDateString + (this.props.endDateString ? '&end_date=' + this.props.endDateString : ''));
  };

  onChange = (event, value) => {
    this.props.setState({showLastActs: parseInt(value)});
  };

  formatStartDate = (date) => {
    const dateString = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear().toString().slice(-2);
    this.props.setState({startDateString: dateString});
    return dateString;
  };

  selectStartDate = (e, date) => {
    this.props.setState({startDate: date});
  };

  formatEndDate = (date) => {
    const dateString = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear().toString().slice(-2);
    this.props.setState({endDateString: dateString});
    return dateString;
  };

  selectEndDate = (e, date) => {
    this.props.setState({endDate: date});
  };

  render() {
    const items = ACT_TYPES.map((actType, index) =>
      <MenuItem
        value={index}
        key={index}
        primaryText={actType}/>);
    return (
      <Toolbar>
        <ToolbarGroup>
          <Label>Тип акта:</Label>
          <SelectField
            value={this.props.selectedActsType}
            onChange={this.setSelected}
            style={{margin: 20}}>
            {items}
          </SelectField>
          <Label>Показать последние</Label>
          <DatePicker
            floatingLabelText="Период с"
            autoOk={true}
            formatDate={this.formatStartDate}
            onChange={this.selectStartDate}
            value={this.props.startDate}
            style={{margin: 20, marginTop: 0}}/>
          -
          <DatePicker
            floatingLabelText="Период по"
            autoOk={true}
            formatDate={this.formatEndDate}
            onChange={this.selectEndDate}
            value={this.props.endDate}
            style={{margin: 20, marginTop: 0}}/>
          <RaisedButton
            label="Показать"
            primary={true}
            onTouchTap={this.showCountActs}/>
        </ToolbarGroup>
      </Toolbar>
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
            setState={this.props.setState}
            showLastActs={this.props.showLastActs}
            getModelData={this.props.getModelData}
            startDate={this.props.startDate}
            startDateString={this.props.startDateString}
            endDate={this.props.endDate}
            endDateString={this.props.endDateString}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export class UploadDialog extends Component {
  setSelected = (keys) => {
    this.props.setState({selectedUploadActs: keys});
  };

  uploadActs = () => {
    this.props.uploadActs();
    this.props.closeDialog();
  };

  getStorageName = (id) => {
    const storagesNames = this.props
      .storages.filter((storage) => storage.id === id)
      .map((storage) => storage.name);
    return storagesNames.length === 1 ? storagesNames[0] : '';
  };

  render() {
    const actions = [
      <FlatButton
        label="Выбрать"
        primary={true}
        onTouchTap={this.uploadActs}/>,
      <FlatButton
        label="Отменить"
        primary={true}
        onTouchTap={this.props.closeDialog}/>
    ];

    const acts = this.props.acts
      .map((act) => {
        return {...act, receiver_storage: this.getStorageName(act.receiver_storage)}
      });

    return (
      <Dialog
        title="Выберите акты"
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
            receiver_storage: 'Склад приемник',
            download_date: 'Дата загрузки'
          }}
          activated={{
            is_active: {'#669999': false},
            is_upload: {'#a0c4ff': true},
            is_download: {'#ccff99': true}
          }}
          multiSelectable={true}
          selectedKeys={this.props.selectedUploadActs}
          storages={this.props.storages}/>
      </Dialog>
    );
  }
}

export class ReportDialog extends Component {
  formatStartDate = (date) => {
    const dateString = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear().toString().slice(-2);
    this.props.setState({selectedUploadStartDateString: dateString});
    return dateString;
  };

  selectStartDate = (e, date) => {
    this.props.setState({selectedUploadStartDate: date});
  };

  formatEndDate = (date) => {
    const dateString = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear().toString().slice(-2);
    this.props.setState({selectedUploadEndDateString: dateString});
    return dateString;
  };

  selectEndDate = (e, date) => {
    this.props.setState({selectedUploadEndDate: date});
  };

  render() {
    const actions = [
      <FlatButton
        label="Выбрать"
        primary={true}
        onTouchTap={this.props.printUploadReport}/>,
      <FlatButton
        label="Отменить"
        primary={true}
        onTouchTap={this.props.closeDialog}/>
    ];

    return (
      <Dialog
        title="Выберите период"
        actions={actions}
        open={this.props.open}
        onRequestClose={this.props.closeDialog}
        bodyStyle={{overflowY: 'scroll'}}>
        <DatePicker
          floatingLabelText="Период с"
          autoOk={true}
          formatDate={this.formatStartDate}
          onChange={this.selectStartDate}
          value={this.props.selectedUploadStartDate}
          style={{margin: 20}}/>
        <DatePicker
          floatingLabelText="Период по"
          autoOk={true}
          formatDate={this.formatEndDate}
          onChange={this.selectEndDate}
          value={this.props.selectedUploadEndDate}
          style={{margin: 20}}/>
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
      openUploadDialog: false,
      openReportDialog: false
    };
  }

  saveAct = () => {
    this.props.saveAct();
    this.closeAppendDialog();
  };

  openUploadDialog = () => {
    if (this.props.selectedStorage === null || this.props.selectedSubdivision === null) {
      this.openWarning();
    } else {
      this.setState({openUploadDialog: true});
    }
  };

  closeUploadDialog = () => {
    this.setState({openUploadDialog: false});
  };

  openAppendDialog = () => {
    if (this.props.selectedStorage === null || this.props.selectedSubdivision === null) {
      this.openWarning();
    } else {
      this.setState({openAppendDialog: true});
    }
  };

  closeAppendDialog = () => {
    this.setState({openAppendDialog: false});
  };

  openReportDialog = () => {
    this.setState({openReportDialog: true});
  };

  closeReportDialog = () => {
    this.setState({openReportDialog: false});
  };

  openWarning = () => {
    this.setState({openWarning: true});
  };

  closeWarning = () => {
    this.setState({openWarning: false});
  };

  openAct = () => {
    if (this.props.selectedStorage === null || this.props.selectedSubdivision === null) {
      this.openWarning();
    } else {
      if (this.props.selectedAct !== null) {
        this.props.getModelData(['remains',], this.props.selectedActStorage);
        this.props.getModelData('actTable', this.props.selectedAct);
        this.props.setState({openAct: true});
      }
    }
  };

  generateActs = () => {
    if (this.props.selectedStorage === null || this.props.selectedSubdivision === null) {
      this.openWarning();
    } else {
      this.props.generateActs();
    }
  };

  render() {
    let label = 'Активировать';
    if (this.props.selectedAct !== null) {
      const selectedAct = this.props.acts.filter((act) => act.id === this.props.selectedAct)[0];
      label = selectedAct.is_active && !selectedAct.is_upload ? 'Декативировать' : 'Активировать';
    }
    const appendLabel = this.props.selectedAct === null ? 'Добавить' : 'Изменить';

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              label={appendLabel}
              primary={true}
              onTouchTap={this.openAppendDialog}/>
            <RaisedButton
              label={label}
              secondary={true}
              onTouchTap={this.props.activateAct}/>
            <RaisedButton
              label="Открыть"
              onTouchTap={this.openAct}/>
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton
              label='Отчет по выгрузке'
              primary={true}
              onTouchTap={this.openReportDialog}/>
            <RaisedButton
              label='Создать акты'
              secondary={true}
              onTouchTap={this.generateActs}/>
            <RaisedButton
              label="Выгрузить"
              primary={true}
              onTouchTap={this.openUploadDialog}/>
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
          selectedStorekeeper={this.props.selectedStorekeeper}
          storekeepers={this.props.storekeepers}
          saveStorekeeper={this.props.saveStorekeeper}
          deleteStroekeeper={this.props.deleteStroekeeper}/>
        <Snackbar
          open={this.state.openWarning}
          message="Сначала выберите подразделение и склад!!!"
          action="Закрыть"
          autoHideDuration={3000}
          onActionTouchTap={this.closeWarning}
          onRequestClose={this.closeWarning}/>
        <UploadDialog
          open={this.state.openUploadDialog}
          acts={this.props.acts}
          setState={this.props.setState}
          uploadActs={this.props.uploadActs}
          selectedUploadActs={this.props.selectedUploadActs}
          closeDialog={this.closeUploadDialog}
          storages={this.props.storages}/>
        <ReportDialog
          open={this.state.openReportDialog}
          closeDialog={this.closeReportDialog}
          setState={this.props.setState}
          selectedUploadStartDate={this.props.selectedUploadStartDate}
          selectedUploadEndDate={this.props.selectedUploadEndDate}
          printUploadReport={this.props.printUploadReport}/>
      </div>
    );
  }
}
