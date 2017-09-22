import {SET_STATE, WRITE_OFF} from '../constants';

export default (action) => {
  let newState = {};
  switch (action.type) {
    case SET_STATE:
      newState = action.payload;
      break;
    case WRITE_OFF:
      newState = {
        actTable: action.payload
      };
      break;
  }
  return newState;
}
