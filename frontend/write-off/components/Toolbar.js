import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import {StorageItem, SubdivisionItem} from './SelectableItems';

export default class WriteOffToolbar extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <SubdivisionItem
            subdivisions={this.props.subdivisions}
            selectedKeys={this.props.selectedSubdivision}
            setState={this.props.setState}
            getModelData={this.props.getModelData}
            getModelUpdateData={this.props.getModelUpdateData} />
          <StorageItem
            storages={this.props.storages}
            selectedKeys={this.props.selectedStorage}
            selectedSubdivision={this.props.selectedSubdivision}
            setState={this.props.setState}
            getModelData={this.props.getModelData}
            getModelUpdateData={this.props.getModelUpdateData} />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
