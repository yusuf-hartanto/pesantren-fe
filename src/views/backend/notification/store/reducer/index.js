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
  update: null
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_NOTIFICATION':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_NOTIFICATION':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_NOTIFICATION':
      return { ...state, selected: action.selected }
    case 'ADD_NOTIFICATION':
      return { ...state, add: action.data }
    case 'UPDATE_NOTIFICATION':
      return { ...state, update: action.data }
    case 'DELETE_NOTIFICATION':
      return { ...state }
    case 'RESET_NOTIFICATION':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_NOTIFICATION':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_NOTIFICATION':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_NOTIFICATION':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default reducers
