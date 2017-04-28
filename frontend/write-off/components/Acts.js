import React, {Component} from 'react';

import {SelectStorageDialog} from './Toolbar';
import DataTable from './utils/DataTable';

import {getStorageName} from '../../utils';

export class Acts extends Component {
  setSelected = (id) => {
    if (id !== null) {
      const act = this.props.acts.filter((act) => act.id === id)[0];

      if (act.date) {
        const dateArray = act.date.split('.');
        const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
        this.props.setState({selectedActDate: date});
      }

      this.props.setState({selectedAct: id,
                           selectedStorekeeper: act.storekeeper,
                           selectedActStorage: act.storage,
                           selectedReceiverStorage: act.receiver_storage,
                           selectedActDateString: act.date});
    } else {
      this.props.setState({selectedAct: null});
    }
  }

  render() {
    const acts = this.props
                     .acts.filter((act) => act.act_type == this.props.selectedActsType)
                     .map((act) => {
                        return {...act,
                                receiver_storage: getStorageName(act.receiver_storage, this.props.storages),
                                storage: getStorageName(act.storage, this.props.storages) }});

    return (
      <div>
        <DataTable
          dataSource={acts}
          keyField="id"
          selectedKeys={this.props.selectedAct}
          setSelected={this.setSelected}
          viewsFields={{
            id: 'Номер',
            date: 'Дата',
            storage: 'Склад',
            storekeeper: 'Кладовщик',
            receiver_storage: 'Склад приемник'
          }}
          height="650"
          activated={{
            is_active: {'#669999': false},
            is_upload: {'#ccff99': true}
          }}/>
      </div>
    );
  }
}
