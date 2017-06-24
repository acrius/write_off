import {GET_REQUEST,
        GET_SUCCESS,
        GET_FAILED,
        POST_REQUEST,
        POST_FAILED,
        POST_ACT_SUCCESS,
        POST_ACT_TABLE_SUCCESS} from '../constants';

export default (action) => {
  return {
    ...getRequestReducer(action),
    ...postRequestReducer(action)
  };
}

function getRequestReducer(action) {
  let newState = {};
  switch (action.type) {
    case GET_REQUEST:
      newState = {
        fetching: true,
        error: ''
      };
      break;
    case GET_FAILED:
      newState = {
        fetching: false,
        error: action.payload.errorMessage
      };
      break;
    case GET_SUCCESS:
      newState = {
        fetching: false,
        error: '',
        ...action.payload
      };
      break;
  }
  return newState;
}

function postRequestReducer(action) {
  let newState = {};
  switch (action.type) {
    case POST_REQUEST:
      newState = {
        fetching: true,
        error: ''
      }
      break;
    case POST_FAILED:
      newState = {
        fetching: false,
        error: action.payload.errorMessage
      }
      break;
    case POST_ACT_SUCCESS:
      newState = {
        selectAct: action.payload,
        fetching: false,
        error: ''
      }
      break;
    case POST_ACT_TABLE_SUCCESS:
      newState = {
        fetching: false,
        error: ''
      }
      break;
  }
  return newState;
}
