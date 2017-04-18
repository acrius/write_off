import {OPEN_ACT,
        CLOSE_ACT} from '../constants.js';

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
  }
  return newState;
}
