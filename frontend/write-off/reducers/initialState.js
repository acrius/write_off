import {STOREKEEPERS} from '../constants';

const models = {
  subdivisions: [],
  storages: [],
  acts: [],
  actTable: [],
  remains: [],
  mainThings: []
};

const selectedFields = {
  selectedSubdivision: null,
  selectedStorage: null,
  selectedActStorage: null,
  selectedActsType: 0,
  selectedAct: null,
  selectedActString: null,
  selectedWorkName: '',
  selectedActDate: null,
  selectedActDateString: null,
  selectedRemain: null,
  selectedReceiverStorage: null,
  selectedMainThing: null,
  selectedMainThingCode: '',
  selectedStorekeeper: STOREKEEPERS[0],
  selectedUploadActs: []
};

const uiValues = {
  uploadComplete: false,
  openAct: false,
  fetching: false,
  error: ''
};

const initialState = {
  ...models,
  ...selectedFields,
  ...uiValues
};

export default initialState;
