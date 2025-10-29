// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: null,
  selected: null,
  loading: false,
  error: null,
  success: false,
  add: null,
  update: null,
  progress: null
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_KOMUNITAS':
      return { ...state, allData: action.data }
    case 'GET_DATA_KOMUNITAS':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_KOMUNITAS':
      return { ...state, selected: action.selected }
    case 'ADD_KOMUNITAS':
      return { ...state, add: action.data }
    case 'UPDATE_KOMUNITAS':
      return { ...state, update: action.data }
    case 'DELETE_KOMUNITAS':
      return { ...state }
    case 'RESET_KOMUNITAS':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_KOMUNITAS':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_KOMUNITAS':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_KOMUNITAS':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'PROGRESS_KOMUNITAS':
      return {
        ...state,
        progress: action.progress
      }
    default:
      return { ...state }
  }
}
export default reducers
