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
  add_semester: null,
  update_semester: null
}

const semesters = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_SEMESTER':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_SEMESTER':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_SEMESTER':
      return { ...state, selected: action.selected }
    case 'ADD_SEMESTER':
      return { ...state, add_semester: action.data }
    case 'UPDATE_SEMESTER':
      return { ...state, update_semester: action.data }
    case 'DELETE_SEMESTER':
      return { ...state }
    case 'RESET_SEMESTER':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_SEMESTER':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_SEMESTER':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_SEMESTER':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default semesters
