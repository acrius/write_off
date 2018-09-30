const models = {
  subdivisions: [],
  storages: [],
  acts: [],
  actTable: [],
  remains: [],
  mainThings: [],
  storekeepers: []
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
  selectedStorekeeper: '',
  selectedUploadActs: [],
  selectedUploadStartDate: null,
  selectedUploadStartDateString: null,
  selectedUploadEndDate: null,
  selectedUploadEndDateString: null,
};

const uiValues = {
  uploadError: false,
  uploadComplete: false,
  openAct: false,
  fetching: false,
  showLastActs: 70,
  startDate: null,
  startDateString: '',
  endDate: null,
  endDateString: '',
  error: ''
};

const initialState = {
  ...models,
  ...selectedFields,
  ...uiValues
};

export default initialState;
