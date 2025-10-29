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
    case 'GET_ALL_DATA_CONTENT':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_CONTENT':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_CONTENT':
      return { ...state, selected: action.selected }
    case 'ADD_CONTENT':
      return { ...state, add: action.data }
    case 'UPDATE_CONTENT':
      return { ...state, update: action.data }
    case 'DELETE_CONTENT':
      return { ...state }
    case 'RESET_CONTENT':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_CONTENT':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_CONTENT':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_CONTENT':
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
