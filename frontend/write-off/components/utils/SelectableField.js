import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DataTable from './DataTable';

class SelectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedKey: null};
  }

  setSelected = (key) => {
    this.state = {selectedKey: key};
  };

  select = () => {
    this.props.setSelected(this.state.selectedKey);
    this.props.closeDialog();
  };

  render() {
    let actions = [
      <FlatButton
        label="Выбрать"
        primary={true}
        onTouchTap={this.select}
      />,
      <FlatButton
        label="Отмена"
        primary={true}
        onTouchTap={this.props.closeDialog}
      />
    ];
    if (this.props.updateDataSource !== null) {
      actions.push(<FlatButton
                      label="Обновить"
                      secondary={true}
                      onTouchTap={this.props.updateDataSource} />);
    }

    return (
      <Dialog
        title={this.props.dialogTitle}
        actions={actions}
        open={this.props.open}
        onRequestClose={this.props.closeDialog}
        bodyStyle={{overflowY: 'scroll'}}>
        <DataTable
          dataSource={this.props.dataSource}
          viewsFields={this.props.viewsFields}
          keyField={this.props.keyField}
          setSelected={this.setSelected}
          selectedKeys={this.props.selectedKeys} />
      </Dialog>
    );
  }
}

export default class SelectableField extends Component {
  static propTypes = {
    dataSource: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    viewsFields: React.PropTypes.object,
    keyField: React.PropTypes.string.isRequired,
    viewField: React.PropTypes.string.isRequired,
    hintText: React.PropTypes.string,
    dialogTitle: React.PropTypes.string.isRequired,
    setSelected: React.PropTypes.func,
    updateDataSource: React.PropTypes.func,
    selectedKeys: React.PropTypes.any
  };

  static defaultProps = {
    dataSource: [],
    viewsFields: [],
    keyField: 'id',
    viewField: 'id',
    hintText: 'id',
    dialogTitle: 'Select value',
    selectedKeys: null,
    setSelected: null,
    updateDataSource: null
  };

  constructor(props) {
    super(props);
    this.state = {
      openSelectDialog: false,
      viewSelectedValue: ''
    };
  }

  componentDidMount() {
    if (this.props.selectedKeys !== null) {
      this.setView(this.props.selectedKeys);
    }
  }

  openSelectDialog = () => {
    this.setState({openSelectDialog: true});
  };

  closeSelectDialog = () => {
    this.setState({openSelectDialog: false});
  };

  clearSelectedValue = () => {
    this.setSelected(null);
  };

  setSelected = (key) => {
    if (this.props.setSelected !== null) {
      this.props.setSelected(key);
    }
    this.setView(key);
  };

  setView = (keys) => {
    const viewSelectedValue = this.props
                                  .dataSource.filter((data) => data[this.props.keyField] === keys)
                                             .map((data) => data[this.props.viewField]).join(',');
    this.setState({viewSelectedValue: viewSelectedValue});
  };

  render() {
    return (
      <div>
        <TextField
          hintText={this.props.hintText}
          value={this.state.viewSelectedValue}
          style={{width: 350, margin: 20}}/>
        <RaisedButton
          label="..."
          onTouchTap={this.openSelectDialog} />
        <RaisedButton
          label="X"
          onTouchTap={this.clearSelectedValue}
          secondary={true} />
        <SelectDialog
          dialogTitle={this.props.dialogTitle}
          open={this.state.openSelectDialog}
          closeDialog={this.closeSelectDialog}
          dataSource={this.props.dataSource}
          viewsFields={this.props.viewsFields}
          setSelected={this.setSelected}
          updateDataSource={this.props.updateDataSource}
          selectedKeys={this.props.selectedKeys} />
      </div>
    );
  }
}
