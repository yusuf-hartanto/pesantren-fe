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
    case 'GET_ALL_DATA_REPORT_ARTICLE':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_REPORT_ARTICLE':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_REPORT_ARTICLE':
      return { ...state, selected: action.selected }
    case 'ADD_REPORT_ARTICLE':
      return { ...state, add: action.data }
    case 'UPDATE_REPORT_ARTICLE':
      return { ...state, update: action.data }
    case 'DELETE_REPORT_ARTICLE':
      return { ...state }
    case 'RESET_REPORT_ARTICLE':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_REPORT_ARTICLE':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_REPORT_ARTICLE':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_REPORT_ARTICLE':
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
