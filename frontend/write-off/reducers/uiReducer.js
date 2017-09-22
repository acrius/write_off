import {OPEN_ACT,
        CLOSE_ACT,
        SHOW_ACTS} from '../constants.js';

export default (action) => {
  let newState = {};
  switch (action.type) {
    case OPEN_ACT:
      newState = {
        openAct: true
      };
      break;
    case CLOSE_ACT:
      newState = {
        openAct: false
      };
      break;
    case SHOW_ACTS:
      bewState = {
        showLastActs: action.payload 
      };
  }
  return newState;
}
