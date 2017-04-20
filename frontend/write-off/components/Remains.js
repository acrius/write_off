import React, {Component} from 'react';
import DataTable from './utils/DataTable';

export class RemainsTable extends Component {
  setSelected = (key) => {
    this.props.setState({selectedRemain: key});
  }

  render() {
    return (
      <DataTable
        dataSource={this.props.remains}
        viewsFields={{
          account: 'Счет',
          code: 'Код',
          name: 'Наименование',
          amount: 'Количество'
        }}
        selectedKeys={this.props.selectedRemain}
        setSelected={this.setSelected}
        height="550" />
    );
  }
}
