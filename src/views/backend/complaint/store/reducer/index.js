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
    case 'GET_ALL_DATA_COMPLAINT':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_COMPLAINT':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_COMPLAINT':
      return { ...state, selected: action.selected }
    case 'ADD_COMPLAINT':
      return { ...state, add: action.data }
    case 'UPDATE_COMPLAINT':
      return { ...state, update: action.data }
    case 'DELETE_COMPLAINT':
      return { ...state }
    case 'RESET_COMPLAINT':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_COMPLAINT':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_COMPLAINT':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_COMPLAINT':
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
