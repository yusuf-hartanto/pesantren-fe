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
    case 'GET_ALL_DATA_GALLERY':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_GALLERY':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_GALLERY':
      return { ...state, selected: action.selected }
    case 'ADD_GALLERY':
      return { ...state, add: action.data }
    case 'UPDATE_GALLERY':
      return { ...state, update: action.data }
    case 'DELETE_GALLERY':
      return { ...state }
    case 'RESET_GALLERY':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_GALLERY':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_GALLERY':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_GALLERY':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'PROGRESS_GALLERY':
      return {
        ...state,
        progress: action.progress
      }
    default:
      return { ...state }
  }
}
export default reducers
