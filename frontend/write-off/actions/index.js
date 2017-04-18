import {GET_REQUEST,
        GET_FAILED,
        GET_SUCCESS,
        GET_QUERIES_OF_MODELS,
        GET_UPDATED_QUERIES_OF_MODELS,
        POST_REQUEST,
        POST_FAILED,
        POST_ACT_SUCCESS,
        POST_ACT_TABLE_SUCCESS,
        POST_ACT_QUERY,
        POST_ACT_ACTIVATE_QUERY,
        POST_ACT_UPLOADS_QUERY,
        POST_ACT_TABLE_QUERY,
        SET_STATE,
        MOVING_TYPE,
        ACT_TYPES,
        OPEN_ACT,
        CLOSE_ACT,
        WRITE_OFF} from '../constants';
import {load} from '../../utils';

export function getModelUpdateData(modelsName, queryParam='') {
  return (dispatch) => {
    if (Array.isArray(modelsName)) {
      modelsName.forEach((modelName) => {
      getModelRequest(dispatch, modelName, GET_UPDATED_QUERIES_OF_MODELS[modelName] + queryParam);})
    } else {
      getModelRequest(dispatch, modelsName, GET_UPDATED_QUERIES_OF_MODELS[modelsName] + queryParam);
    }
  };
}

export function getModelData(modelsName, queryParam='') {
  return (dispatch) => {
    if (Array.isArray(modelsName)) {
      modelsName.forEach((modelName) => {
      getModelRequest(dispatch, modelName, GET_QUERIES_OF_MODELS[modelName] + queryParam);})
    } else {
      getModelRequest(dispatch, modelsName, GET_QUERIES_OF_MODELS[modelsName] + queryParam);
    }
  };
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
  } catch(e) {
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
      storage: state.selectedStorage,
      act_type: state.selectedActsType
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
        () => {getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + state.selectedStorage);}
      );
    } catch(e) {
      dispatch({
        type: POST_FAILED,
        payload: new Error(e)
      });
    }
  };
}

export function writeOff(amount) {
  return (dispatch, getState) => {
    const state = getState().writeOff;
    const remain = state.remains.filter((remain) => remain.id === state.selectedRemain)[0];

    let append = false;

    let actTable = state.actTable.map((act) => {
      let newAct = act;
      if (newAct.code == remain.code && newAct.main_thing == state.selectedMainThingCode) {
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
        main_thing: state.selectedMainThingCode
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

    const actTable = state.actTable.map((actString) => {
      return {
        ...actString,
        act: state.selectedAct
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
            getModelRequest(dispatch, 'remains', GET_QUERIES_OF_MODELS['remains'] + state.selectedStorage);
          }
      );
    } catch(e) {
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
            getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + state.selectedStorage);
            getModelRequest(dispatch, 'remains', GET_QUERIES_OF_MODELS['remains'] + state.selectedStorage);}
        );
      } catch(e) {
        dispatch({
          type: POST_FAILED,
          payload: new Error(e)
        });
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
      ).then(
        () => {
          getModelRequest(dispatch, 'acts', GET_QUERIES_OF_MODELS['acts'] + state.selectedStorage);
          setStateWithDispatch(dispatch, {uploadComplete: true});
      });
    } catch(e) {
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
      getModelRequest(dispatch, 'remains', GET_QUERIES_OF_MODELS['remains'] + state.selectedStorage);
    }
  }
}
