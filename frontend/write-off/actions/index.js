import {
  GET_REQUEST,
  GET_FAILED,
  GET_SUCCESS,
  GET_QUERIES_OF_MODELS,
  GET_UPDATED_QUERIES_OF_MODELS,
  POST_REQUEST,
  POST_FAILED,
  POST_ACT_SUCCESS,
  POST_ACT_TABLE_SUCCESS,
  POST_STOREKEEPER_SUCCESS,
  POST_ACT_QUERY,
  POST_ACT_ACTIVATE_QUERY,
  POST_ACT_UPLOADS_QUERY,
  POST_ACT_TABLE_QUERY,
  POST_STOREKEEPER_QUERY,
  GENERATE_ACTS_QUERY,
  SET_STATE,
  MOVING_TYPE,
  ACT_TYPES,
  OPEN_ACT,
  CLOSE_ACT,
  WRITE_OFF,
  PRINT_START,
  PRINT_SUCCESS,
  DELETE_REQUEST,
  DELETE_STOREKEEPER_SUCCESS,
  DELETE_FAILED,
  DELETE_STOREKEEPER_QUERY
} from '../constants';
import {load, getFormatDate} from '../../utils';
import {move, write, generateUploadReport} from './prints';

export function getModelUpdateData(modelsName, queryParam = '') {
  return (dispatch) => {
    if (Array.isArray(modelsName)) {
      modelsName.forEach((modelName) => {
        getModelRequest(dispatch, modelName, GET_UPDATED_QUERIES_OF_MODELS[modelName] + queryParam);
      })
    } else {
      getModelRequest(dispatch, modelsName, GET_UPDATED_QUERIES_OF_MODELS[modelsName] + queryParam);
    }
  };
}

export function getModelData(modelsName, queryParam = '') {
  return (dispatch) => {
    if (Array.isArray(modelsName)) {
      modelsName.forEach((modelName) => {
        getModelRequest(dispatch, modelName, GET_QUERIES_OF_MODELS[modelName] + queryParam);
      })
    } else {
      getModelRequest(dispatch, modelsName, GET_QUERIES_OF_MODELS[modelsName] + queryParam);
    }
  };
}

export function saveStorekeeper(storekeeperName) {
  return (dispatch) => {
    dispatch({type: POST_REQUEST});

    const storekeeperData = {name: storekeeperName};

    try {
      fetch(POST_STOREKEEPER_QUERY,
        {
          'mode': 'cors',
          'method': 'post',
          'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Request-Headers': 'Accept',
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(storekeeperData)
        }
      ).then(
        () => {
          getModelRequest(dispatch, 'storekeepers', GET_QUERIES_OF_MODELS['storekeepers']);
        }
      );
    } catch (e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  }
}

function getModelRequest(dispatch, modelName, query) {
  dispatch({type: GET_REQUEST});
  try {
    load(query).then(
      (data) => {
        let payloadData = {};
        payloadData[modelName] = data;
        dispatch({
          type: GET_SUCCESS,
          payload: payloadData
        });
      });
  } catch (e) {
    dispatch({
      type: GET_FAILED,
      payload: new Error(e)
    });
  }
}

export function setState(newState) {
  return (dispatch) => {
    setStateWithDispatch(dispatch, newState);
  };
}

function setStateWithDispatch(dispatch, newState) {
  dispatch({
    type: SET_STATE,
    payload: newState
  });
}

export function saveAct() {
  return (dispatch, getState) => {
    dispatch({type: POST_REQUEST});

    const state = getState().writeOff;

    let actData = {
      date: state.selectedActDateString,
      storage: state.selectedActStorage,
      act_type: state.selectedActsType,
      subdivision: state.selectedSubdivision,
      storekeeper: state.selectedStorekeeper
    };

    if (ACT_TYPES.indexOf(MOVING_TYPE) === actData.act_type) {
      actData['receiver_storage'] = state.selectedReceiverStorage;
    }

    if (state.selectedAct !== null) {
      actData['id'] = state.selectedAct;
    }

    try {
      fetch(POST_ACT_QUERY,
        {
          'mode': 'cors',
          'method': 'post',
          'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Request-Headers': 'Accept',
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(actData)
        }
      ).then(
        () => {
          getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + '?start_date=' + state.startDateString + (state.endDateString ? '&end_date=' + state.endDateString : ''));
        }
      );
    } catch (e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  };
}

export function writeOff(amount, selectedWorkName) {
  return (dispatch, getState) => {
    const state = getState().writeOff;
    const remain = state.remains.filter((remain) => remain.id === state.selectedRemain)[0];

    let append = false;

    let actTable = state.actTable.map((act) => {
      let newAct = act;
      if (newAct.code == remain.code && newAct.main_thing == state.selectedMainThingCode && newAct.work_name == selectedWorkName) {
        newAct.amount = parseFloat(newAct.amount) + parseFloat(amount);
        append = true;
      }
      return newAct;
    });

    if (!append) {
      actTable.push({
        code: remain.code,
        name: remain.name,
        account: remain.account,
        amount: amount,
        main_thing: state.selectedMainThingCode,
        unit: remain.unit,
        unit_code: remain.unitcode,
        work_name: selectedWorkName
      });
    }


    dispatch({
      type: WRITE_OFF,
      payload: actTable
    });

    setStateWithDispatch(dispatch, {selectedRemain: null});
  };
}

export function saveActTable() {
  return (dispatch, getState) => {
    setStateWithDispatch(dispatch, {selectedRemain: null, selectedActString: null});

    dispatch({type: POST_REQUEST});

    const state = getState().writeOff;

    const currentDate = new Date();

    const actTable = state.actTable.map((actString) => {
      return {
        ...actString,
        act: state.selectedAct,
        time: actString.time ? actString.time : '' + currentDate.getHours() + ':' + currentDate.getMinutes(),
        date_of_write_off: actString.date_of_write_off ? actString.date_of_write_off : getFormatDate(currentDate)
      };
    });

    try {
      fetch(POST_ACT_TABLE_QUERY + state.selectedAct,
        {
          'mode': 'cors',
          'method': 'post',
          'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Request-Headers': 'Accept',
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(actTable)
        }
      ).then(
        () => {
          getModelRequest(dispatch, 'actTable', GET_QUERIES_OF_MODELS['actTable'] + state.selectedAct);
          getModelRequest(dispatch, 'remains', GET_QUERIES_OF_MODELS['remains'] + state.selectedActStorage);
        }
      );
    } catch (e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  };
}

export function activateAct() {
  return (dispatch, getState) => {
    const state = getState().writeOff;

    try {
      fetch(POST_ACT_ACTIVATE_QUERY + state.selectedAct,
        {
          'mode': 'cors',
          'method': 'post',
          'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Request-Headers': 'Accept',
            'Content-Type': 'application/json'
          },
          'body': ''
        }
      ).then(
        () => {
          getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + '?start_date=' + state.startDateString + (state.endDateString ? '&end_date=' + state.endDateString : ''));
        }
      );
    } catch (e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  }
}

export function deleteStroekeeper() {
  return (dispatch, getState) => {
    const state = getState().writeOff;

    dispatch({type: DELETE_REQUEST});

    if (state.selectedStorekeeper) {
      try {
        fetch(DELETE_STOREKEEPER_QUERY + state.selectedStorekeeper,
          {
            'mode': 'cors',
            'method': 'delete',
            'body': ''
          }
        ).then(
          () => {
            getModelRequest(dispatch, 'storekeepers', GET_QUERIES_OF_MODELS['storekeepers']);
            setState({selectedStorekeeper: ''});
          }
        );
      } catch (e) {
        dispatch({
          type: DELETE_FAILED,
          payload: new Error(e)
        });
      }
    }
  }
}

export function uploadActs() {
  return (dispatch, getState) => {
    const state = getState().writeOff;

    try {
      fetch(POST_ACT_UPLOADS_QUERY + state.selectedStorage,
        {
          'mode': 'cors',
          'method': 'post',
          'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Request-Headers': 'Accept',
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(state.selectedUploadActs)
        }
      ).then(response => response.json())
        .then(success => {
          getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + '?start_date=' + state.startDateString + (state.endDateString ? '&end_date=' + state.endDateString : ''));
          if (success) {
            setStateWithDispatch(dispatch, {uploadComplete: true});
          } else {
            setStateWithDispatch(dispatch, {uploadError: true});
          }
        });
    } catch (e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  }
}

export function removeActString() {
  return (dispatch, getState) => {
    const state = getState().writeOff;
    if (state.selectedActString !== null) {
      setStateWithDispatch(dispatch, {
        actTable: state.actTable.filter((actString) =>
          actString.code !== state.selectedActString
        )
      });
      getModelRequest(dispatch, 'remains', GET_QUERIES_OF_MODELS['remains'] + state.selectedActStorage);
    }
  }
}

export function generateActs() {
  return (dispatch, getState) => {
    const state = getState().writeOff;

    dispatch({
      type: GET_REQUEST
    });

    try {
      load(GENERATE_ACTS_QUERY + state.selectedSubdivision).then(
        (data) => {
          dispatch({
            type: GET_SUCCESS,
            payload: {acts: data}
          });
        });
    } catch (e) {
      dispatch({
        type: GET_FAILED,
        payload: new Error(e)
      });
    }
  }
}

export function print() {
  return (dispatch, getState) => {
    dispatch({
      type: PRINT_START
    });

    const state = getState().writeOff;
    if (state.selectedActsType == 1) {
      move(state);
    } else {
      write(state);
    }

    dispatch({
      type: PRINT_SUCCESS
    });
  }
}

export function printUploadReport() {
  return (dispatch, getState) => {
    const startUploadDate = getState().writeOff.selectedUploadStartDateString;
    const endUploadDate = getState().writeOff.selectedUploadEndDateString;

    let query = GET_QUERIES_OF_MODELS['acts'];

    if (startUploadDate) {
      query += `?upload_start=${startUploadDate}`
    } else {
      query += `?upload_start=01.01.00`
    }

    if (endUploadDate) {
      query += `&upload_end=${endUploadDate}`;
    } else {
      query += `&upload_end=31.12.30`;
    }

    load(query).then(
      data =>
        generateUploadReport(data, getState().writeOff));
  };

}
