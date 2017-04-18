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
  selectedActsType: 0,
  selectedAct: null,
  selectedActString: null,
  selectedActDate: null,
  selectedActDateString: null,
  selectedRemain: null,
  selectedReceiverStorage: null,
  selectedMainThing: null,
  selectedMainThingCode: '',
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
