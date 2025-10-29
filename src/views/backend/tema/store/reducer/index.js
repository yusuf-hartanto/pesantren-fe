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
    case 'GET_ALL_DATA_TEMA':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_TEMA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_TEMA':
      return { ...state, selected: action.selected }
    case 'ADD_TEMA':
      return { ...state, add: action.data }
    case 'UPDATE_TEMA':
      return { ...state, update: action.data }
    case 'DELETE_TEMA':
      return { ...state }
    case 'RESET_TEMA':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_TEMA':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_TEMA':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_TEMA':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'PROGRESS_TEMAs':
      return {
        ...state,
        progress: action.progress
      }
    default:
      return { ...state }
  }
}
export default reducers
