import React, {Component} from 'react';
import {ReceiverStorageItem} from './SelectableItems';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import {ACT_TYPES, MOVING_TYPE} from '../constants';

export default class EditActDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSelectDialog: false,
      openWarning: false};
  }

  selectStorage = (id) => {
    this.props.setState({selectedReceiverStorage: id});
    this.closeSelectDialog();
  }

  openSelectStorageDialog = () => {
    this.setState({openSelectDialog: true});
  }

  closeSelectDialog = () => {
    this.setState({openSelectDialog: false});
  }

  formatDate = (date) => {
    const dateString = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear().toString().slice(-2);
    this.props.setState({selectedActDateString: dateString});
    return dateString;
  }

  selectDate = (e, date) => {
    this.props.setState({selectedActDate: date});
  }

  openWarning = () => {
    this.setState({openWarning: true});
  }

  closeWarning = () => {
    this.setState({openWarning: false});
  }

  saveAct = () => {
    if ((this.props.selectedActDateString === null) || ((this.props.selectedReceiverStorage === null) && (ACT_TYPES[this.props.selectedActsType] === MOVING_TYPE))) {
      this.openWarning();
    } else {
      this.props.saveAct();
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Сохранить"
        primary={true}
        onTouchTap={this.saveAct} />,
      <FlatButton
        label="Отмена"
        secondary={true}
        onTouchTap={this.props.closeDialog} />
    ];

    let selectedStorageName = '';
    if (this.props.selectedReceiverStorage) {
      selectedStorageName = this.props
                                    .storages
                                    .filter(
                                      (storage) =>
                                        storage.id === this.props.selectedReceiverStorage)[0].name;
    }

    return (
      <div>
        <Dialog
          title="Введите данные акта:"
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.closeDialog}
          actions={actions}
          >
          <DatePicker
            floatingLabelText="Дата акта"
            autoOk={true}
            formatDate={this.formatDate}
            onChange={this.selectDate}
            value={this.props.selectedActDate}
            style={{margin: 20}}/>
          {(ACT_TYPES[this.props.selectedActsType] === MOVING_TYPE)  &&
            <div>
              <ReceiverStorageItem
                storages={this.props.storages}
                selectedKeys={this.props.selectedReceiverStorage}
                setState={this.props.setState}
                />
            </div>}
        </Dialog>
        <Snackbar
          open={this.state.openWarning}
          message="Необходимо заполнить данные акта!!!"
          action="Закрыть"
          autoHideDuration={3000}
          onActionTouchTap={this.closeWarning}
          onRequestClose={this.closeWarning} />
      </div>
    );
  }
}
