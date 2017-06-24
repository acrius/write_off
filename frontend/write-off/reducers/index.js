import initialState from './initialState';
import requestReducer from './requestReducer';
import selectedFieldsReducer from './selectedFieldsReducer';
import uiReducer from './uiReducer';

export default (state = initialState, action) => {
  const newState = {
    ...requestReducer(action),
    ...selectedFieldsReducer(action),
    ...uiReducer(action)
  };

  return {
    ...state,
    ...newState
  };
}
