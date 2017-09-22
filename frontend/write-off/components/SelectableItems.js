import React, {Component} from 'react';

import SelectableField from './utils/SelectableField';

export class MainThingItem extends Component {
  setSelected = (key) => {
    if (key !== null) {
      this.props.setState({
        selectedMainThing: key,
        selectedMainThingCode: this.props.mainThings.filter(
          (mainThing) => mainThing.id === key
        )[0].code
      });
    } else {
      this.props.setState({
        selectedMainThing: null,
        selectedMainThingCode: ''
      });
    }
  }

  updateDataSource = () => {
    this.props.getModelUpdateData('mainThings');
  }

  render() {
    return (
      <SelectableField
        dataSource={this.props.mainThings}
        keyField="id"
        viewField="name"
        hintText="Основное средство"
        dialogTitle="Выберете основное средство"
        selectedKeys={this.props.selectedKeys}
        setSelected={this.setSelected}
        updateDataSource={this.updateDataSource}
        viewsFields={{
          'code': 'Код',
          'name': 'Наименование'
        }} />
    );
  }
}

export class ReceiverStorageItem extends Component {
  setSelected = (key) => {
    this.props.setState({selectedReceiverStorage: key});
  }

  updateDataSource = () => {
    this.props.getModelUpdateData('storages');
  }

  render() {
    return (
      <SelectableField
        dataSource={this.props.storages}
        keyField="id"
        viewField="name"
        hintText="Склад-приемник"
        dialogTitle="Выберите склад"
        selectedKeys={this.props.selectedKeys}
        setSelected={this.setSelected}
        updateDataSource={this.updateDataSource}
        viewsFields={{
          'code': 'Код',
          'name': 'Наименование'}} />
    );
  }
}

export class SubdivisionItem extends Component {
  setSelected = (key) => {
    this.props.setState({selectedSubdivision: key});
  }

  updateDataSource = () => {
    this.props.getModelUpdateData('subdivisions');
  }

  render() {
    return (
      <SelectableField
        dataSource={this.props.subdivisions}
        keyField="id"
        viewField="name"
        hintText="Подразделение"
        dialogTitle="Выберите подразделение"
        selectedKeys={this.props.selectedKeys}
        setSelected={this.setSelected}
        updateDataSource={this.updateDataSource}
        viewsFields={{
          'code': 'Код',
          'name': 'Наименование'}} />
    );
  }
}

export class StorageItem extends Component {
  setSelected = (key) => {
    this.props.setState({selectedStorage: key});
    this.props.setState({selectedActStorage: key});
    this.props.setState({selectedAct: null, selectedActString: null});
  }

  updateDataSource = () => {
    this.props.getModelUpdateData('storages');
  }

  render() {
    return (
      <SelectableField
        dataSource={this.props.storages}
        keyField="id"
        viewField="name"
        hintText="Склад"
        dialogTitle="Выберите склад"
        selectedKeys={this.props.selectedKeys}
        setSelected={this.setSelected}
        updateDataSource={this.updateDataSource}
        viewsFields={{
          'code': 'Код',
          'name': 'Наименование'}} />
    );
  }
}

export class ActStorageItem extends Component {
  setSelected = (key) => {
    this.props.setState({selectedActStorage: key});
  }

  updateDataSource = () => {
    this.props.getModelUpdateData('storages');
  }

  render() {
    return (
      <SelectableField
        dataSource={this.props.storages}
        keyField="id"
        viewField="name"
        hintText="Склад"
        dialogTitle="Выберите склад"
        selectedKeys={this.props.selectedKeys}
        setSelected={this.setSelected}
        updateDataSource={this.updateDataSource}
        viewsFields={{
          'code': 'Код',
          'name': 'Наименование'}} />
    );
  }
}
