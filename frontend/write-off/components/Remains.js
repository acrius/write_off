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
          code: 'Код',
          name: 'Наименование',
          unit: 'Ед.изм.',
          amount: 'Количество'
        }}
        selectedKeys={this.props.selectedRemain}
        setSelected={this.setSelected}
        height="650"
        preScan={false}/>
    );
  }
}
