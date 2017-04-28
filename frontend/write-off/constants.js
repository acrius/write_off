const HOST_API = 'http://127.0.0.1:8000/';
const create_query = (target) => HOST_API + 'api/v01/' + target;

export const GET_REQUEST = 'GET_REQUEST';
export const GET_FAILED = 'GET_FAILED';
export const GET_SUCCESS = 'GET_SUCCESS';

export const GET_SUBDIVISIONS_QUERY = create_query('subdivisions');
export const GET_MAIN_THINGS_QUERY = create_query('main_things');
export const GET_STORAGES_QUERY = create_query('storages');
export const GET_ACTS_QUERY = create_query('acts');
export const GET_ACT_TABLE_QUERY = create_query('act_table') + '/?act=';
export const GET_REMAINS_QUERY = create_query('remains') + '/?storage=';

export const GET_QUERIES_OF_MODELS = {
  subdivisions: GET_SUBDIVISIONS_QUERY,
  mainThings: GET_MAIN_THINGS_QUERY,
  storages: GET_STORAGES_QUERY,
  acts: GET_ACTS_QUERY,
  actTable: GET_ACT_TABLE_QUERY,
  remains: GET_REMAINS_QUERY
};

export const GET_UPDATED_SUBDIVISIONS_QUERY = create_query('get_updated_subdivisions');
export const GET_UPDATED_MAIN_THINGS_QUERY = create_query('get_updated_main_things');
export const GET_UPDATED_STORAGES_QUERY = create_query('get_updated_storages');
export const GET_UPDATED_REMAINS_QUERY = create_query('get_updated_remains') + '/?storage=';
export const GENERATE_ACTS_QUERY = create_query('genereate_acts') + '/?subdivision=';

export const GET_UPDATED_QUERIES_OF_MODELS = {
  subdivisions: GET_UPDATED_SUBDIVISIONS_QUERY,
  mainThings: GET_UPDATED_MAIN_THINGS_QUERY,
  storages: GET_UPDATED_STORAGES_QUERY,
  remains: GET_UPDATED_REMAINS_QUERY
};

export const POST_REQUEST = 'POST_REQUEST';
export const POST_FAILED = 'POST_FAILED';

export const POST_ACT_SUCCESS = 'POST_ACT_SUCCESS';
export const POST_ACT_TABLE_SUCCESS = 'POST_ACT_TABLE_SUCCESS';

export const SET_STATE = 'SET_STATE';

export const OPEN_ACT = 'OPEN_ACT';
export const CLOSE_ACT = 'CLOSE_ACT';

export const POST_ACT_QUERY = create_query('acts');
export const POST_ACT_TABLE_QUERY = create_query('act_table') + '/?act=';
export const POST_ACT_ACTIVATE_QUERY = create_query('activate_act') + '/?act=';
export const POST_ACT_UPLOADS_QUERY = create_query('upload_acts') + '/?storage=';

export const WRITE_OF_TYPE = 'Списание';
export const MOVING_TYPE = 'Перемещение';
export const ACT_TYPES = [WRITE_OF_TYPE, MOVING_TYPE];

export const WRITE_OFF = 'WRITE_OFF';

export const PRINT_START = 'START_PRINT';
export const PRINT_SUCCESS = 'PRINT_SUCCESS';

export const STOREKEEPERS = ['Скубиро А.Л.', 'Сучков Д.Ю.']
