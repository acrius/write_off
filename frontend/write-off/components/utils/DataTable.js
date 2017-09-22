import React, {Component} from 'react';
import {Table, TableBody, TableHeader,
        TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui';

export default class DataTable extends Component {
  static propTypes = {
    dataSource: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    viewsFields: React.PropTypes.object,
    keyField: React.PropTypes.string.isRequired,
    selectedKeys: React.PropTypes.any,
    setSelected: React.PropTypes.func,
    height: React.PropTypes.any,
    multiSelectable: React.PropTypes.bool,
    activated: React.PropTypes.object
  }

  static defaultProps = {
    dataSource: [],
    viewsFields: {},
    keyField: 'id',
    height: 'auto',
    selectedKeys: null,
    multiSelectable: false,
    setSelected: null,
    activated: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: this.getSelectedRowsFromKeys(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({selectedRows: this.getSelectedRowsFromKeys(nextProps)});
  }

  getSelectedRowsFromKeys = (props) => {
    let selectedRows = [];
    if (props.selectedKeys !== null) {
      props.dataSource.forEach((data, index) => {
        if (props.multiSelectable ?
        props.selectedKeys.indexOf(data[props.keyField]) !== -1
        : data[props.keyField] === props.selectedKeys) {
          selectedRows.push(index);
        }
      });
    }

    return selectedRows;
  }

  onCellClick = (key) => {
    if (this.props.multiSelectable) {
      this.multiSelect(key);
    } else {
      this.select(key);
    }
  }

  select = (key) => {
    let selectedRows = this.state.selectedRows;
    if (selectedRows.length === 1) {
      selectedRows = selectedRows[0] === key ? [] : [key];
    } else if (selectedRows.length === 0) {
      selectedRows = [key];
    } else {
      selectedRows = [];
    }
    this.setSelected(selectedRows);
  }

  multiSelect = (key) => {
    let selectedRows = this.state.selectedRows;
    if (selectedRows.indexOf(key) === -1) {
      selectedRows = this.state.selectedRows;
      selectedRows.push(key);
    } else {
      selectedRows = this.state.selectedRows.filter((row) => row !== key)
    }

    this.setSelected(selectedRows);
  }

  setSelected = (selectedRows) => {
    this.setState({selectedRows: selectedRows});

    if (this.props.setSelected !== null) {
      let keys = this.props.dataSource
                           .filter((data, index) => selectedRows.indexOf(index) !== -1)
                           .map((data) => data[this.props.keyField]);

      if(!this.props.multiSelectable) {
        if (keys.length > 0) {
          keys = keys[0];
        } else {
          keys = null;
        }
      }

      this.props.setSelected(keys)
    }
  }

  getViewsFields = () => {
    var viewsFields = {};
    if (this.props.dataSource.length > 0) {
      for (var key in this.props.dataSource[0]){
        viewsFields[key] = key;
      }
    }

    return viewsFields;
  }

  getWidth = (columnName) => {
    let width = 'auto';
    const widths = {
      code: 70,
      amount: 70,
      work_name: 250,
      unit: 70
    };

    if (columnName in widths) {
      width = widths[columnName];
    }

    return width;
  }

  createColumnsStyles = (keyFields) => {
    let columnsStyles = {};

    for (var index = 0; index < keyFields.length; index++) {
      columnsStyles[keyFields[index]] = {
        width: this.getWidth(keyFields[index]),
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      };
    }

    return columnsStyles;
  }

  getActivatedColor = (data) => {
    var color;
    for (var field in this.props.activated) {
      for (var valueField in this.props.activated[field]) {
        if (data[field] == this.props.activated[field][valueField]){
          color = valueField;
        }
      }
    }
    return color ? {backgroundColor: color} : {}
  }

  render() {
    const viewsFields = Object.keys(this.props.viewsFields).length > 0 ? this.props.viewsFields : this.getViewsFields();

    const keyFields = Object.keys(viewsFields).map((key, index) => key);
    const columnsStyles = this.createColumnsStyles(keyFields);

    const activated = Object.keys(this.props.activated).length > 0 ? true : false;

    const rows = this.props.dataSource.map((data, index) =>
      {
        const style = activated ? this.getActivatedColor(data) : {};
        return (
          <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}
            style={style}>
            {keyFields.map((key, index) =>
              <TableRowColumn style={columnsStyles[key]} key={index}>{data[key]}</TableRowColumn>)}
          </TableRow>)});

    return (
      <Table
        height={this.props.height}
        onCellClick={this.onCellClick}
        multiSelectable={this.props.multiSelectable}>
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}>
          <TableRow>
            {keyFields.map((key, index) => {
              const columnStyle = {
                width: this.getWidth(key)
              };
              return <TableHeaderColumn style={columnStyle} key={index}>{viewsFields[key]}</TableHeaderColumn>})}
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          displayRowCheckbox={false}
          preScanRows={false}>
          {rows}
        </TableBody>
      </Table>
    );
  }
}
