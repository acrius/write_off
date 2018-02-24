import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMiuTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

import Toolbar from '../components/Toolbar';
import {ActsToolbar, ActsActionsToolbar} from '../components/ActsToolbar';
import {ActTableActionsToobar, ActTableToolbar} from '../components/ActTableToolbar';
import {RemainsToolbar} from '../components/RemainsToolbar';
import {RemainsTable} from '../components/Remains';
import {ActTable} from '../components/ActTable';
import {Acts} from '../components/Acts';

import * as actions from '../actions';

const muiTheme = getMiuTheme();

class WriteOff extends Component {
  componentDidMount() {
    this.props.actions.getModelData(['subdivisions', 'storages', 'mainThings', 'storekeepers']);
    this.props.actions.getModelData('acts', '?count=' + this.props.showLastActs);
  }

  closeUploadSnackbar = () => {
    this.props.actions.setState({uploadComplete: false});
  };

  render() {
    const actsStyle = {
      width: this.props.openAct ? '0%' : '100%',
      display: this.props.openAct ? 'none' : 'block',
      float: 'left'};
    const actTableStyle = {
      width: this.props.openAct ? '50%' : '0%',
      display: this.props.openAct ? 'inline-block' : 'none',
      float: 'left'};
    const remainsTableStyle = {
      width: this.props.openAct ? '50%' : '0%',
      display: this.props.openAct ? 'inline-block' : 'none',
      float: 'right'};

    const mainStyle = {};
    const progressStyle = {display: 'none'};

    const actsToolbarStyle = {display: this.props.openAct ? 'none' : 'flex'};
    const actTableActionsToolbarStyle = {display: this.props.openAct ? 'flex' : 'none'};
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div style={mainStyle}>
            <Toolbar
              subdivisions={this.props.subdivisions}
              setState={this.props.actions.setState}
              selectedSubdivision={this.props.selectedSubdivision}
              storages={this.props.storages}
              selectedStorage={this.props.selectedStorage}
              getModelData={this.props.actions.getModelData}
              getModelUpdateData={this.props.actions.getModelUpdateData} />

              <ActsToolbar
                style={actsToolbarStyle}
                selectedActsType={this.props.selectedActsType}
                setState={this.props.actions.setState}
                showLastActs={this.props.showLastActs}
                getModelData={this.props.actions.getModelData} />
              <ActTableActionsToobar
                saveActTable={this.props.actions.saveActTable}
                setState={this.props.actions.setState}
                style={actTableActionsToolbarStyle} />
            <div>
            <div style={actsStyle}>
              <Acts
                acts={this.props.acts}
                selectedActsType={this.props.selectedActsType}
                storages={this.props.storages}
                selectedAct={this.props.selectedAct}
                setState={this.props.actions.setState} />
              <ActsActionsToolbar
                storages={this.props.storages}
                getModelData={this.props.actions.getModelData}
                getModelUpdateData={this.props.actions.getModelUpdateData}
                setState={this.props.actions.setState}
                selectedReceiverStorage={this.props.selectedReceiverStorage}
                saveAct={this.props.actions.saveAct}
                selectedAct={this.props.selectedAct}
                selectedActDate={this.props.selectedActDate}
                selectedActDateString={this.props.selectedActDateString}
                selectedStorage={this.props.selectedStorage}
                selectedSubdivision={this.props.selectedSubdivision}
                selectedActsType={this.props.selectedActsType}
                selectedUploadActs={this.props.selectedUploadActs}
                selectedActStorage={this.props.selectedActStorage}
                selectedStorekeeper={this.props.selectedStorekeeper}
                activateAct={this.props.actions.activateAct}
                uploadActs={this.props.actions.uploadActs}
                generateActs={this.props.actions.generateActs}
                acts={this.props.acts}
                storages={this.props.storages}
                storekeepers={this.props.storekeepers}
                saveStorekeeper={this.props.actions.saveStorekeeper}
                deleteStroekeeper={this.props.actions.deleteStroekeeper}
                selectedUploadStartDate={this.props.selectedUploadStartDate}
                selectedUploadEndDate={this.props.selectedUploadEndDate}
                printUploadReport={this.props.actions.printUploadReport}
              />
            </div>
            <div style={actTableStyle}>
                <ActTable
                  actTable={this.props.actTable}
                  selectedActString={this.props.selectedActString}
                  setState={this.props.actions.setState}
                  mainThings={this.props.mainThings} />
                <ActTableToolbar
                  removeActString={this.props.actions.removeActString}
                  print={this.props.actions.print} />
            </div>
            <div style={remainsTableStyle}>
                <RemainsTable
                  remains={this.props.remains}
                  selectedRemain={this.props.selectedRemain}
                  setState={this.props.actions.setState} />
                <RemainsToolbar
                  selectedStorage={this.props.selectedActStorage}
                  getModelUpdateData={this.props.actions.getModelUpdateData}
                  writeOff={this.props.actions.writeOff}
                  setState={this.props.actions.setState}
                  mainThings={this.props.mainThings}
                  selectedMainThing={this.props.selectedMainThing}
                  selectedSubdivision={this.props.selectedSubdivision}
                  selectedActsType={this.props.selectedActsType}
                  selectedRemain={this.props.selectedRemain} />
            </div>
          </div>
        </div>
        <Snackbar
          open={this.props.uploadComplete}
          message="Выгрузка завершена"
          autoHideDuration={5000}
          onRequestClose={this.closeUploadSnackbar} />
      </div>
    </MuiThemeProvider>);
  }
}

function mapStateToProps(state) {
  return {...state.writeOff};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WriteOff);
