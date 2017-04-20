import React, {Component} from 'react';
import DataTable from './utils/DataTable';

export class ActTable extends Component {
  setSelected = (key) => {
    this.props.setState({selectedActString: key});
  }

  render() {
    const actTable = this.props.actTable.map((act) => {
      let mainThing = this.props
                           .mainThings
                           .filter((thing) => thing.code == act.main_thing);
      let main_thing = {};
      if (mainThing.length > 0) {
          main_thing['main_thing'] = mainThing[0].name;
      }
      return {...act, ...main_thing};
    });

    return (
      <DataTable
        dataSource={actTable}
        viewsFields={{
          code: 'Код',
          name: 'Наименование',
          account: 'Счет',
          main_thing: 'Основное средство',
          amount: 'Количество'
        }}
        keyField="code"
        selectedKeys={this.props.selectedActString}
        setSelected={this.setSelected}
        height="650" />
    );
  }
}
